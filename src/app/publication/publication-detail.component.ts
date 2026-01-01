import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publication } from 'src/model/Publication';
import { PublicationService } from 'src/services/publication.service';
import { MemberService } from 'src/services/member.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-publication-detail',
  templateUrl: './publication-detail.component.html',
  styleUrls: ['./publication-detail.component.css']
})
export class PublicationDetailComponent implements OnInit {
  pub?: Publication;
  authors: any[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pubService: PublicationService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/publications']); return; }
    this.loading = true;
    this.pubService.getById(id).subscribe((p) => {
      this.pub = p;
      if (p?.authorIds?.length) {
        // resolve Observables to promises with lastValueFrom
        Promise.all(p.authorIds.map(aid => lastValueFrom(this.memberService.getMemberByID(aid))))
          .then(res => this.authors = res)
          .finally(() => (this.loading = false));
      } else {
        this.loading = false;
      }
    }, () => (this.loading = false));
  }
}
