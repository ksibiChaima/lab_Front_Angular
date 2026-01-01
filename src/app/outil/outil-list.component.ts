import { Component, OnInit } from '@angular/core';
import { Outil } from 'src/model/Outil';
import { OutilService } from 'src/services/outil.service';
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

  constructor(private outilService: OutilService) {}

  ngOnInit(): void {
    this.loading = true;
    this.outilService.getAll().subscribe((res) => { this.outils = res || []; this.dataSource.data = this.outils; this.loading = false; }, () => (this.loading = false));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filtered = this.dataSource.data.filter(o => (o.id || '').toLowerCase().includes(filterValue) || (o.source || '').toLowerCase().includes(filterValue));
  }
}
