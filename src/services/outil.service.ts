import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Outil } from 'src/model/Outil';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class OutilService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Outil[]> {
    return this.http.get<Outil[]>(`${environment.outilServiceUrl}`);
  }

  getById(id: string): Observable<Outil> {
    return this.http.get<Outil>(`${environment.outilServiceUrl}/${id}`);
  }

  add(o: Outil): Observable<void> {
    return this.http.post<void>(`${environment.outilServiceUrl}`, o);
  }

  update(id: string, o: Outil): Observable<void> {
    return this.http.put<void>(`${environment.outilServiceUrl}/${id}`, o);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.outilServiceUrl}/${id}`);
  }
}
