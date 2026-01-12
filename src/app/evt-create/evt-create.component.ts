import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  isEditMode = false;

  constructor(
    private dialogRef: MatDialogRef<EvtCreateComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any,
    private Es: EvtService
  ) {
    this.data = data;
    this.isEditMode = !!data?.id;
    
    // Initialiser le formulaire avec des validateurs
    this.form = new FormGroup({
      titre: new FormControl('', [Validators.required]),
      date_deb: new FormControl('', [Validators.required]),
      date_fin: new FormControl(''),
      lieu: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      registrationUrl: new FormControl(''),
      meetingUrl: new FormControl(''),
      capacite: new FormControl(null, [Validators.min(1)]),
      statut: new FormControl('Prévu')
    });

    // Si on est en mode édition, charger les données
    if (this.isEditMode) {
      console.log("Mode édition - ID:", data);
      this.Es.getEventById(data.id).subscribe({
        next: (res) => {
          this.form.patchValue({
            titre: res.titre || '',
            date_deb: this.formatDateForInput(res.date),
            date_fin: this.formatDateForInput(res.dateFin),
            lieu: res.lieu || '',
            description: res.description || '',
            registrationUrl: res.registrationUrl || '',
            meetingUrl: res.meetingUrl || '',
            capacite: res.capacite || null,
            statut: res.statut || 'Prévu'
          });
        },
        error: (err) => {
          console.error('Error loading event for edit:', err);
        }
      });
    }
  }

  // Helper pour formater les dates pour les input HTML
  private formatDateForInput(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  save() {
    if (this.form.valid) {
      const eventData = this.form.value;
      
      // Formater les données pour le backend
      const formattedData = {
        ...eventData,
        date: eventData.date_deb,
        dateFin: eventData.date_fin || null,
        capacite: eventData.capacite || 0
      };
      
      // Supprimer les champs non nécessaires pour le backend
      delete formattedData.date_deb;
      delete formattedData.date_fin;
      
      // Ajouter l'ID si en mode édition
      if (this.isEditMode) {
        formattedData.id = this.data.id;
      }
      
      console.log("Données événement formatées:", formattedData);
      this.dialogRef.close(formattedData);
    } else {
      console.log('Formulaire invalide:', this.form);
      this.markFormGroupTouched(this.form);
    }
  }

  // Marquer tous les champs comme touchés pour afficher les erreurs
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  open() {
    this.dialog.open(EvtCreateComponent);
  }

  // Getters pour faciliter l'accès aux champs dans le template
  get titre() { return this.form.get('titre'); }
  get date_deb() { return this.form.get('date_deb'); }
  get lieu() { return this.form.get('lieu'); }
  get capacite() { return this.form.get('capacite'); }
}
