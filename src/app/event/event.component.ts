import { Component } from '@angular/core';
import { _MatTableDataSource } from '@angular/material/table';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { Evenement } from 'src/model/Evenement';
import { EvtService } from '../../services/evt.service';
import { EvtCreateComponent } from '../evt-create/evt-create.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MemberService } from '../../services/member.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environment';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements AfterViewInit
 {
  displayedColumns: string[] = ['id', 'titre','date_deb', 'date_fin','lieu','organisateur','actions'];
    dataSource = new MatTableDataSource<Evenement>; 
    organizers: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private Es: EvtService ,
     private ms: MemberService,
     private  dialog: MatDialog,
     private httpClient: HttpClient)
     {
    this.dataSource= new MatTableDataSource();
  }

  ngAfterViewInit() {
    // remplir le tableau datasource 
    this.Es.getAllEvents().subscribe((res) => {
      this.dataSource.data = res;
      console.log('Events loaded:', this.dataSource.data);
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loadMembersAndAssociateEvents();
    });
  }

  loadMembersAndAssociateEvents() {
    console.log('Loading full members to associate events...');
    
    // Charger tous les membres avec leurs events via /full endpoint
    this.httpClient.get<any[]>(`${environment.memberServiceUrl}/full`).subscribe((members: any[]) => {
      console.log('Full members loaded:', members);
      
      // Créer une map de event -> organisateurs
      const eventOrganizers = new Map<number, string[]>();
      
      members.forEach(member => {
        if (member.events && member.events.length > 0) {
          member.events.forEach((event: any) => {
            const eventId = typeof event === 'object' ? event.id : event;
            if (!eventOrganizers.has(eventId)) {
              eventOrganizers.set(eventId, []);
            }
            const memberName = member.name || `${member.prenom} ${member.nom}`;
            eventOrganizers.get(eventId)?.push(memberName);
          });
        }
      });
      
      console.log('Event organizers map:', eventOrganizers);
      
      // Ajouter les organisateurs aux événements
      this.dataSource.data.forEach((event: any) => {
        const organizers = eventOrganizers.get(event.id as number) || [];
        (event as any).organizerNames = organizers;
        console.log(`Event ${event.id} assigned organizers:`, organizers);
      });
      
      // Forcer la détection de changement
      this.dataSource.data = [...this.dataSource.data];
    });
  }

  loadOrganizers() {
    const allOrganizerIds = new Set<string>();
    this.dataSource.data.forEach((event: any) => {
      if (event.organisateurId) {
        allOrganizerIds.add(String(event.organisateurId));
      }
    });

    if (allOrganizerIds.size > 0) {
      console.log('Loading organizers for IDs:', Array.from(allOrganizerIds));
      
      // Charger les détails de chaque organisateur via Member Controller
      const organizerPromises = Array.from(allOrganizerIds).map(id => 
        this.ms.getMemberByID(id).toPromise()
      );
      
      Promise.all(organizerPromises).then((organizers: any[]) => {
        this.organizers = organizers.filter(organizer => organizer != null);
        console.log('Organizers loaded from Member Controller:', this.organizers);
      }).catch(err => {
        console.error('Error loading organizers from Member Controller:', err);
        this.organizers = [];
      });
    }
  }

  getOrganizerName(organizerId: string): string {
    const organizer = this.organizers.find(o => o.id === organizerId);
    return organizer ? organizer.name : '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
    //close() {
     //   this.dialogRef.close();
    //}
    open(){
     
     //permet de lancer la boite EventCreate, on ne chaneg pas le path 
    const dialogRef=this.dialog.open(EvtCreateComponent); // lancer le threadobservable 
    // se declarer subscriber 
     dialogRef.afterClosed().subscribe(
        (data) => {
           if(data){
          console.log('Event data from dialog:', data);
          this.Es.addEvent(data).subscribe({
            next: () => {
              console.log('Event created successfully!');
              // Recharger tous les événements
              this.Es.getAllEvents().subscribe((x)=>{
                this.dataSource.data = x;
                // Recharger aussi les organisateurs pour le nouvel événement
                this.loadMembersAndAssociateEvents();
              });
            },
            error: (err) => {
              console.error('Error creating event:', err);
              alert('Erreur lors de la création de l\'événement: ' + err.message);
            }
          });
        }
    });    
    }

    openEdit(id : string){
       const dialogConfig = new MatDialogConfig();
       dialogConfig.data=id;
       const dialogRef = this.dialog.open(EvtCreateComponent, dialogConfig);

       dialogRef.afterClosed().subscribe(
        (data) => {
           if(data){
          console.log('Event data from edit dialog:', data);
          this.Es.updateEvent(data, id).subscribe({
            next: () => {
              console.log('Event updated successfully!');
              // Recharger tous les événements
              this.Es.getAllEvents().subscribe((x)=>{
                this.dataSource.data = x;
                // Recharger aussi les organisateurs
                this.loadMembersAndAssociateEvents();
              });
            },
            error: (err) => {
              console.error('Error updating event:', err);
              alert('Erreur lors de la mise à jour de l\'événement: ' + err.message);
            }
          });
        }
    });    
    }

    delete(id: string) {
      if (confirm('Are you sure you want to delete this event?')) {
        this.Es.deleteEvent(id).subscribe({
          next: () => {
            console.log('Event deleted successfully!');
            // Recharger tous les événements
            this.Es.getAllEvents().subscribe((x) => {
              this.dataSource.data = x;
              // Recharger aussi les organisateurs
              this.loadMembersAndAssociateEvents();
            });
          },
          error: (err) => {
            console.error('Error deleting event:', err);
            alert('Erreur lors de la suppression de l\'événement: ' + err.message);
          }
        });
      }
    }

}


