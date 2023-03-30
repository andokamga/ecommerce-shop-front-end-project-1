import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShopService } from './services/shop.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce-shop-front-end-project-1';
  public fromSearch!:string;
  public search!:string
  public town:any
  public isHome:number=0
  public currentShops:any;
  public isSearch:number=0;
  public shops:any
  constructor(public shopService: ShopService) { }
  onSearch(){
    this.fromSearch=this.search;
    console.log(this.search);
  }
  backHome(){
    console.log('bjr');
    this.isHome+=1;
  }
  onGetTown(){
    this.shopService.getAllTown()
    .subscribe((data)=>{
      this.town=data;
      console.log(data); 
    });
  }
  onGetShop(town:any){
    this.shops=town.shops;
    console.log(this.shops); 
  }
  onGetProduct(shop:any){
    this.currentShops=shop;
  }
}
