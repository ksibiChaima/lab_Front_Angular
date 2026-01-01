import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MemberService } from 'src/services/member.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent  implements OnInit{
  form!:FormGroup; // ! pour intialiser et attribaution du valeur automatique like the ts wants 
  

  constructor(private MS:MemberService, private router:Router, private activatedRoute : ActivatedRoute){


  }
  ngOnInit(): void {
    //1.tester le route pour tester si il contient un id 
   const idcourant = this.activatedRoute.snapshot.params['id'] // snapshot pour une capture d'image et params pour la fragmenter 
    //2. si oui => getMEMberByID
  if (idcourant){
    this.MS.getMemberByID(idcourant).subscribe((a)=>{
      this.form=new FormGroup({
        cin:new FormControl(a.cin) , // intialiser l attribut au null , si je met "xxx" l'attrubut sera intilaiser au xxx et s'affiche dans formulaire
        name:new FormControl(a.name),
        type:new FormControl(a.type),
        //createDate:new FormControl(null),
      })
    })////////
   } 

   else {
     // creation des attributs 
    //intialisation des attributs 
      this.form=new FormGroup({
        cin:new FormControl(null) , // intialiser l attribut au null , si je met "xxx" l'attrubut sera intilaiser au xxx et s'affiche dans formulaire
        name:new FormControl(null),
        type:new FormControl(null),
        //createDate:new FormControl(null),
      })
   }
  
    //3.sinon intialiser a null 


   
  }
  
  sub():void{
    const idcourant = this.activatedRoute.snapshot.params['id'] // snapshot pour une capture d'image et params pour la fragmenter 
    //2. si oui => getMEMberByID
   if (idcourant){
    console.log("update")
        this.MS.updateMember(idcourant,this.form.value).subscribe(() => {
          this.router.navigate(['/member']);
        })
   }
   else{
     // recupere les données du html 
    // creer une instance de form 
    console.log(this.form.value)
    //appeler la fonction addMemeber du service
    //=> injection du dependance
    const x={...this.form.value, createDate: (new Date()).toISOString()}// ... extractre les attributs : meme valeur de formulaire
    this.MS.addMember(x).subscribe(()=>{ 
      // redirection vers /member
      this.router.navigate(['/member']);
    })


   }

   


  }

}
