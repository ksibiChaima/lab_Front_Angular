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
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { MemberGuard } from '../guards/member.guard';
import { ToolFormComponent } from './tool/tool-form.component';
import { PublicationFormComponent } from './publication/publication-form.component';

const routes: Routes = [
  // Public / auth
  { path: '', pathMatch: 'full', component: LoginComponent },

  // Dashboard (authenticated users)
  { path: 'dashboard', pathMatch: 'full', component: DashboardComponent, canActivate: [AuthGuard] },

  // Members (public view)
  { path: 'member', pathMatch: 'full', component: MemberComponent },
  { path: 'member/:id', pathMatch: 'full', component: MemberProfileComponent },

  // Publications (public view)
  { path: 'publications', pathMatch: 'full', component: PublicationListComponent },
  { path: 'publications/:id', pathMatch: 'full', component: PublicationDetailComponent },

  // Events (public view)
  { path: 'events', pathMatch: 'full', component: EventComponent },

  // Outils (public view)
  { path: 'outils', pathMatch: 'full', component: OutilListComponent },
  { path: 'outils/:id', pathMatch: 'full', component: OutilDetailComponent },
  { path: 'tools', pathMatch: 'full', redirectTo: 'outils' },

  // Articles (legacy placeholder)
  { path: 'articles', pathMatch: 'full', component: ArticleComponent },

  // Member-only routes
  { path: 'create', pathMatch: 'full', component: MemberFormComponent, canActivate: [AuthGuard] },
  { path: 'member/create', pathMatch: 'full', component: MemberFormComponent, canActivate: [AuthGuard] },
  { path: 'member/:id/edit', pathMatch: 'full', component: MemberFormComponent, canActivate: [AuthGuard] },
  { path: 'profile', pathMatch: 'full', component: MemberProfileComponent, canActivate: [MemberGuard] },

  // Admin-only routes
  { path: 'admin/members', pathMatch: 'full', component: AdminMembersComponent, canActivate: [AdminGuard] },
  
  // Tool and Publication creation routes
  { path: 'tool/create', pathMatch: 'full', component: ToolFormComponent, canActivate: [AuthGuard] },
  { path: 'tool/edit/:id', pathMatch: 'full', component: ToolFormComponent, canActivate: [AuthGuard] },
  { path: 'PUBLICATION/publications/create', pathMatch: 'full', component: PublicationFormComponent, canActivate: [AuthGuard] },
  { path: 'PUBLICATION/publications/edit/:id', pathMatch: 'full', component: PublicationFormComponent, canActivate: [AuthGuard] },

  // Fallback
  { path: '**', component: MemberComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
