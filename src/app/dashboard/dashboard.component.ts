import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MemberService } from 'src/services/member.service';
import { EvtService } from 'src/services/evt.service';
import { PublicationService } from 'src/services/publication.service';
import { OutilService } from 'src/services/outil.service';
import { UserContextService } from 'src/app/user-context.service';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  membersCount = 0;
  eventsCount = 0;
  publicationsCount = 0;
  outilsCount = 0;
  recentMembers: any[] = [];
  roleLabel = 'visitor';
  subscriptions: Subscription[] = [];

  // charts
  memberTypeChart: any = null;
  eventChart: any = null;
  timeframe: '6m' | '12m' = '6m';

  @ViewChild('memberTypeCanvas') memberTypeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('eventCanvas') eventCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private ms: MemberService,
    private es: EvtService,
    private ps: PublicationService,
    private os: OutilService,
    private uc: UserContextService
  ) {}

  ngOnInit(): void {
    // set current role from UserContextService (sync)
    try {
      const cur = this.uc.getCurrent();
      this.roleLabel = cur?.role || 'visitor';
    } catch (e) {
      this.roleLabel = 'visitor';
    }

    this.subscriptions.push(
      this.ms.GetAllMembers().subscribe(m => {
        this.membersCount = m.length;
        this.recentMembers = m.slice(-5).reverse();
        this.updateMemberTypeChart(m);
      })
    );

    this.subscriptions.push(this.es.GetAllEvt().subscribe(e => {
      this.eventsCount = e.length;
      this.updateEventChart(e);
    }));

    this.subscriptions.push(this.ps.getAll().subscribe(p => (this.publicationsCount = p.length)));
    this.subscriptions.push(this.os.getAll().subscribe(o => (this.outilsCount = o.length)));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  // Chart helpers
  private updateMemberTypeChart(members: any[]) {
    const counts: Record<string, number> = {};
    members.forEach(mem => {
      const t = (mem.type || 'member').toLowerCase();
      counts[t] = (counts[t] || 0) + 1;
    });
    const labels = Object.keys(counts).map(l => this.capitalize(l));
    const data = Object.values(counts);

    if (this.memberTypeChart) {
      this.memberTypeChart.data.labels = labels;
      this.memberTypeChart.data.datasets[0].data = data;
      this.memberTypeChart.update();
      return;
    }

    // create chart when view is ready; import Chart.js dynamically so install is optional
    setTimeout(() => {
      const ctx = this.memberTypeCanvas?.nativeElement?.getContext('2d');
      if (!ctx) return;
      // dynamic import avoids compile-time error when chart.js is not installed
      import('chart.js/auto')
        .then(mod => {
          const Chart = (mod && (mod as any).default) ? (mod as any).default : (mod as any);
          this.memberTypeChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels,
              datasets: [{ data, backgroundColor: ['#3f51b5', '#e91e63', '#00bcd4', '#ffc107', '#4caf50'] }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
          });
        })
        .catch(() => {
          // Chart.js not available — skip rendering chart silently
        });
    }, 50);
  }

  private updateEventChart(events: any[]) {
    // group events by month for the selected timeframe
    const months = this.getLastMonths(this.timeframe === '6m' ? 6 : 12);
    const counts = months.map(m => 0);
    events.forEach(ev => {
      const d = new Date(ev.date || ev.start || ev.createdAt || ev.dt || null);
      if (isNaN(d.getTime())) return;
      const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const idx = months.indexOf(label);
      if (idx >= 0) counts[idx]++;
    });

    if (this.eventChart) {
      this.eventChart.data.labels = months;
      this.eventChart.data.datasets[0].data = counts;
      this.eventChart.update();
      return;
    }

    setTimeout(() => {
      const ctx = this.eventCanvas?.nativeElement?.getContext('2d');
      if (!ctx) return;
      import('chart.js/auto')
        .then(mod => {
          const Chart = (mod && (mod as any).default) ? (mod as any).default : (mod as any);
          this.eventChart = new Chart(ctx, {
            type: 'bar',
            data: { labels: months, datasets: [{ label: 'Events', data: counts, backgroundColor: '#2196f3' }] },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
          });
        })
        .catch(() => {});
    }, 50);
  }

  changeTimeframe(tf: '6m' | '12m') {
    this.timeframe = tf;
    // re-fetch events to rebuild chart — EvtService already sends full list so subscription will call updateEventChart
    this.es.GetAllEvt().subscribe(e => this.updateEventChart(e));
  }

  private getLastMonths(n: number) {
    const out: string[] = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return out;
  }

  private capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

}
