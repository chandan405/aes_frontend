import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Product {
  url = environment.apiUrl;
  constructor(private http: HttpClient) { }

  add(data: any) {
    return this.http.post(this.url + 'product/add', data);
  }

  getAll() {
    return this.http.get(this.url + 'product/get');
  }

  update(id: any, data: any) {
    return this.http.put(this.url + 'product/update/' + id, data);
  }

  delete(id: any) {
    return this.http.delete(this.url + 'product/delete/' + id);
  }

  getByCategoryID(categoryID: any) {
    return this.http.get(this.url + 'product/getByCategoryID/' + categoryID);
  }
}
