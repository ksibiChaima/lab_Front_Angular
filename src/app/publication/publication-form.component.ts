import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationService } from '../../services/publication.service';
import { Publication } from '../../model/Publication';

@Component({
  selector: 'app-publication-form',
  templateUrl: './publication-form.component.html',
  styleUrls: ['./publication-form.component.css']
})
export class PublicationFormComponent implements OnInit {
  form!: FormGroup;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private publicationService: PublicationService) {}

  ngOnInit(): void {
    const idcourant = this.activatedRoute.snapshot.params['id'];
    
    this.form = this.fb.group({
      id: [null],
      titre: [null, Validators.required],
      description: [null, Validators.required],
      type: ['article', Validators.required],
      date: [null, Validators.required],
      authorIds: [null, Validators.required],
      lien: [null, Validators.pattern('https?://.+')],
      categorie: [null],
      journal: [null],
      doi: [null],
      statut: ['published']
    });

    if (idcourant) {
      this.publicationService.getById(idcourant).subscribe(pub => {
        // Convert authorIds array to string for form display
        const formData = {
          ...pub,
          authorIds: pub.authorIds ? pub.authorIds.join(', ') : null
        };
        this.form.patchValue(formData);
      });
    }
  }

  sub(): void {
    const idcourant = this.activatedRoute.snapshot.params['id'];
    
    if (idcourant) {
      const payload = { ...this.form.value };
      // Convert authorIds string to array
      if (payload.authorIds && typeof payload.authorIds === 'string') {
        payload.authorIds = payload.authorIds.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      
      this.publicationService.update(idcourant, payload).subscribe({
        next: () => {
          console.log('Publication updated successfully!');
          this.router.navigate(['/PUBLICATION/publications']);
        },
        error: (err) => {
          console.error('Error updating publication:', err);
          alert('Erreur lors de la mise à jour de la publication: ' + err.message);
        }
      });
    } else {
      const payload = { ...this.form.value };
      // Convert authorIds string to array
      if (payload.authorIds && typeof payload.authorIds === 'string') {
        payload.authorIds = payload.authorIds.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      
      console.log('Publication payload:', payload);
      
      this.publicationService.add(payload).subscribe({
        next: () => {
          console.log('Publication created successfully!');
          this.router.navigate(['/PUBLICATION/publications']);
        },
        error: (err) => {
          console.error('Error creating publication:', err);
          alert('Erreur lors de la création de la publication: ' + err.message);
        }
      });
    }
  }
}
