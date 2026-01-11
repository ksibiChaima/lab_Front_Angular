import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserContextService } from '../user-context.service';
import { PublicationService } from 'src/services/publication.service';
import { OutilService } from 'src/services/outil.service';
import { EvtService } from 'src/services/evt.service';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css']
})
export class MemberProfileComponent implements OnInit {
  member: any;
  memberPublications: any[] = [];
  memberOutils: any[] = [];
  memberEvents: any[] = [];
  supervisedStudents: any[] = [];
  loading = false;

  constructor(
    private ms: MemberService,
    private pubService: PublicationService,
    private outilService: OutilService,
    private evtService: EvtService,
    private route: ActivatedRoute,
    private router: Router,
    public uc: UserContextService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || this.uc.getCurrent().id;
    if (!id) { this.router.navigate(['/member']); return; }
    this.loading = true;
    // request the full member (with publications populated)
    this.ms.getFullMember(id).subscribe({
      next: (m) => {
        this.member = m;
        this.afterMemberLoaded();
      },
      error: () => {
        // fallback to basic member fetch
        this.ms.getMemberByID(id).subscribe({
          next: (b) => {
            this.member = b;
            this.afterMemberLoaded();
          },
          error: () => (this.loading = false)
        });
      }
    });
  }

  private afterMemberLoaded() {
    const memberId = this.member?.id?.toString?.() ?? String(this.member?.id);

    // Publications
    if (this.member?.publications?.length) {
      this.memberPublications = this.member.publications;
    } else {
      this.pubService.getAll().subscribe({
        next: (pubs) => {
          const list = pubs || [];
          this.memberPublications = list.filter(p => (p as any).authorIds && (p as any).authorIds.map(String).includes(memberId));
        },
        error: () => {}
      });
    }

    // Outils (filter by authorIds when available)
    this.outilService.getAll().subscribe({
      next: (outils) => {
        const list: any[] = outils || [];
        this.memberOutils = list.filter(o => {
          const ids = (o as any).authorIds || (o as any).auteurs || (o as any).membreIds;
          if (Array.isArray(ids)) return ids.map(String).includes(memberId);
          if ((o as any).membreId != null) return String((o as any).membreId) === memberId;
          return false;
        });
      },
      error: () => {}
    });

    // Events (no authorIds in model; keep best-effort filtering)
    this.evtService.GetAllEvt().subscribe({
      next: (events) => {
        const list: any[] = events || [];
        this.memberEvents = list.filter(ev => {
          const ids = (ev as any).authorIds || (ev as any).participants || (ev as any).memberIds;
          if (Array.isArray(ids)) return ids.map(String).includes(memberId);
          if ((ev as any).membreId != null) return String((ev as any).membreId) === memberId;
          return false;
        });
      },
      error: () => {}
    });

    // Encadrements: if this is an enseignant, list students whose encadrant.id == this.id
    const isTeacher = !!this.member?.grade || (String(this.member?.type || '').toLowerCase().includes('ens'));
    if (isTeacher) {
      this.ms.GetAllMembers().subscribe({
        next: (members) => {
          const list: any[] = members || [];
          this.supervisedStudents = list.filter(x => {
            const enc = (x as any).encadrant;
            if (!enc) return false;
            const encId = enc.id?.toString?.() ?? String(enc.id);
            return encId === memberId;
          });
        },
        error: () => {}
      });
    }

    this.loading = false;
  }
}
