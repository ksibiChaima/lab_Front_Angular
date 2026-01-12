import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserContextService } from '../app/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class MemberGuard implements CanActivate {
  constructor(private userContext: UserContextService, private router: Router) {}

  canActivate(): boolean {
    const user = this.userContext.getCurrent();
    if (user.role !== 'member' && user.role !== 'admin') {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
