import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Outil } from 'src/model/Outil';

@Injectable({
  providedIn: 'root'
})
export class OutilService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Outil[]> {
    return this.http.get<Outil[]>('http://localhost:3000/outils');
  }

  getById(id: string): Observable<Outil> {
    return this.http.get<Outil>(`http://localhost:3000/outils/${id}`);
  }

  add(o: Outil): Observable<void> {
    return this.http.post<void>('http://localhost:3000/outils', o);
  }

  update(id: string, o: Outil): Observable<void> {
    return this.http.put<void>(`http://localhost:3000/outils/${id}`, o);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/outils/${id}`);
  }
}
