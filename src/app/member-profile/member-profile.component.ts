import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserContextService } from '../user-context.service';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css']
})
export class MemberProfileComponent implements OnInit {
  member: any;
  loading = false;

  constructor(private ms: MemberService, private route: ActivatedRoute, private router: Router, public uc: UserContextService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || this.uc.getCurrent().id;
    if (!id) { this.router.navigate(['/member']); return; }
    this.loading = true;
    this.ms.getMemberByID(id).subscribe(m => { this.member = m; this.loading = false; }, () => (this.loading = false));
  }
}
