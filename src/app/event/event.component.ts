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


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements AfterViewInit
 {
  displayedColumns: string[] = ['id', 'titre','date_deb', 'date_fin','lieu','actions'];
    dataSource = new MatTableDataSource<Evenement>; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private Es: EvtService ,
     //private dialogRef: MatDialogRef<EvtCreateComponent>,
   

    private  dialog: MatDialog)
     {
    this.dataSource= new MatTableDataSource();
  }

  ngAfterViewInit() {
    // remplir le tableau datasource 
    this.Es.getAllEvents().subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
          this.Es.addEvent(data).subscribe(()=>{
this.Es.getAllEvents().subscribe((x)=>{
  this.dataSource.data=x;
})
          })
        }
    });    
    }

    openEdit(id : string){
       const dialogConfig = new MatDialogConfig();
       dialogConfig.data=id;
       const dialogRef = this.dialog.open(EvtCreateComponent, dialogConfig);

       dialogRef.afterClosed().subscribe(
        (data) => {
          this.Es.updateEvent(data,id).subscribe(()=>{
              this.Es.getAllEvents().subscribe((x)=>{
              this.dataSource.data=x;
            })
          })
        })

    }

}


