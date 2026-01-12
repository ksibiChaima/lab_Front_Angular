import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from 'src/services/member.service';
import { RealtimeRoleService } from 'src/services/realtime-role.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {
  form!: FormGroup;
  

  constructor(private MS: MemberService, private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private realtimeRoleService: RealtimeRoleService, private afAuth: AngularFireAuth) {}
  ngOnInit(): void {
    //1.tester le route pour tester si il contient un id 
    const idcourant = this.activatedRoute.snapshot.params['id']; // snapshot pour une capture d'image et params pour la fragmenter
    //2. si oui => getMEMberByID
    // build the form with common and optional fields
    this.form = this.fb.group({
      cin: [null],
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      type: ['etudiant', Validators.required],
      // student-specific
      diplome: [null],
      dateInscription: [null],
      encadreurId: [null],
      sujetThese: [null],
      // enseignant-specific
      grade: [null],
      etablissement: [null],
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
          password: 'password123', // Dummy password for edit mode
          type: a.type || 'etudiant',
          diplome: (a as any).diplome || a.diploma || null,
          dateInscription: (a as any).dateInscription || a.dateInscription || null,
          encadreurId: a.encadrant?.id || (a as any).encadreurId || null,
          sujetThese: a.sujet || (a as any).sujetThese || null,
          grade: a.grade || null,
          etablissement: a.etablissement || null,
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
        console.log('Member updated successfully!');
        
        // Update Firebase role if needed
        const email = payload.email;
        const role = payload.type === 'enseignant' ? 'admin' : 'member';
        
        // Try to get existing Firebase user UID first
        this.afAuth.fetchSignInMethodsForEmail(email).then((methods) => {
          if (methods && methods.length > 0) {
            // User exists in Firebase Auth, get their UID
            this.afAuth.signInWithEmailAndPassword(email, 'password123')
              .then((userCredential) => {
                const uid = userCredential.user?.uid;
                if (uid) {
                  this.realtimeRoleService.setUserRole(uid, email, role)
                    .then(() => {
                      console.log(`Firebase role updated: ${email} -> ${role}`);
                      this.router.navigate(['/member']);
                    })
                    .catch((error) => {
                      console.error('Error updating Firebase role:', error);
                      this.router.navigate(['/member']);
                    });
                }
              })
              .catch((error) => {
                console.error('Error signing in to get UID:', error);
                this.router.navigate(['/member']);
              });
          } else {
            console.log('User not found in Firebase Auth, skipping role update');
            this.router.navigate(['/member']);
          }
        }).catch((error) => {
          console.error('Error checking Firebase user:', error);
          this.router.navigate(['/member']);
        });
      });
   }
   else{
     // recupere les données du html 
    // creer une instance de form 
    console.log('Form value before processing:', this.form.value);
    //appeler la fonction addMemeber du service
    //=> injection du dependance
      const payload = { ...this.form.value, createDate: (new Date()).toISOString() } as any;
      if (payload.specialites && typeof payload.specialites === 'string') {
        payload.specialites = payload.specialites.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      console.log('Final payload for member creation:', payload);
      
      this.MS.addMember(payload).subscribe({
        next: (response) => {
          console.log('Member created successfully!', response);
          
          // Create Firebase Auth user for login capability
          const email = payload.email;
          const password = payload.password;
          const role = payload.type === 'enseignant' ? 'admin' : 'member';
          
          // First create Firebase Auth user
          this.afAuth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
              const uid = userCredential.user?.uid || Date.now().toString();
              console.log(`Firebase Auth user created: ${email} with UID: ${uid}`);
              
              // Then add user role to Firebase Realtime Database
              this.realtimeRoleService.setUserRole(uid, email, role)
                .then(() => {
                  console.log(`User role added to Firebase: ${email} -> ${role}`);
                  this.router.navigate(['/member']);
                })
                .catch((error) => {
                  console.error('Error adding user role to Firebase:', error);
                  this.router.navigate(['/member']);
                });
            })
            .catch((authError) => {
              console.error('Error creating Firebase Auth user:', authError);
              // Still navigate to member list even if Firebase Auth fails
              this.router.navigate(['/member']);
            });
        },
        error: (err) => {
          console.error('Error creating member:', err);
          alert('Erreur lors de la création du membre: ' + err.message);
        }
      });
   }
  }
}
