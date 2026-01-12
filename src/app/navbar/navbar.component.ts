import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserContextService } from '../user-context.service';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar color="primary">
      <mat-toolbar-row>
        <span>Laboratoire de Recherche</span>
        <span class="spacer"></span>
        
        <!-- Public links -->
        <button mat-button routerLink="/member">Membres</button>
        <button mat-button routerLink="/publications">Publications</button>
        <button mat-button routerLink="/outils">Outils</button>
        <button mat-button routerLink="/events">Événements</button>
        
        <!-- Authenticated user links -->
        <div *ngIf="userContext.isMember()">
          <button mat-button routerLink="/dashboard">Tableau de bord</button>
          <button mat-button routerLink="/profile">Mon Profil</button>
        </div>
        
        <!-- Admin links -->
        <div *ngIf="userContext.isAdmin()">
          <button mat-button routerLink="/admin/members">Admin</button>
        </div>
        
        <!-- User menu -->
        <div *ngIf="!userContext.isGuest()">
          <span>{{ userContext.getCurrent().email }}</span>
          <button mat-icon-button (click)="signOut()">
            <mat-icon>logout</mat-icon>
          </button>
        </div>
        
        <!-- Guest login -->
        <div *ngIf="userContext.isGuest()">
          <button mat-button routerLink="/">Connexion</button>
        </div>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    mat-toolbar-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class NavbarComponent {
  constructor(public userContext: UserContextService, private router: Router) {}

  signOut() {
    this.userContext.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
