import { Component, OnInit } from '@angular/core';
import { Publication } from 'src/model/Publication';
import { PublicationService } from 'src/services/publication.service';
import { UserContextService } from 'src/app/user-context.service';

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

  // advanced filters
  filterText = '';
  filterType = '';
  filterYear = '';
  availableTypes: string[] = [];
  availableYears: string[] = [];

  constructor(private pubService: PublicationService, public uc: UserContextService) {}

  ngOnInit(): void {
    this.loading = true;
    this.pubService.getAll().subscribe((res) => {
      this.publications = res || [];
      const cur = this.uc.getCurrent();
      
      // Si l'utilisateur est admin, il voit toutes les publications
      // Sinon, il ne voit que ses propres publications
      if (cur && !this.uc.isAdmin() && cur.id != null) {
        const uid = String(cur.id);
        this.publications = this.publications.filter(p => (p.authorIds || []).map(String).includes(uid));
      }
      
      this.dataSource.data = this.publications;
      this.availableTypes = Array.from(new Set((this.publications || []).map(p => (p.type || '').toString()).filter(Boolean))).sort();
      this.availableYears = Array.from(new Set((this.publications || []).map(p => this.extractYear(p.date)).filter(Boolean))).sort().reverse();
      this.updateAdvancedFilter();
      this.loading = false;
    }, () => (this.loading = false));
  }

  applyFilter(event: Event) {
    this.filterText = (event.target as HTMLInputElement).value || '';
    this.updateAdvancedFilter();
  }

  onTypeFilterChange(v: string) {
    this.filterType = v || '';
    this.updateAdvancedFilter();
  }

  onYearFilterChange(v: string) {
    this.filterYear = v || '';
    this.updateAdvancedFilter();
  }

  private updateAdvancedFilter() {
    const text = this.filterText.trim().toLowerCase();
    const type = this.filterType.trim().toLowerCase();
    const year = this.filterYear.trim();

    this.filtered = (this.publications || []).filter(p => {
      const t = (p.type || '').toString().toLowerCase();
      const y = this.extractYear(p.date);
      const hay = `${p.titre || ''} ${p.type || ''} ${p.date || ''}`.toLowerCase();
      if (text && !hay.includes(text)) return false;
      if (type && t !== type) return false;
      if (year && y !== year) return false;
      return true;
    });
  }

  private extractYear(d?: string | Date): string {
    if (!d) return '';
    const dt = (d instanceof Date) ? d : new Date(d);
    if (!isNaN(dt.getTime())) return String(dt.getFullYear());
    const m = String(d).match(/(19|20)\d{2}/);
    return m ? m[0] : '';
  }
}
