import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from 'src/services/member.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {
  form!: FormGroup;
  

  constructor(private MS: MemberService, private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder) {}
  ngOnInit(): void {
    //1.tester le route pour tester si il contient un id 
    const idcourant = this.activatedRoute.snapshot.params['id']; // snapshot pour une capture d'image et params pour la fragmenter
    //2. si oui => getMEMberByID
    // build the form with common and optional fields
    this.form = this.fb.group({
      cin: [null],
      name: [null, Validators.required],
      email: [null, Validators.email],
      type: ['student', Validators.required],
      // student-specific
      niveau: [null],
      encadreurId: [null],
      sujetThese: [null],
      anneeInscription: [null],
      // enseignant-specific
      grade: [null],
      departement: [null],
      laboratoire: [null],
      specialites: [null]
    });

    if (idcourant) {
      this.MS.getMemberByID(idcourant).subscribe((a) => {
        // patch known fields
        this.form.patchValue({
          cin: a.cin || null,
          name: a.name || (a.firstName && a.lastName ? `${a.firstName} ${a.lastName}` : null),
          email: a.email || null,
          type: a.type || 'student',
          niveau: (a as any).niveau || null,
          encadreurId: (a as any).encadreurId || null,
          sujetThese: (a as any).sujetThese || null,
          anneeInscription: (a as any).anneeInscription || null,
          grade: a.grade || null,
          departement: (a as any).departement || null,
          laboratoire: (a as any).laboratoire || null,
          specialites: (a as any).specialites ? (a as any).specialites.join(', ') : null
        });
      });
    }
  
    //3.sinon intialiser a null 


   
  }
  
  sub():void{
    const idcourant = this.activatedRoute.snapshot.params['id'] // snapshot pour une capture d'image et params pour la fragmenter 
    //2. si oui => getMEMberByID
    if (idcourant) {
      const payload = { ...this.form.value };
      // convert specialites string to array
      if (payload.specialites && typeof payload.specialites === 'string') {
        payload.specialites = payload.specialites.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      this.MS.updateMember(idcourant, payload).subscribe(() => {
        this.router.navigate(['/member']);
      });
   }
   else{
     // recupere les données du html 
    // creer une instance de form 
    console.log(this.form.value)
    //appeler la fonction addMemeber du service
    //=> injection du dependance
      const payload = { ...this.form.value, createDate: (new Date()).toISOString() } as any;
      if (payload.specialites && typeof payload.specialites === 'string') {
        payload.specialites = payload.specialites.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      this.MS.addMember(payload).subscribe(() => {
        this.router.navigate(['/member']);
      });
   }
  }
}
