import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MemberService } from 'src/services/member.service';

export interface UserContext {
  id?: string; // member id from json-server
  uid?: string; // firebase uid
  email?: string;
  role: 'admin'|'member'|'guest'|string;
}

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private ctx: UserContext = { role: 'guest' };

  constructor(private afAuth: AngularFireAuth, private ms: MemberService) {
    this.afAuth.authState.subscribe(u => {
      if (u) {
        this.ctx.uid = u.uid;
        this.ctx.email = u.email || undefined;
        this.ctx.role = 'member';
        // try to find member record by email
        if (this.ctx.email) {
          this.ms.GetAllMembers().subscribe(list => {
            const found = list.find(m => m.email === this.ctx.email || m.name === this.ctx.email);
            if (found) this.ctx.id = found.id;
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

  setRole(role: UserContext['role']) { this.ctx.role = role; }

  signOut() {
    return this.afAuth.signOut();
  }
}
