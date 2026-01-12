import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Member } from 'src/model/Member';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  /*varible : type */ 
   constructor( private httpClient: HttpClient) { }

  GetAllMembers():Observable<Member[]>

{
  // Use configured backend URL and normalize backend field names (nom/prenom => firstName/lastName/name)
  return this.httpClient.get<any[]>(`${environment.memberServiceUrl}`).pipe(
    map(list => list.map(item => this.normalizeMember(item)))
  );
}
addMember(f:Member):Observable<void>
{ // on met le meme type void car j'attends pas la reception des donnees
  //f est l'emlment a insere au niveau de la base

  // DETERMINE TYPE FIRST before normalizing
  const kind = this.getBackendKind(f as any);
  console.log('Adding member with kind:', kind);
  
  const payload = this.normalizeOutboundMember(f as any, kind);
  const url = kind ? `${environment.memberServiceUrl}/${kind}` : `${environment.memberServiceUrl}`;
  
  console.log('Final URL:', url);
  console.log('Final payload:', payload);
  
  return this.httpClient.post<void>(url, payload)
}
deleteMemberById(id:string): Observable<void>{
  return this.httpClient.delete<void>(`${environment.memberServiceUrl}/${id}`);
    


}
getMemberByID(id: string ):Observable<Member>

{
  return this.httpClient.get<any>(`${environment.memberServiceUrl}/${id}`).pipe(
    map(item => this.normalizeMember(item))
  );
}

  /**
   * Fetch a full member record (including publications filled by backend via /fullmember/{id})
   * Uses MEMBER service base URL because /fullmember is at the service root level.
   */
  getFullMember(id: string): Observable<Member> {
    const url = `/MEMBER/fullmember/${id}`;
    return this.httpClient.get<any>(url).pipe(map(item => {
      const m = this.normalizeMember(item);
      // backend returns 'pubs' as PublicationBean[]
      if (item.pubs) m.publications = item.pubs;
      return m;
    }));
  }
// Récupérer les étudiants encadrés par un enseignant
  getSupervisedStudents(teacherId: string): Observable<Member[]> {
    return this.httpClient.get<Member[]>(`${environment.memberServiceUrl}/${teacherId}/supervised-students`);
  }

  updateMember(id:string ,f:Member) :Observable<void>
{
  const payload = this.normalizeOutboundMember(f as any);
  const kind = this.getBackendKind(payload);
  // backend exposes PUT /membres/etudiant/{id} and PUT /membres/enseignant/{id}
  const url = kind ? `${environment.memberServiceUrl}/${kind}/${id}` : `${environment.memberServiceUrl}/${id}`;
  return this.httpClient.put<void>(url, payload)
}

  private getBackendKind(payload: any): 'etudiant' | 'enseignant' | null {
    const t = (payload?.type ?? '').toString().toLowerCase();
    console.log('Determining backend kind for type:', t);
    
    if (t === 'student' || t === 'etudiant' || t.includes('stud')) return 'etudiant';
    if (t === 'enseignant' || t === 'teacher' || t.includes('ens') || t.includes('teacher')) return 'enseignant';
    
    // fallback based on known backend fields
    if (payload?.grade) return 'enseignant';
    if (payload?.diplome || payload?.diploma) return 'etudiant';
    
    console.log('Could not determine backend kind, fallback to null');
    return null;
  }

  private normalizeOutboundMember(payload: any, kind?: 'etudiant' | 'enseignant' | null): any {
    if (!payload) return payload;
    const out: any = { ...payload };

    // Use kind parameter if provided, otherwise determine it
    const finalKind = kind || this.getBackendKind(out);
    console.log('Backend kind determined:', finalKind, 'from payload type:', out.type);

    // legacy UI field: name => backend expects prenom/nom
    if (out.name && (!out.prenom && !out.nom)) {
      const parts = String(out.name).trim().split(/\s+/).filter(Boolean);
      if (parts.length > 0) {
        out.prenom = parts[0];
        out.nom = parts.slice(1).join(' ') || parts[0];
      }
    }
    // Remove name field as it's not needed in backend
    delete out.name;

    // legacy UI field: createDate => backend uses dateInscription
    if (out.createDate && !out.dateInscription) out.dateInscription = out.createDate;

    // diploma naming differences
    if (out.diploma && !out.diplome) out.diplome = out.diploma;
    if (out.diplome && !out.diploma) out.diploma = out.diplome;

    // Map form fields to backend fields BEFORE removing form fields
    if (out.sujetThese && !out.sujet) out.sujet = out.sujetThese;
    if (out.encadreurId && !out.encadrant) {
      out.encadrant = { id: out.encadreurId };
    }
    if (out.anneeInscription && !out.dateInscription) {
      out.dateInscription = new Date(out.anneeInscription).toISOString().split('T')[0];
    }

    // Remove form-only fields that backend doesn't understand
    delete out.sujetThese;
    delete out.encadreurId;
    delete out.anneeInscription;
    delete out.niveau;
    delete out.departement;
    delete out.laboratoire;
    delete out.specialites;

    // Clean up payload for specific backend entity types
    if (finalKind === 'etudiant') {
      // For Etudiant entity, only send fields that exist in Etudiant class
      const studentPayload: any = {};
      // Basic Membre fields
      if (out.cin) studentPayload.cin = out.cin;
      if (out.prenom) studentPayload.prenom = out.prenom;
      if (out.nom) studentPayload.nom = out.nom;
      if (out.email) studentPayload.email = out.email;
      if (out.password) studentPayload.password = out.password;
      if (out.dateNaissance) studentPayload.dateNaissance = out.dateNaissance;
      if (out.photo) studentPayload.photo = out.photo;
      if (out.cv) studentPayload.cv = out.cv;
      // Etudiant-specific fields
      if (out.diplome) studentPayload.diplome = out.diplome;
      if (out.sujet) studentPayload.sujet = out.sujet;
      if (out.dateInscription) studentPayload.dateInscription = out.dateInscription;
      if (out.encadrant) studentPayload.encadrant = out.encadrant;
      return studentPayload;
    } else if (finalKind === 'enseignant') {
      // For EnseignantChercheur entity, only send fields that exist in EnseignantChercheur class
      const teacherPayload: any = {};
      // Basic Membre fields
      if (out.cin) teacherPayload.cin = out.cin;
      if (out.prenom) teacherPayload.prenom = out.prenom;
      if (out.nom) teacherPayload.nom = out.nom;
      if (out.email) teacherPayload.email = out.email;
      if (out.password) teacherPayload.password = out.password;
      if (out.dateNaissance) teacherPayload.dateNaissance = out.dateNaissance;
      if (out.photo) teacherPayload.photo = out.photo;
      if (out.cv) teacherPayload.cv = out.cv;
      // Enseignant-specific fields
      if (out.grade) teacherPayload.grade = out.grade;
      if (out.etablissement) teacherPayload.etablissement = out.etablissement;
      return teacherPayload;
    }

    return out;
  }

  private normalizeMember(item: any): Member {
    if (!item) return item;
    const m: Member = {
      id: item.id?.toString?.() ?? String(item.id),
      cin: item.cin,
      firstName: item.prenom || item.firstName || undefined,
      lastName: item.nom || item.lastName || undefined,
      name: (item.prenom && item.nom) ? `${item.prenom} ${item.nom}` : (item.name || `${item.nom || ''} ${item.prenom || ''}`.trim()),
      type: item.type || (item.grade || item.diplome ? (item.diplome ? 'student' : 'enseignant') : undefined),
      createDate: item.dateInscription || item.createDate,
      birthDate: item.dateNaissance || item.birthDate,
      photoUrl: item.photo || item.photoUrl,
      cvUrl: item.cv || item.cvUrl,
      email: item.email,
      password: item.password,
      grade: item.grade,
      etablissement: item.etablissement,
      diploma: item.diplome || item.diploma,
      dateInscription: item.dateInscription,
      sujet: item.sujet,
      supervisedStudents: item.supervisedStudents || [],
      publications: item.pubs || item.publications || [],
      outils: item.outils || [],
      events: item.events || [],
      encadrant: item.encadrant ? {
        id: item.encadrant.id?.toString?.() ?? String(item.encadrant.id),
        cin: item.encadrant.cin,
        firstName: item.encadrant.prenom,
        lastName: item.encadrant.nom,
        email: item.encadrant.email,
        grade: item.encadrant.grade
      } : undefined
    };
    return m;
  }
 
}
