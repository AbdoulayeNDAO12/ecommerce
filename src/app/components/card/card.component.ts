import { CartModelServer } from './../../models/cart.model';
import { CartService } from './../../service/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: number;
  subTotal: number;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(
      (data: CartModelServer) => (this.cartData = data)
    );

    this.cartService.cartTotal$.subscribe((total) => (this.cartTotal = total));
  }

  changeQuantity(index: number, increase: boolean) {
    this.cartService.updateCartData(index, increase);
  }
}
