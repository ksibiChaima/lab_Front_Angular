import { Component, OnInit } from '@angular/core';
import { Outil } from 'src/model/Outil';
import { OutilService } from 'src/services/outil.service';
import { UserContextService } from 'src/app/user-context.service';
import { MatTableDataSource } from '@angular/material/table';
import { MemberService } from 'src/services/member.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environment';

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
  owners: any[] = [];

  constructor(private outilService: OutilService, public uc: UserContextService, private ms: MemberService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    this.outilService.getAll().subscribe((res) => {
      this.outils = res || [];
      console.log('Outils loaded:', this.outils);
      
      const cur = this.uc.getCurrent();
      if (cur && !this.uc.isAdmin() && cur.id) {
        const uid = cur.id.toString();
        this.outils = this.outils.filter(o => (o.authorIds || []).map(String).includes(uid));
      }
      this.dataSource.data = this.outils;
      this.loadMembersAndAssociateOutils();
      this.loading = false;
    }, () => (this.loading = false));
  }

  loadMembersAndAssociateOutils() {
    console.log('Loading full members to associate outils...');
    
    // Charger tous les membres avec leurs outils via /full endpoint
    this.httpClient.get<any[]>(`${environment.memberServiceUrl}/full`).subscribe((members: any[]) => {
      console.log('Full members loaded:', members);
      
      // Créer une map de outil -> propriétaires
      const outilOwners = new Map<number, string[]>();
      
      members.forEach(member => {
        if (member.outils && member.outils.length > 0) {
          member.outils.forEach((outil: any) => {
            const outilId = typeof outil === 'object' ? outil.id : outil;
            if (!outilOwners.has(outilId)) {
              outilOwners.set(outilId, []);
            }
            const memberName = member.name || `${member.prenom} ${member.nom}`;
            outilOwners.get(outilId)?.push(memberName);
          });
        }
      });
      
      console.log('Outil owners map:', outilOwners);
      
      // Ajouter les propriétaires aux outils
      this.outils.forEach(outil => {
        const owners = outilOwners.get(outil.id as number) || [];
        (outil as any).ownerNames = owners;
        console.log(`Outil ${outil.id} assigned owners:`, owners);
      });
      
      // Forcer la détection de changement
      this.dataSource.data = [...this.dataSource.data];
    });
  }

  loadOwners() {
    const allOwnerIds = new Set<string>();
    this.outils.forEach(outil => {
      if (outil.authorIds) {
        outil.authorIds.forEach(id => allOwnerIds.add(String(id)));
      }
    });

    if (allOwnerIds.size > 0) {
      console.log('Loading tool owners for IDs:', Array.from(allOwnerIds));
      
      // Charger les détails de chaque propriétaire via Member Controller
      const ownerPromises = Array.from(allOwnerIds).map(id => 
        this.ms.getMemberByID(id).toPromise()
      );
      
      Promise.all(ownerPromises).then((owners: any[]) => {
        this.owners = owners.filter(owner => owner != null);
        console.log('Tool owners loaded from Member Controller:', this.owners);
      }).catch(err => {
        console.error('Error loading owners from Member Controller:', err);
        this.owners = [];
      });
    }
  }

  getOwnerNames(authorIds: string[]): string[] {
    return authorIds.map(id => {
      const owner = this.owners.find(o => o.id === id);
      return owner ? owner.name : '';
    }).filter(name => name);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filtered = this.dataSource.data.filter(o => String(o.id ?? '').toLowerCase().includes(filterValue) || String(o.source ?? '').toLowerCase().includes(filterValue));
  }
}
