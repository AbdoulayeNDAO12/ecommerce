import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  BASE_URL = environment.BASE_URL;

  constructor(private http: HttpClient) {}

  getSingleOrder(id: number) {
    return this.http
      .get<ProductSingleResponse[]>(`${this.BASE_URL}api/orders/${id}`)
      .toPromise();
  }
}

interface ProductSingleResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
