import { Component, OnInit } from '@angular/core';
import { Publication } from 'src/model/Publication';
import { PublicationService } from 'src/services/publication.service';
import { UserContextService } from 'src/app/user-context.service';
import { MemberService } from 'src/services/member.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environment';

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
  authors: any[] = []; // Add this property

  // advanced filters
  filterText = '';
  filterType = '';
  filterYear = '';
  availableTypes: string[] = [];
  availableYears: string[] = [];

  constructor(private pubService: PublicationService, public uc: UserContextService, private ms: MemberService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    this.pubService.getAll().subscribe((res) => {
      this.publications = res || [];
      console.log('Publications loaded:', this.publications);
      
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
      
      // Charger les membres et associer leurs publications
      this.loadMembersAndAssociatePublications();
      
      this.updateAdvancedFilter();
      this.loading = false;
    }, () => (this.loading = false));
  }

  loadMembersAndAssociatePublications() {
    console.log('Loading full members to associate publications...');
    
    // Charger tous les membres avec leurs publications via /full endpoint
    this.httpClient.get<any[]>(`${environment.memberServiceUrl}/full`).subscribe((members: any[]) => {
      console.log('Full members loaded:', members);
      
      // Créer une map de publication -> auteurs
      const publicationAuthors = new Map<number, string[]>();
      
      members.forEach(member => {
        if (member.pubs && member.pubs.length > 0) {
          member.pubs.forEach((pub: any) => {
            const pubId = typeof pub === 'object' ? pub.id : pub;
            if (!publicationAuthors.has(pubId)) {
              publicationAuthors.set(pubId, []);
            }
            const memberName = member.name || `${member.prenom} ${member.nom}`;
            publicationAuthors.get(pubId)?.push(memberName);
          });
        }
      });
      
      console.log('Publication authors map:', publicationAuthors);
      
      // Ajouter les auteurs aux publications
      this.publications.forEach(pub => {
        const authors = publicationAuthors.get(pub.id as number) || [];
        (pub as any).authorNames = authors;
        console.log(`Publication ${pub.id} assigned authors:`, authors);
      });
      
      // Forcer la détection de changement
      this.dataSource.data = [...this.dataSource.data];
    });
  }

  loadAuthors() {
    const allAuthorIds = new Set<string>();
    this.publications.forEach(pub => {
      if (pub.authorIds) {
        pub.authorIds.forEach(id => allAuthorIds.add(String(id)));
      }
    });

    if (allAuthorIds.size > 0) {
      console.log('Loading authors for IDs:', Array.from(allAuthorIds));
      
      // Charger les détails de chaque auteur via Member Controller
      const authorPromises = Array.from(allAuthorIds).map(id => 
        this.ms.getMemberByID(id).toPromise()
      );
      
      Promise.all(authorPromises).then((authors: any[]) => {
        this.authors = authors.filter(author => author != null);
        console.log('Authors loaded from Member Controller:', this.authors);
      }).catch(err => {
        console.error('Error loading authors from Member Controller:', err);
        this.authors = [];
      });
    }
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

  extractYear(d?: string | Date): string {
    if (!d) return '';
    const dt = (d instanceof Date) ? d : new Date(d);
    if (!isNaN(dt.getTime())) return String(dt.getFullYear());
    const m = String(d).match(/(19|20)\d{2}/);
    return m ? m[0] : '';
  }

  getAuthorName(authorId: string): string {
    const author = this.authors.find(a => a.id === authorId);
    return author ? author.name : '';
  }

  getAuthorNames(authorIds: string[]): string[] {
    return authorIds.map(id => this.getAuthorName(id)).filter(name => name);
  }
}
