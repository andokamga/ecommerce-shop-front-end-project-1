import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlData } from '../model/urlData.modul';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //public urlData:UrlData = new UrlData();
  public host:String= "http://localhost:8080";
  constructor(private http: HttpClient) {}
  public  getProductHome(urlData:UrlData){
    return this.http.post(this.host+"/api/products/home",urlData);
  }
  public getShopCat(idShop:any){
    return this.http.get(this.host+"/api/products/categories/"+idShop);
  }
  public getShopBrand(idShop:any){
    return this.http.get(this.host+"/api/products/brands/"+idShop);
  }
  public getProductByCategory(urlData:UrlData){
    return this.http.post(this.host+"/api/products/categoryProducts",urlData);
  }
  public getProductByBrand(urlData:UrlData){
    return this.http.post(this.host+"/api/products/brandProducts",urlData);
  }
  public getProductByFilter(urlData:UrlData){
    return this.http.post(this.host+"/api/products/search",urlData);
  }
  public getShopProduct(urlData:UrlData){
    return this.http.post(this.host+"/api/products/shop",urlData);
  }

}
