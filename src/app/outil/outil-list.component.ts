import { Component, OnInit } from '@angular/core';
import { Outil } from 'src/model/Outil';
import { OutilService } from 'src/services/outil.service';
import { UserContextService } from 'src/app/user-context.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-outil-list',
  templateUrl: './outil-list.component.html',
  styleUrls: ['./outil-list.component.css']
})
export class OutilListComponent implements OnInit {
  outils: Outil[] = [];
  filtered: Outil[] = [];
  loading = false;
  dataSource = new MatTableDataSource<Outil>([]);

  constructor(private outilService: OutilService, public uc: UserContextService) {}

  ngOnInit(): void {
    this.loading = true;
    this.outilService.getAll().subscribe((res) => {
      this.outils = res || [];
      const cur = this.uc.getCurrent();
      if (cur && !this.uc.isAdmin() && cur.id) {
        const uid = cur.id.toString();
        this.outils = this.outils.filter(o => (o.authorIds || []).map(String).includes(uid));
      }
      this.dataSource.data = this.outils; this.loading = false;
    }, () => (this.loading = false));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filtered = this.dataSource.data.filter(o => (o.id || '').toLowerCase().includes(filterValue) || (o.source || '').toLowerCase().includes(filterValue));
  }
}
