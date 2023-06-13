import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Town } from '../model/town.model';
import { Shop } from '../model/shop.model';
import { ProductService } from './product.service';
import { UrlData } from '../model/urlData.modul';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  constructor(private http: HttpClient,
              private productService:ProductService) { }
  public getAllTown(){
    return this.http.get<Array<Town>>(this.productService.host+"/api/shops/towns");
  }
  public getShopOfTown(id:number){
    return this.http.get<any>(this.productService.host+"/api/shops/town/"+id);
  }
  public deleteShop(id:number){
    return this.http.delete(this.productService.host+"/api/shops/"+id);
  }
  public deleteTown(id:number){
    return this.http.delete(this.productService.host+"/api/shops/town/"+id);
  }
  public getOneShop(id:number){
    return this.http.get(this.productService.host+"/api/shops/"+id);
  }
  public getOneTown(id:number){
    return this.http.get(this.productService.host+"/api/shops/town/"+id);
  }
  public addShop(shop:Shop){
    return this.http.post(this.productService.host+"/api/shops",shop);
  }
  public addTown(town:Town){
    return this.http.post(this.productService.host+"/api/shops/town",town);
  }
  public addShopToSeller(urlData:UrlData){
    return this.http.post(this.productService.host+"/api/shops/renove",urlData);
  }
  public removeShopToSeller(urlData:UrlData){
    return this.http.post(this.productService.host+"/api/shops/add",urlData);
  }
  public updateShop(shop:Shop){
    return this.http.put(this.productService.host+"/api/shops",shop);
  }
  public updateTown(town:Town){
    return this.http.put(this.productService.host+"/api/shops/town",town);
  }
}
