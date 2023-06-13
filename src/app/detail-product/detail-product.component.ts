import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CaddyService } from '../services/caddy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ItemProduct } from '../model/itemproduct.model';
import { Product } from '../model/product.model';
import { ShopService } from '../services/shop.service';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {

  constructor(public shopService: ShopService,
              private authService:AuthentificationService,
              public activatedRoute:ActivatedRoute,
              private router:Router,
              public productService:ProductService,
              private caddyService:CaddyService
              ) { }

  ngOnInit(): void {
  }
  public backHome(){
    let header = new HeaderComponent(this.shopService,
                                    this.authService,
                                    this.activatedRoute,
                                    this.router,
                                    this.productService,
                                    this.caddyService);
    header.backHome();
  }
  public get currentProduct():any{
    return this.productService.currentProduct; 
  }
  public onAddProductToCaddy(p:Product) {
    let itemProduct:ItemProduct = new ItemProduct();
    itemProduct.product = p;
    itemProduct.shopName=this.currentShops.shopName;
    itemProduct.quatity=p.quantity;
    this.caddyService.addProductToCaddy(itemProduct);
  }
  public get currentShops():any{
    return this.productService.currentShops; 
  }
}
