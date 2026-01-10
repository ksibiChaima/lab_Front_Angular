import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evenement } from 'src/model/Evenement';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class EvtService {

  constructor( private httpClient : HttpClient) { }
  GetAllEvt(): Observable<Evenement[]> {
    return this.httpClient.get<Evenement[]>(`${environment.eventServiceUrl}`);
  }
 
  addEvent(e: Evenement): Observable<void> {
    return this.httpClient.post<void>(`${environment.eventServiceUrl}`, e);
  }

  updateEvt(e:Evenement,id:string ) :Observable<void> {
    return this.httpClient.put<void>(`${environment.eventServiceUrl}/${id}`, e);
  }

  getEvtByID(id: string ):Observable<Evenement>{
    return this.httpClient.get<Evenement>(`${environment.eventServiceUrl}/${id}`);
  }
   
}
