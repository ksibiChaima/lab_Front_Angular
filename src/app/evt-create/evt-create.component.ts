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
  form!: FormGroup;
  data: any;

  constructor(
    private dialogRef: MatDialogRef<EvtCreateComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any,
    private Es: EvtService
  ) {
    this.data = data;
    if (data) {
      console.log("Mode édition - ID:", data);
      this.Es.getEventById(data).subscribe((res) => {
        this.form = new FormGroup({
          titre: new FormControl(res.titre || ''),
          date_deb: new FormControl(res.date || ''),
          date_fin: new FormControl(res.dateFin || ''),
          lieu: new FormControl(res.lieu || ''),
          description: new FormControl(res.description || ''),
          type: new FormControl(res.type || 'Conference'),
          registrationUrl: new FormControl(res.registrationUrl || ''),
          meetingUrl: new FormControl(res.meetingUrl || ''),
          capacite: new FormControl(res.capacite || 0),
          statut: new FormControl(res.statut || 'Prévu')
        });
      });
    } else {
      console.log("Mode création");
      this.form = new FormGroup({
        titre: new FormControl(''),
        date_deb: new FormControl(''),
        date_fin: new FormControl(''),
        lieu: new FormControl(''),
        description: new FormControl(''),
        type: new FormControl('Conference'),
        registrationUrl: new FormControl(''),
        meetingUrl: new FormControl(''),
        capacite: new FormControl(0),
        statut: new FormControl('Prévu')
      });
    }
  }

  save() {
    if (this.form.valid) {
      const eventData = this.form.value;
      
      // Ajouter l'ID de l'organisateur si en mode édition
      if (this.data?.id) {
        eventData.id = this.data.id;
      }
      
      console.log("Données événement:", eventData);
      this.dialogRef.close(eventData);
    }
  }

  close() {
    this.dialogRef.close();
  }

  open() {
    this.dialog.open(EvtCreateComponent);
  }
}
