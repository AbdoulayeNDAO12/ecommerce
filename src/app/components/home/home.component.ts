import { CartService } from './../../service/cart.service';
import {
  ServerResponse,
  ProductModelServer,
} from './../../models/product.model';
import { Router } from '@angular/router';
import { ProductService } from './../../service/product.service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  product: ProductModelServer[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService
      .getAllProducts(12)
      .subscribe((prods: ServerResponse) => {
        this.product = prods.products;
      });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }
  addProductToCart(productId: number) {
    this.cartService.addProductToCard(productId);
  }
}
