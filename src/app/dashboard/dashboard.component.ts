import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/services/member.service';
import { EvtService } from 'src/services/evt.service';
import { PublicationService } from 'src/services/publication.service';
import { OutilService } from 'src/services/outil.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  membersCount = 0;
  eventsCount = 0;
  publicationsCount = 0;
  outilsCount = 0;
  recentMembers: any[] = [];

  constructor(private ms: MemberService, private es: EvtService, private ps: PublicationService, private os: OutilService) {}

  ngOnInit(): void {
    this.ms.GetAllMembers().subscribe(m => { this.membersCount = m.length; this.recentMembers = m.slice(-5).reverse(); });
    this.es.GetAllEvt().subscribe(e => (this.eventsCount = e.length));
    this.ps.getAll().subscribe(p => (this.publicationsCount = p.length));
    this.os.getAll().subscribe(o => (this.outilsCount = o.length));
  }

}
