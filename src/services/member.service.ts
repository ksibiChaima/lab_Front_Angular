import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/model/Member';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  /*varible : type */ 
   constructor( private httpClient: HttpClient) { }

  GetAllMembers():Observable<Member[]>

{
  // Use configured backend URL
  return this.httpClient.get<Member[]>(`${environment.memberServiceUrl}`);
}
addMember(f:Member):Observable<void>
{ // on met le meme type void car j'attends pas la reception des donnees
  //f est l'emlment a insere au niveau de la base

  return this.httpClient.post<void>(`${environment.memberServiceUrl}`, f)
}
deleteMemberById(id:string): Observable<void>{
  return this.httpClient.delete<void>(`${environment.memberServiceUrl}/${id}`);
    


}
getMemberByID(id: string ):Observable<Member>

{
  //envoyer d'une requete http vers le backend (endpoint)
return this.httpClient.get<Member>(`${environment.memberServiceUrl}/${id}`)
}
updateMember(id:string ,f:Member) :Observable<void>
{
  return this.httpClient.put<void>(`${environment.memberServiceUrl}/${id}`, f)
}
 
}
