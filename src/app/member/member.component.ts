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

  fetch(){ //{action post de recevoir les donnees de x  :lancement du thread }
    this.Ms.GetAllMembers().subscribe((x)=>{this.dataSource.data=x})
  }

  ngOnInit(){
    this.fetch();
  }

   /* on a les transformer au fichier db.json
    { id : '12345', cin : '12345', name: 'imene', type:'enseig', createDate:'12/12/2024'},
    { id : '5678',cin : '12345',name: 'Emna',type:'etudiante',createDate:'19/09/2025'},
    { id : '9123', cin : '12345', name: 'Ali', type:'etudiant', createDate:'12/12/2024' }*/
    
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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