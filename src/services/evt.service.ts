import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evenement } from 'src/model/Evenement';

@Injectable({
  providedIn: 'root'
})
export class EvtService {

  constructor( private httpClient : HttpClient) { }
  GetAllEvt(): Observable<Evenement[]> {
    return this.httpClient.get<Evenement[]>("http://localhost:3000/evenement");
 
  }
 
  addEvent(e: Evenement): Observable<void> {
    return this.httpClient.post<void>('http://localhost:3000/evenement', e);
  }
  updateEvt(e:Evenement,id:string ) :Observable<void>
  {
    return this.httpClient.put<void>
  (`http://localhost:3000/evenement/${id}`,e) 
  }

  getEvtByID(id: string ):Observable<Evenement>{
    //envoyer d'une requete http vers le backend (endpoint)
  return this.httpClient.get<Evenement>
  (`http://localhost:3000/evenement/${id}`) // return un  event
  }
   
}
