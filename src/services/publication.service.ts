import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publication } from 'src/model/Publication';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Publication[]> {
    return this.http.get<Publication[]>('http://localhost:3000/publications');
  }

  getById(id: string): Observable<Publication> {
    return this.http.get<Publication>(`http://localhost:3000/publications/${id}`);
  }

  add(pub: Publication): Observable<void> {
    return this.http.post<void>('http://localhost:3000/publications', pub);
  }

  update(id: string, pub: Publication): Observable<void> {
    return this.http.put<void>(`http://localhost:3000/publications/${id}`, pub);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/publications/${id}`);
  }
}
