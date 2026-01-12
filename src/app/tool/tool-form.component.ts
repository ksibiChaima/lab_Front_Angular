import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OutilService } from '../../services/outil.service';
import { Outil } from '../../model/Outil';

@Component({
  selector: 'app-tool-form',
  templateUrl: './tool-form.component.html',
  styleUrls: ['./tool-form.component.css']
})
export class ToolFormComponent implements OnInit {
  form!: FormGroup;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private outilService: OutilService) {}

  ngOnInit(): void {
    const idcourant = this.activatedRoute.snapshot.params['id'];
    
    this.form = this.fb.group({
      id: [null],
      titre: [null, Validators.required],
      description: [null, Validators.required],
      source: [null],
      github: [null, Validators.pattern('https?://.+')],
      demoUrl: [null, Validators.pattern('https?://.+')],
      language: [null],
      version: [null],
      licence: ['MIT'],
      statut: ['active'],
      authorIds: [null]
    });

    if (idcourant) {
      this.outilService.getById(idcourant).subscribe(outil => {
        // Convert arrays to strings for form display
        const formData = {
          ...outil,
          authorIds: outil.authorIds ? outil.authorIds.join(', ') : null
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
      
      this.outilService.update(idcourant, payload).subscribe({
        next: () => {
          console.log('Tool updated successfully!');
          this.router.navigate(['/outils']);
        },
        error: (err) => {
          console.error('Error updating tool:', err);
          alert('Erreur lors de la mise à jour de l\'outil: ' + err.message);
        }
      });
    } else {
      const payload = { 
        ...this.form.value, 
        date: new Date(),
        source: this.form.value.titre || this.form.value.source 
      };
      
      // Convert authorIds string to array
      if (payload.authorIds && typeof payload.authorIds === 'string') {
        payload.authorIds = payload.authorIds.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      
      console.log('Tool payload:', payload);
      
      this.outilService.add(payload).subscribe({
        next: () => {
          console.log('Tool created successfully!');
          this.router.navigate(['/outils']);
        },
        error: (err) => {
          console.error('Error creating tool:', err);
          alert('Erreur lors de la création de l\'outil: ' + err.message);
        }
      });
    }
  }
}
