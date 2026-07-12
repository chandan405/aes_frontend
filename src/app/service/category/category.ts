import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Category {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  add(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}category/add`, data);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}category/get`);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}category/update/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}category/delete/${id}`);
  }
}
