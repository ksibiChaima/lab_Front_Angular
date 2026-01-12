import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private afAuth: AngularFireAuth, private functions: AngularFireFunctions) {}

  // Fonction pour définir le rôle d'un utilisateur (admin seulement)
  async setUserRole(uid: string, role: 'admin' | 'member'): Promise<void> {
    const callable = this.functions.httpsCallable('setUserRole');
    return callable({ uid, role }).toPromise();
  }

  // Vérifier si l'utilisateur courant est admin
  async isAdmin(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    if (!user) return false;
    
    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims['admin'] === true;
  }

  // Obtenir le rôle de l'utilisateur
  async getUserRole(): Promise<string> {
    const user = await this.afAuth.currentUser;
    if (!user) return 'guest';
    
    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims['role'] as string || 'member';
  }
}
