import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evenement } from 'src/model/Evenement';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class EvtService {
  constructor(private httpClient: HttpClient) {}

  getAllEvents(): Observable<Evenement[]> {
    return this.httpClient.get<Evenement[]>(`${environment.eventServiceUrl}`);
  }

  addEvent(e: Evenement): Observable<Evenement> {
    console.log('Adding event to:', `${environment.eventServiceUrl}`);
    console.log('Event data:', e);
    return this.httpClient.post<Evenement>(`${environment.eventServiceUrl}`, e);
  }

  updateEvent(e: Evenement, id: string): Observable<Evenement> {
    return this.httpClient.put<Evenement>(`${environment.eventServiceUrl}/${id}`, e);
  }

  deleteEvent(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.eventServiceUrl}/${id}`);
  }

  getEventById(id: string): Observable<Evenement> {
    return this.httpClient.get<Evenement>(`${environment.eventServiceUrl}/${id}`);
  }

  // Méthodes de recherche
  searchByTitle(titre: string): Observable<Evenement[]> {
    return this.httpClient.get<Evenement[]>(`${environment.eventServiceUrl}/search/title?mc=${titre}`);
  }

  searchByType(type: string): Observable<Evenement[]> {
    return this.httpClient.get<Evenement[]>(`${environment.eventServiceUrl}/search/type?type=${type}`);
  }

  searchByLocation(lieu: string): Observable<Evenement[]> {
    return this.httpClient.get<Evenement[]>(`${environment.eventServiceUrl}/search/location?mc=${lieu}`);
  }

  searchByKeyword(keyword: string): Observable<Evenement[]> {
    return this.httpClient.get<Evenement[]>(`${environment.eventServiceUrl}/search/keyword?mc=${keyword}`);
  }
}
