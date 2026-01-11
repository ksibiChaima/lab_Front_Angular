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

  const payload = this.normalizeOutboundMember(f as any);
  const kind = this.getBackendKind(payload);
  const url = kind ? `${environment.memberServiceUrl}/${kind}` : `${environment.memberServiceUrl}`;
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
   * Uses gateway root because /fullmember is exposed at gateway-level controller.
   */
  getFullMember(id: string): Observable<Member> {
    const url = `${environment.gatewayUrl}/fullmember/${id}`;
    return this.httpClient.get<any>(url).pipe(map(item => {
      const m = this.normalizeMember(item);
      // backend returns 'pubs' as PublicationBean[]
      if (item.pubs) m.publications = item.pubs;
      return m;
    }));
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
    if (t.includes('ens') || t.includes('teacher') || t.includes('enseignant')) return 'enseignant';
    if (t.includes('stud') || t.includes('etudiant') || t.includes('student')) return 'etudiant';
    // fallback based on known backend fields
    if (payload?.grade) return 'enseignant';
    if (payload?.diplome || payload?.diploma) return 'etudiant';
    return null;
  }

  private normalizeOutboundMember(payload: any): any {
    if (!payload) return payload;
    const out: any = { ...payload };

    // legacy UI field: name => backend expects prenom/nom
    if (out.name && (!out.prenom && !out.nom)) {
      const parts = String(out.name).trim().split(/\s+/).filter(Boolean);
      if (parts.length > 0) {
        out.prenom = parts[0];
        out.nom = parts.slice(1).join(' ') || parts[0];
      }
    }

    // legacy UI field: createDate => backend uses dateInscription
    if (out.createDate && !out.dateInscription) out.dateInscription = out.createDate;

    // diploma naming differences
    if (out.diploma && !out.diplome) out.diplome = out.diploma;
    if (out.diplome && !out.diploma) out.diploma = out.diplome;

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
