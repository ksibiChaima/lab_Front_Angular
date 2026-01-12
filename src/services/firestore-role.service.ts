import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
export class FirestoreRoleService {
  private readonly collectionName = 'userRoles';

  constructor(private firestore: AngularFirestore) {}

  // Créer/mettre à jour le rôle d'un utilisateur
  setUserRole(uid: string, email: string, role: 'admin' | 'member'): Promise<void> {
    const userRole: UserRole = {
      uid,
      email,
      role,
      createdAt: new Date()
    };

    return this.firestore.collection(this.collectionName)
      .doc(uid)
      .set(userRole);
  }

  // Obtenir le rôle d'un utilisateur
  getUserRole(uid: string): Observable<UserRole | null> {
    return this.firestore.collection(this.collectionName)
      .doc<UserRole>(uid)
      .valueChanges()
      .pipe(map(role => role || null));
  }

  // Vérifier si admin
  isAdmin(uid: string): Observable<boolean> {
    return this.getUserRole(uid).pipe(
      map((role: UserRole | null) => role?.role === 'admin')
    );
  }
}
