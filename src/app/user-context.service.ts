import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MemberService } from 'src/services/member.service';
import { RealtimeRoleService, UserRole } from '../services/realtime-role.service';

export interface UserContext {
  id?: string; // member id from backend
  uid?: string; // firebase uid
  email?: string;
  role: 'admin'|'member'|'guest'|string;
  member?: any; // full member data
}

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private ctx: UserContext = { role: 'guest' };

  constructor(
    private afAuth: AngularFireAuth, 
    private ms: MemberService,
    private roleService: RealtimeRoleService
  ) {
    this.afAuth.authState.subscribe(async (u) => {
      if (u) {
        this.ctx.uid = u.uid;
        this.ctx.email = u.email || undefined;
        
        // Get role from Realtime Database
        this.roleService.getUserRole(u.uid).subscribe((userRole: UserRole | null) => {
          if (userRole) {
            this.ctx.role = userRole.role;
          } else {
            // Default role for new users
            this.ctx.role = 'member';
            // Create role in Realtime Database
            this.roleService.setUserRole(u.uid, u.email || '', 'member');
          }
        });

        // try to find member record by email
        if (this.ctx.email) {
          this.ms.GetAllMembers().subscribe(list => {
            const found = list.find(m => m.email === this.ctx.email || m.name === this.ctx.email);
            if (found) {
              this.ctx.id = found.id;
              this.ctx.member = found;
            }
          });
        }
      } else {
        this.ctx = { role: 'guest' };
      }
    });
  }

  getCurrent() {
    return this.ctx;
  }

  isAdmin() { return this.ctx.role === 'admin'; }
  isMember() { return this.ctx.role === 'member' || this.ctx.role === 'admin'; }
  isGuest() { return this.ctx.role === 'guest'; }

  setRole(role: UserContext['role']) { 
    this.ctx.role = role;
    // Update role in Realtime Database
    if (this.ctx.uid && this.ctx.email) {
      this.roleService.updateUserRole(this.ctx.uid, role as 'admin' | 'member');
    }
  }

  signOut() {
    return this.afAuth.signOut();
  }
}
