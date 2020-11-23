import { ServerResponse, ProductModelServer } from './../models/product.model';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  BASE_URL = environment.BASE_URL;
  productData$ = new BehaviorSubject<ServerResponse>([]);

  constructor(private http: HttpClient) {}
  //getting all products

  getAllProducts(numberOfResults: number = 10): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.BASE_URL + 'api/products', {
      params: {
        limit: numberOfResults.toString(),
      },
    });
  }

  //get single product

  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(
      this.BASE_URL + 'api/products/' + id
    );
  }

  //get  products from category

  getProductFromCategory(catname: string): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(
      this.BASE_URL + '/api/products/category/' + catname
    );
  }
}
