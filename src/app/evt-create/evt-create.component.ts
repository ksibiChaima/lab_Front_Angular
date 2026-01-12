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
    
    // Initialiser le formulaire immédiatement
    this.form = new FormGroup({
      titre: new FormControl(''),
      date_deb: new FormControl(''),
      date_fin: new FormControl(''),
      lieu: new FormControl(''),
      description: new FormControl(''),
      registrationUrl: new FormControl(''),
      meetingUrl: new FormControl(''),
      capacite: new FormControl(0),
      statut: new FormControl('Prévu')
    });

    // Si on est en mode édition, charger les données
    if (data) {
      console.log("Mode édition - ID:", data);
      this.Es.getEventById(data).subscribe((res) => {
        this.form.patchValue({
          titre: res.titre || '',
          date_deb: res.date || '',
          date_fin: res.dateFin || '',
          lieu: res.lieu || '',
          description: res.description || '',
          registrationUrl: res.registrationUrl || '',
          meetingUrl: res.meetingUrl || '',
          capacite: res.capacite || 0,
          statut: res.statut || 'Prévu'
        });
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
