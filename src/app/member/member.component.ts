import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Member } from 'src/model/Member';
import { MemberService } from 'src/services/member.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  //injection des depêndances 
  //consiste a creer une instance du service dans le composant 
  // //{ a condition que le service contient le  decorateur  @injectable }
  //should be private always 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private Ms: MemberService, private dialog :MatDialog){ }

  dataSource = new MatTableDataSource<Member>([]);

  // advanced filters
  filterText = '';
  filterType = '';
  filterGrade = '';
  filterEtablissement = '';
  availableGrades: string[] = [];
  availableEtablissements: string[] = [];

  fetch(){ //{action post de recevoir les donnees de x  :lancement du thread }
    this.Ms.GetAllMembers().subscribe({
      next: (x) => {
        this.dataSource.data = x;
        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;
        this.availableGrades = Array.from(new Set((x || []).map(m => (m as any).grade).filter(Boolean))).sort();
        this.availableEtablissements = Array.from(new Set((x || []).map(m => (m as any).etablissement).filter(Boolean))).sort();
        this.updateAdvancedFilter();
        console.log('Members loaded:', x);
      },
      error: (err) => {
        console.error('GetAllMembers failed:', err);
        this.dataSource.data = [];
      }
    })
  }

  ngOnInit(){
    this.dataSource.filterPredicate = (data: Member, filter: string) => {
      let f: any = {};
      try { f = JSON.parse(filter || '{}'); } catch { f = {}; }
      const text = (f.text || '').toString().trim().toLowerCase();
      const type = (f.type || '').toString().trim().toLowerCase();
      const grade = (f.grade || '').toString().trim().toLowerCase();
      const etab = (f.etablissement || '').toString().trim().toLowerCase();

      const hay = `${data.id || ''} ${(data.cin || '')} ${(data.name || '')} ${(data.type || '')} ${(data.createDate || '')} ${((data as any).grade || '')} ${((data as any).etablissement || '')}`.toLowerCase();
      if (text && !hay.includes(text)) return false;
      if (type && ((data.type || '').toString().toLowerCase() !== type)) return false;
      if (grade && (((data as any).grade || '').toString().toLowerCase() !== grade)) return false;
      if (etab && (((data as any).etablissement || '').toString().toLowerCase() !== etab)) return false;
      return true;
    };
    this.fetch();
  }

   /* on a les transformer au fichier db.json
    { id : '12345', cin : '12345', name: 'imene', type:'enseig', createDate:'12/12/2024'},
    { id : '5678',cin : '12345',name: 'Emna',type:'etudiante',createDate:'19/09/2025'},
    { id : '9123', cin : '12345', name: 'Ali', type:'etudiant', createDate:'12/12/2024' }*/
    
  applyFilter(event: Event) {
    this.filterText = (event.target as HTMLInputElement).value || '';
    this.updateAdvancedFilter();
  }

  onTypeFilterChange(v: string) {
    this.filterType = v || '';
    this.updateAdvancedFilter();
  }

  onGradeFilterChange(v: string) {
    this.filterGrade = v || '';
    this.updateAdvancedFilter();
  }

  onEtablissementFilterChange(v: string) {
    this.filterEtablissement = v || '';
    this.updateAdvancedFilter();
  }

  private updateAdvancedFilter() {
    this.dataSource.filter = JSON.stringify({
      text: this.filterText,
      type: this.filterType,
      grade: this.filterGrade,
      etablissement: this.filterEtablissement
    });
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  delete(id:string){
    //ouvrir la boite  from angular materails
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {  // angular va lancer un thread observale 
  height: '200px',
  width: '300px',
});
    // attendre la resultat du user : click 
    //attendre la réponse de l'utilisateur
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //si user click sur confirm ==> 
        this.Ms.deleteMemberById(id).subscribe(()=>{  
        this.fetch();
        })
      }
    });
  }

    // si user click sur confirm (retarder l'appel du service jsq l'action de l user )=>
   
  


  
  displayedColumns: string[] = ['id', 'cin', 'name', 'type','createDate','action'];
}