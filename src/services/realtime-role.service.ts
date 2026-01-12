import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserRole {
  uid: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeRoleService {
  private readonly ROLES_PATH = '/userRoles';

  constructor(private db: AngularFireDatabase) {}

  // Créer/mettre à jour le rôle d'un utilisateur
  setUserRole(uid: string, email: string, role: 'admin' | 'member'): Promise<void> {
    const userRole: UserRole = {
      uid,
      email,
      role,
      createdAt: new Date().toISOString()
    };

    return this.db.object(`${this.ROLES_PATH}/${uid}`).set(userRole);
  }

  // Obtenir le rôle d'un utilisateur
  getUserRole(uid: string): Observable<UserRole | null> {
    return this.db.object<UserRole>(`${this.ROLES_PATH}/${uid}`)
      .valueChanges()
      .pipe(map(role => role || null));
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(uid: string): Observable<boolean> {
    return this.getUserRole(uid).pipe(
      map(role => role?.role === 'admin')
    );
  }

  // Obtenir tous les utilisateurs (pour admin)
  getAllUsers(): Observable<UserRole[]> {
    return this.db.list<UserRole>(this.ROLES_PATH)
      .valueChanges();
  }

  // Supprimer un utilisateur (admin seulement)
  deleteUserRole(uid: string): Promise<void> {
    return this.db.object(`${this.ROLES_PATH}/${uid}`).remove();
  }

  // Mettre à jour le rôle
  updateUserRole(uid: string, role: 'admin' | 'member'): Promise<void> {
    return this.db.object(`${this.ROLES_PATH}/${uid}/role`).set(role);
  }
}
