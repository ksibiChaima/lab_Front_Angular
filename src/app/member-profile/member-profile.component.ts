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
    
    console.log('Member data:', this.member);
    console.log('Member ID:', memberId);
    console.log('Member publications:', this.member?.publications);
    console.log('Member outils:', this.member?.outils);
    console.log('Member events:', this.member?.events);

    // Publications - utiliser les données du backend si disponibles
    if (this.member?.publications?.length) {
      console.log('Using backend publications:', this.member.publications);
      this.memberPublications = this.member.publications;
    } else {
      console.log('Fetching publications from service...');
      this.pubService.getAll().subscribe({
        next: (pubs) => {
          const list = pubs || [];
          this.memberPublications = list.filter(p => (p as any).authorIds && (p as any).authorIds.map(String).includes(memberId));
          console.log('Filtered publications:', this.memberPublications);
        },
        error: () => {}
      });
    }

    // Outils - utiliser les données du backend si disponibles
    if (this.member?.outils?.length) {
      console.log('Using backend outils:', this.member.outils);
      this.memberOutils = this.member.outils;
    } else {
      console.log('Fetching outils from service...');
      this.outilService.getAll().subscribe({
        next: (outils) => {
          const list: any[] = outils || [];
          this.memberOutils = list.filter(o => {
            const ids = (o as any).authorIds || (o as any).auteurs || (o as any).membreIds;
            if (Array.isArray(ids)) return ids.map(String).includes(memberId);
            if ((o as any).membreId != null) return String((o as any).membreId) === memberId;
            return false;
          });
          console.log('Filtered outils:', this.memberOutils);
        },
        error: () => {}
      });
    }

    // Events - utiliser les données du backend si disponibles
    if (this.member?.events?.length) {
      console.log('Using backend events:', this.member.events);
      this.memberEvents = this.member.events;
    } else {
      console.log('Fetching events from service...');
      this.evtService.getAllEvents().subscribe({
        next: (events) => {
          const list: any[] = events || [];
          this.memberEvents = list.filter(ev => {
            const ids = (ev as any).authorIds || (ev as any).participants || (ev as any).memberIds;
            if (Array.isArray(ids)) return ids.map(String).includes(memberId);
            if ((ev as any).membreId != null) return String((ev as any).membreId) === memberId;
            return false;
          });
          console.log('Filtered events:', this.memberEvents);
        },
        error: () => {}
      });
    }

    // Encadrements: if this is an enseignant, list students whose encadrant.id == this.id
    const isTeacher = !!this.member?.grade || (String(this.member?.type || '').toLowerCase().includes('ens'));
    if (isTeacher) {
      // Filter all members to find supervised students
      this.ms.GetAllMembers().subscribe({
        next: (members) => {
          const list: any[] = members || [];
          this.supervisedStudents = list.filter(x => {
            const enc = (x as any).encadrant;
            if (!enc) return false;
            const encId = enc.id?.toString?.() ?? String(enc.id);
            return encId === memberId;
          });
          console.log('Supervised students:', this.supervisedStudents);
        },
        error: () => {}
      });
    }

    this.loading = false;
  }

  // Méthodes pour les actions
  downloadPublication(publication: any) {
    const link = publication.lien || publication.sourcePdf;
    if (link) {
      window.open(link, '_blank');
    }
  }

  downloadTool(tool: any) {
    const link = tool.sourceUrl || tool.source || tool.github;
    if (link) {
      window.open(link, '_blank');
    }
  }

  viewGitHub(tool: any) {
    if (tool.github) {
      window.open(tool.github, '_blank');
    }
  }

  registerEvent(event: any) {
    if (event.registrationUrl) {
      window.open(event.registrationUrl, '_blank');
    }
  }

  joinMeeting(event: any) {
    if (event.meetingUrl) {
      window.open(event.meetingUrl, '_blank');
    }
  }
}
