import { OrderService } from './../../service/order.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thankyouk',
  templateUrl: './thankyouk.component.html',
  styleUrls: ['./thankyouk.component.css'],
})
export class ThankyoukComponent implements OnInit {
  message: string;
  orderId: number;
  products: any[] = [];
  cartTotal: number;

  constructor(private router: Router, private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      message: string;
      products: ProductResponseModel[];
      orderId: number;
      total: number;
    };

    this.message = state.message;
    this.cartTotal = state.total;
    this.products = state.products;
    this.orderId = state.orderId;
  }

  ngOnInit(): void {}
}

interface ProductResponseModel {
  id: number;
  name: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
