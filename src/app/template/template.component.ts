import { Component } from '@angular/core';
import { UserContextService } from '../user-context.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent {
  constructor(public uc: UserContextService, private router: Router) {}

  logout() {
    this.uc.signOut().then(() => this.router.navigate(['/']));
  }
}
