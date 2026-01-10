import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publication } from 'src/model/Publication';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${environment.publicationServiceUrl}`);
  }

  getById(id: string): Observable<Publication> {
    return this.http.get<Publication>(`${environment.publicationServiceUrl}/${id}`);
  }

  add(pub: Publication): Observable<void> {
    return this.http.post<void>(`${environment.publicationServiceUrl}`, pub);
  }

  update(id: string, pub: Publication): Observable<void> {
    return this.http.put<void>(`${environment.publicationServiceUrl}/${id}`, pub);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.publicationServiceUrl}/${id}`);
  }
}
