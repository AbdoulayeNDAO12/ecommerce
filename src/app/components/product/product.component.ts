import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from './../../service/cart.service';
import { ProductService } from './../../service/product.service.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, AfterViewInit {
  @ViewChild('quantity') quantityInput;
  id: number;
  product;
  thumbImages: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((prodId) => {
      this.id = prodId.id;
      this.productService.getSingleProduct(this.id).subscribe((prod) => {
        this.product = prod;
        console.log(prod);

        if (prod.images !== null) {
          this.thumbImages = prod.images.split(';');
        }
      });
    });
  }

  ngAfterViewInit() {
    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [
        {
          breakpoint: 991,
          settings: {
            vertical: false,
            arrows: false,
            dots: true,
          },
        },
      ],
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  addToCart(index: number) {
    this.cartService.addProductToCard(
      index,
      this.quantityInput.nativeElement.value
    );
  }

  increase() {
    let value = parseInt(this.quantityInput.nativeElement.value);

    if (this.product.quantity >= 1) {
      value++;
      if (value > this.product.quantity) {
        value = this.product.quantity;
      } else {
        return;
      }
      this.quantityInput.nativeElement.value = value.toString();
    }
  }

  decrease() {
    let value = parseInt(this.quantityInput.nativeElement.value);

    if (this.product.quantity > 0) {
      value--;
      if (value <= 0) {
        value = 0;
      } else {
        return;
      }
      this.quantityInput.nativeElement.value = value.toString();
    }
  }
}
