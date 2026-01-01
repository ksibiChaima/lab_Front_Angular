import { Component, OnInit } from '@angular/core';
import { Publication } from 'src/model/Publication';
import { PublicationService } from 'src/services/publication.service';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.css']
})
export class PublicationListComponent implements OnInit {
  publications: Publication[] = [];
  filtered: Publication[] = [];
  loading = false;
  dataSource = new MatTableDataSource<Publication>([]);

  constructor(private pubService: PublicationService) {}

  ngOnInit(): void {
    this.loading = true;
    this.pubService.getAll().subscribe((res) => {
      this.publications = res || [];
      this.dataSource.data = this.publications;
      this.loading = false;
    }, () => (this.loading = false));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.filtered = this.dataSource.data.filter(p => {
      return (p.titre || '').toLowerCase().includes(filterValue) || (p.type || '').toLowerCase().includes(filterValue) || (p.date || '').toLowerCase().includes(filterValue);
    });
  }
}
