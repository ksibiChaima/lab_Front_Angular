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
    this.pubService.getById(id).subscribe({
      next: async (p: Publication) => {
        this.pub = p;

        const ids = (p.authorIds || []).map(String).filter(Boolean);
        if (!ids.length) {
          this.authors = [];
          this.loading = false;
          return;
        }

        try {
          const members = await Promise.all(
            ids.map((authorId: string) => lastValueFrom(this.memberService.getMemberByID(authorId)))
          );
          this.authors = members.map((m: any, idx: number) => ({
            id: ids[idx],
            name: (m?.name || `${m?.firstName || ''} ${m?.lastName || ''}`.trim()),
            email: m?.email
          }));
        } finally {
          this.loading = false;
        }
      },
      error: () => (this.loading = false)
    });
  }
}
