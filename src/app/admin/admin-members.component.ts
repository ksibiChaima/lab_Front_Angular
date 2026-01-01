import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/services/member.service';
import { UserContextService } from 'src/app/user-context.service';

@Component({
  selector: 'app-admin-members',
  templateUrl: './admin-members.component.html',
  styleUrls: ['./admin-members.component.css']
})
export class AdminMembersComponent implements OnInit {
  members: any[] = [];
  loading = false;

  constructor(private ms: MemberService, public uc: UserContextService) {}

  ngOnInit(): void {
    this.loading = true;
    this.ms.GetAllMembers().subscribe(m => { this.members = m || []; this.loading = false; }, () => (this.loading = false));
  }

  delete(id: string) {
    if (!confirm('Delete member?')) return;
    this.ms.deleteMemberById(id).subscribe(() => this.members = this.members.filter(m => m.id !== id));
  }
}
