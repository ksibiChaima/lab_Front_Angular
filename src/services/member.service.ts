import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/model/Member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  /*varible : type */ 
   constructor( private httpClient: HttpClient) { }

  GetAllMembers():Observable<Member[]>

{
  //envoyer d'une requete http vers le backend (endpoint)
return this.httpClient.get<Member[]>("http://localhost:3000/members") // return un tableau de member (any because on n'a pas encore faire le model member ) link endpoint de json server)
}
addMember(f:Member):Observable<void>
{ // on met le meme type void car j'attends pas la reception des donnees
  //f est l'emlment a insere au niveau de la base

  return this.httpClient.post<void>('http://localhost:3000/members',f)
}
deleteMemberById(id:string): Observable<void>{
  return this.httpClient.delete<void>
  (`http://localhost:3000/members/${id}`); // `` =>bech maya9rach id en tand que string 
    


}
getMemberByID(id: string ):Observable<Member>

{
  //envoyer d'une requete http vers le backend (endpoint)
return this.httpClient.get<Member>
(`http://localhost:3000/members/${id}`) // return un  member 
}
updateMember(id:string ,f:Member) :Observable<void>
{
  return this.httpClient.put<void>
(`http://localhost:3000/members/${id}`,f) 
}
 
}
