import { ServerResponse } from './../../models/product.model';
import { ProductService } from './../../service/product.service.service';
import { CartService } from './../../service/cart.service';
import { CartModelServer } from './../../models/cart.model';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: number;
  listCategories;
  categorySelected: string = '';
  @Output() categoryChanged = new EventEmitter();

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((total) => {
      this.cartData = total;
    });
    this.cartService.cartTotal$.subscribe((total) => {
      this.cartTotal = total;
    });
    this.cartService.getCategories().then((categories) => {
      this.listCategories = categories;
    });
  }

  async onTypeChange(event) {
    this.categorySelected = await event.target.value;
  }

  valueChanged() {
    this.categoryChanged.emit(this.categorySelected);
  }
}
