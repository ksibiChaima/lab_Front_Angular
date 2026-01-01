import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EvtService } from 'src/services/evt.service';

@Component({
  selector: 'app-evt-create',
  templateUrl: './evt-create.component.html',
  styleUrls: ['./evt-create.component.css']
})
export class EvtCreateComponent {
  form !:FormGroup
 
  constructor(private dialogRef: MatDialogRef<EvtCreateComponent>,private  dialog: MatDialog ,  @Inject(MAT_DIALOG_DATA) data:any, private Es: EvtService )
  {
    if (data){
      console.log("id",data)
      this.Es.getEvtByID(data).subscribe((res)=>{
        this.form= new FormGroup({
          lieu:new FormControl(res.lieu)
        })
      })
    }
      else{
        //je suis dans create
       this.form=new FormGroup({
          titre:new FormControl(null) , 
          date_deb:new FormControl(null),
          date_fin:new FormControl(null),
          lieu:new FormControl(),})
  }
      }
 
  


  // save ()
  // close()
 save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }
    open(){
     //permet de lancer la boite EventCreate, on ne chaneg pas le path 
    this.dialog.open(EvtCreateComponent) }


}
