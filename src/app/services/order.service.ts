import { Injectable } from '@angular/core';
import { OrderForme } from '../model/orderforme.model';
import { CaddyService } from './caddy.service';
import { HttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { Client } from '../model/client.model';
import { Observable } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { UrlData } from '../model/urlData.modul';
import { InfoBill } from '../model/infoBill.model';
import { Order } from '../model/order.model';
import { OrdeLine } from '../model/ordeline.model';
import { Body } from '../model/body.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public order:OrderForme=new OrderForme();

  constructor(private caddyService:CaddyService,
              private httpClient:HttpClient,
              private authService:AuthentificationService, 
              private productService:ProductService) { }

  public setClient(client:Client){
    if(this.caddyService.getCurrentCaddy()!=undefined){
      this.caddyService.getCurrentCaddy()!.client=client;
      this.caddyService.saveCaddiesToLocalStorage();
    }
    this.order.client=client;
  }
  public loadProductsFromCaddy(){
    this.order.ordeLine=[];
   for(let key in this.caddyService.getCaddy().items){
     this.order.ordeLine.push(this.caddyService.getCaddy().items[key]);
   }
  }
  public submitOrder(){
    let orderform = new OrderForme();
    let client =  new Client();
    client.address="hhjj"
    client.email="mmmmm"
    client.email="mmmmmmm"
    client.phoneNumber="kkkll"
    orderform.client=client
    orderform.idUser=this.authService.authentificatedUser!.idUserApp
    this.caddyService.getCurrentCaddy()?.items.forEach(item=>{
      let ordeLine= new OrdeLine();
      ordeLine.id=item.product.idProduct;
      ordeLine.quatity=item.quatity;
      orderform.ordeLine.push(ordeLine);
    })
    this.order.idUser=this.authService.authentificatedUser!.idUserApp;
    console.log(orderform)
    return this.httpClient.post<Order>(this.productService.host+"/api/orders",orderform);
  }
  public getOrder(id:number):Observable<OrderForme>{
    return this.httpClient.get<OrderForme>(this.productService.host+"/api/orders/"+id);
  }
  public infoBill(id:number){
    return this.httpClient.get(this.productService.host+"/api/bills/"+id);
  }
  public payOrderByMTN(id:number,body:Body){
    console.log(body)
    return this.httpClient.post(this.productService.host+"/api/payments/MTN/"+id,body);
  }
  public deleteOrder(id:number){
    return this.httpClient.delete(this.productService.host+"/api/orders/"+id);
  }
  public getShopOrder(urlData:UrlData){
    return this.httpClient.post<{content:Array<Order>,number:number,totalElements:number,size:number,totalPages:number}>(this.productService.host+"/api/orders/shop",urlData);
  }
  public getClientOrder(urlData:UrlData){
    return this.httpClient.post<{content:Array<Order>,number:number,totalElements:number,size:number,totalPages:number}>(this.productService.host+"/api/orders/client",urlData);
  }
}
  

