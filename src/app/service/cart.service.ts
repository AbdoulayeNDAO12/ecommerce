import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProductModelServer } from './../models/product.model';
import { Router, NavigationExtras } from '@angular/router';
import { CartModelServer, CartModelPublic } from './../models/cart.model';
import { environment } from './../../environments/environment';
import { OrderService } from './order.service';
import { ProductService } from './product.service.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  BASE_URL = environment.BASE_URL;
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [
      {
        id: 0,
        incart: 0,
      },
    ],
  };

  private cartDataServer: CartModelServer = {
    total: 0,
    data: [
      {
        numInCart: 0,
        product: undefined,
      },
    ],
  };

  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    if (info !== undefined && info !== null && info.prodData[0].incart !== 0) {
      this.cartDataClient = info;

      this.cartDataClient.prodData.forEach((p) => {
        this.productService
          .getSingleProduct(p.id)
          .subscribe((actualProductInfo: ProductModelServer) => {
            if (this.cartDataServer.data[0].numInCart === 0) {
              this.cartDataServer.data[0].numInCart = p.incart;
              this.cartDataServer.data[0].product = actualProductInfo;

              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
              this.cartDataServer.data.push({
                numInCart: p.incart,
                product: actualProductInfo,
              });
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
            this.cartData$.next({ ...this.cartDataServer });
          });
      });
    }
  }

  addProductToCard(id: number, quantity?: number) {
    this.productService.getSingleProduct(id).subscribe((prod) => {
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart =
          quantity !== undefined ? quantity : 1;
        this.calculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ...this.cartDataServer });
        this.toastrService.success(
          `${prod.name} added to the cart`,
          'Product added',
          {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right',
          }
        );
      } else {
        let index = this.cartDataServer.data.findIndex(
          (p) => p.product.id === prod.id
        );
        if (index !== -1) {
          if (quantity !== undefined && quantity <= prod.quantity) {
            this.cartDataServer.data[index].numInCart =
              this.cartDataServer.data[index].numInCart < quantity
                ? quantity
                : prod.quantity;
          } else {
            this.cartDataServer.data[index].numInCart < prod.quantity
              ? this.cartDataServer.data[index].numInCart++
              : prod.quantity;
          }

          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[
            index
          ].numInCart;

          this.toastrService.info(
            `${prod.name} added to the cart`,
            'Product updated',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        } else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1,
          });
          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id,
          });
          this.toastrService.success(
            `${prod.name} added to the cart`,
            'Product added',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        }
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ...this.cartDataServer });
      }
    });
  }
  private calculateTotal() {
    let Total = 0;
    this.cartDataServer.data.forEach((p) => {
      const { numInCart } = p;
      const { price } = p.product;
      Total += price * numInCart;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  updateCartData(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      data.numInCart < data.product.quantity
        ? data.numInCart++
        : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      this.cartData$.next({ ...this.cartDataServer });
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {
      data.numInCart--;
      if (data.numInCart < 1) {
        this.deleteProductFromCart(index);
        this.cartData$.next({ ...this.cartDataServer });
      } else {
        this.cartDataClient.prodData[index].incart = data.numInCart;
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        this.cartData$.next({ ...this.cartDataServer });
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }
  deleteProductFromCart(index) {
    if (window.confirm('Are you sur you want to delete ')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {
          total: 0,
          prodData: [
            {
              id: 0,
              incart: 0,
            },
          ],
        };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          total: 0,
          data: [
            {
              numInCart: 0,
              product: undefined,
            },
          ],
        };
        this.cartData$.next({ ...this.cartDataServer });
      } else {
        this.cartData$.next({ ...this.cartDataServer });
      }
    } else {
      return;
    }
  }

  private calculateSubTotal(index: number) {
    let subTotal = 0;
    let data = this.cartDataServer.data[index];
    subTotal = data.numInCart * data.product.price;
    return subTotal;
  }
  checkOutFromCart(userId: number) {
    this.http
      .post(`${this.BASE_URL}api/orders/payment`, null)
      .subscribe((res: { success: Boolean }) => {
        console.clear();

        if (res.success) {
          this.resetServerData();
          this.http
            .post(`${this.BASE_URL}api/orders/new`, {
              userId: userId,
              products: this.cartDataClient.prodData,
            })
            .subscribe((data: OrderConfirmationResponse) => {
              this.orderService.getSingleOrder(data.order_id).then((prods) => {
                if (data.success) {
                  const navigationExtras: NavigationExtras = {
                    state: {
                      message: data.message,
                      products: prods,
                      orderId: data.order_id,
                      total: this.cartDataClient.total,
                    },
                  };
                  // this.spinner.find().then();
                  this.router
                    .navigate(['/thankyou'], navigationExtras)
                    .then((p) => {
                      this.cartDataClient = {
                        total: 0,
                        prodData: [{ id: 0, incart: 0 }],
                      };
                      this.cartTotal$.next(0);
                      localStorage.setItem(
                        'cart',
                        JSON.stringify(this.cartDataClient)
                      );
                    });
                }
              });
            });
        } else {
          // this.spinner.hide().then();
          this.router.navigate(['/checkout']).then();
          this.toastrService.success(
            'Sorry failed to book your order',
            'Error Status',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        }
      });
  }

  private resetServerData() {
    this.cartDataServer = {
      total: 0,
      data: [
        {
          numInCart: 0,
          product: undefined,
        },
      ],
    };
    this.cartData$.next({ ...this.cartDataServer });
  }

  getCategories() {
    return this.http.get(`${this.BASE_URL}api/categories`).toPromise();
  }
}

interface OrderConfirmationResponse {
  order_id: number;
  success: Boolean;
  message: String;
  product: [
    {
      id: String;
      numInCart: String;
    }
  ];
}
