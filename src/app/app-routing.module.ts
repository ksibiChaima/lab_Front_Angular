import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberFormComponent } from './member-form/member-form.component';
import { MemberComponent } from './member/member.component';
import { EventComponent } from './event/event.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolComponent } from './tool/tool.component';
import { ArticleComponent } from './article/article.component';
import { LoginComponent } from './login/login.component';
import { PublicationListComponent } from './publication/publication-list.component';
import { PublicationDetailComponent } from './publication/publication-detail.component';
import { OutilListComponent } from './outil/outil-list.component';
import { OutilDetailComponent } from './outil/outil-detail.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { AdminMembersComponent } from './admin/admin-members.component';

const routes: Routes = [
  // Public / auth
  { path: '', pathMatch: 'full', component: LoginComponent },

  // Dashboard
  { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },

  // Members
  { path: 'member', pathMatch: 'full', component: MemberComponent },
  { path: 'create', pathMatch: 'full', component: MemberFormComponent },
  { path: 'member/create', pathMatch: 'full', component: MemberFormComponent },
  // member edit (scoped under member to avoid collisions)
  { path: 'member/:id/edit', pathMatch: 'full', component: MemberFormComponent },

  // Events
  { path: 'events', pathMatch: 'full', component: EventComponent },

  // Publications
  { path: 'publications', pathMatch: 'full', component: PublicationListComponent },
  { path: 'publications/:id', pathMatch: 'full', component: PublicationDetailComponent },

  // Outils (tools)
  { path: 'outils', pathMatch: 'full', component: OutilListComponent },
  { path: 'outils/:id', pathMatch: 'full', component: OutilDetailComponent },
  // legacy /tools route -> redirect to /outils
  { path: 'tools', pathMatch: 'full', redirectTo: 'outils' },

  // Articles (legacy placeholder)
  { path: 'articles', pathMatch: 'full', component: ArticleComponent },

  // Profile and admin
  { path: 'profile', pathMatch: 'full', component: MemberProfileComponent },
  { path: 'admin/members', pathMatch: 'full', component: AdminMembersComponent },

  // Fallback
  { path: '**', component: MemberComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
