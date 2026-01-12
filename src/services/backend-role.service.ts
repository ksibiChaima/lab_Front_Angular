import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MemberService } from 'src/services/member.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserRole {
  uid: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BackendRoleService {
  private readonly API_URL = '/MEMBER/api/roles';

  constructor(
    private afAuth: AngularFireAuth, 
    private ms: MemberService,
    private http: HttpClient
  ) {}

  // Créer/mettre à jour le rôle via backend
  setUserRole(uid: string, email: string, role: 'admin' | 'member'): Observable<any> {
    const userRole: UserRole = {
      uid,
      email,
      role,
      createdAt: new Date()
    };

    return this.http.post(`${this.API_URL}`, userRole);
  }

  // Obtenir le rôle depuis le backend
  getUserRole(uid: string): Observable<UserRole | null> {
    return this.http.get<UserRole>(`${this.API_URL}/${uid}`);
  }

  // Vérifier si admin via backend
  isAdmin(uid: string): Observable<boolean> {
    return this.getUserRole(uid).pipe(
      map((role: UserRole | null) => role?.role === 'admin')
    );
  }

  // Alternative: Vérifier si l'email est admin (simple)
  isAdminByEmail(email: string): boolean {
    const adminEmails = ['admin@labo.tn', 'hatem.benali@enis.tn'];
    return adminEmails.includes(email);
  }
}
