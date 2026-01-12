import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MemberService } from 'src/services/member.service';
import { RealtimeRoleService } from '../services/realtime-role.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private predefinedUsers = [
    {
      email: 'etd1@gmail.com',
      password: 'password123',
      name: 'Youssef Abid',
      type: 'student',
      sujet: 'Federated Learning',
      diplome: 'mastère',
      encadreurId: '4', // Hatem Ben Ali
      dateInscription: '2026-01-12'
    },
    {
      email: 'etd2@gmail.com', 
      password: 'password123',
      name: 'Sarra Mejri',
      type: 'student',
      sujet: 'Machine Learning',
      diplome: 'mastère',
      encadreurId: '4',
      dateInscription: '2026-01-12'
    },
    {
      email: 'etd3@gmail.com',
      password: 'password123', 
      name: 'Amine Rekik',
      type: 'student',
      sujet: 'IA',
      diplome: 'mastère',
      encadreurId: '4',
      dateInscription: '2026-01-12'
    },
    {
      email: 'hatem.benali@enis.tn',
      password: 'admin123',
      name: 'Hatem Ben Ali',
      type: 'enseignant',
      grade: 'Maître Assistant',
      etablissement: 'ENIS'
    }
  ];

  constructor(
    private afAuth: AngularFireAuth,
    private ms: MemberService,
    private roleService: RealtimeRoleService
  ) {}

  // Créer les utilisateurs prédéfinis
  async createPredefinedUsers() {
    for (const user of this.predefinedUsers) {
      try {
        // Créer l'utilisateur Firebase
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(
          user.email, 
          user.password
        );

        // Créer le membre dans le backend
        const memberData = {
          ...user,
          cin: Math.random().toString(36).substring(2, 9).toUpperCase(),
          email: user.email,
          prenom: user.name.split(' ')[0],
          nom: user.name.split(' ').slice(1).join(' '),
          dateInscription: user.dateInscription || new Date().toISOString().split('T')[0]
        };

        await this.ms.addMember(memberData as any).toPromise();

        // Définir le rôle dans Realtime Database
        const role = user.email.includes('hatem.benali') ? 'admin' : 'member';
        await this.roleService.setUserRole(
          userCredential.user?.uid || '',
          user.email,
          role as 'admin' | 'member'
        );

        console.log(`✅ Utilisateur créé: ${user.email} (${role})`);
      } catch (error) {
        console.error(`❌ Erreur création ${user.email}:`, error);
      }
    }
  }

  // Améliorer l'inscription normale
  async registerUser(userData: any) {
    try {
      // Créer l'utilisateur Firebase
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        userData.email,
        userData.password
      );

      // Préparer les données pour le backend
      const memberData = {
        ...userData,
        cin: userData.cin || Math.random().toString(36).substring(2, 9).toUpperCase(),
        prenom: userData.name?.split(' ')[0] || userData.email?.split('@')[0],
        nom: userData.name?.split(' ').slice(1).join(' ') || 'User',
        dateInscription: new Date().toISOString().split('T')[0]
      };

      // Créer le membre dans le backend
      await this.ms.addMember(memberData as any).toPromise();

      // Définir le rôle par défaut
      await this.roleService.setUserRole(
        userCredential.user?.uid || '',
        userData.email,
        'member'
      );

      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error };
    }
  }
}
