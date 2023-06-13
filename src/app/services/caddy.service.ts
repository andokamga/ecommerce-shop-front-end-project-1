import { Injectable } from '@angular/core';
import { Caddy } from '../model/caddy.model';
import { ItemProduct } from '../model/itemproduct.model';

@Injectable({
  providedIn: 'root'
})
export class CaddyService {
  public currentShop:any
  public currentCaddy:any
  public currentCaddyName:any;
  public listCaddies:Array<{mun:number,name:string}>=[];
  public caddies:Map<string,Caddy> = new Map();
 /* public get currentShop(){
    return this.currentShops; 
  }*/
  constructor() {
    this.getCaddiesToLocalStorage();
    this.addCaddyToListCaddies();
   }

  public addProductToCaddy(itemProduct:ItemProduct){
    console.log(itemProduct)
    let caddy = this.caddies.get(itemProduct.shopName);
    let itemCaddy=false;
    if(caddy){
      caddy.items.forEach(item=>{
        if(item.product.idProduct==itemProduct.product.idProduct){
          item.quatity+=itemProduct.quatity;
          item.price = itemProduct.product.productPrice*item.quatity;
          itemCaddy=true;
        }
      })
      //let item = caddy!.items.get(itemProduct.product.idProduct);
      if(!itemCaddy){
        let length = caddy.items.length
        let item = caddy.items[itemProduct.product.idProduct]
        caddy.items[length]=itemProduct;
        caddy.items[length].price = itemProduct.product.productPrice*caddy.items[length].quatity;
      }
      this.saveCaddiesToLocalStorage()
    }else{
      console.log(itemProduct)
      let caddy = new Caddy(itemProduct.shopName);
      let length = caddy.items.length;
      caddy.items[length] = itemProduct;
      caddy.items[length].price=itemProduct.product.productPrice*caddy.items[length].quatity
      //caddy.items.push(itemProduct)
      //caddy.items.set(1,itemProduct);
      this.caddies. set(itemProduct.shopName,caddy);    
      console.log(this.caddies)
      this.saveCaddiesToLocalStorage()
    }
    this.addCaddyToListCaddies();
  }
  public saveCaddiesToLocalStorage(){
    localStorage.setItem("myCaddies",JSON.stringify(Array.from(this.caddies.entries())));
    //localStorage.setItem("myCaddies",JSON.stringify(this.caddies));
  }
  public getCaddiesToLocalStorage(){
    let caddies = localStorage.getItem("myCaddies");
    if(caddies){
      this.caddies = new Map(JSON.parse(caddies!))
      this.caddies.forEach(caddy=>{
        if(caddy.items.length==0){
          this.caddies.delete(caddy.name);
        }
        this.saveCaddiesToLocalStorage();
      })
    }
    //localStorage.setItem("myCaddies",JSON.stringify(Array.from(this.caddies.entries())));
    //localStorage.setItem("myCaddies",JSON.stringify(this.caddies));
  }
  public deleteProductToCaddy(itemProduct:ItemProduct){
    let caddy = this.caddies.get(this.currentCaddyName);
    //delete caddy?.items[caddy?.items.indexOf(itemProduct)];
    for(let i=caddy!.items.indexOf(itemProduct);i!<caddy!.items.length;i!++){
      caddy!.items[i] = caddy!.items[i+1]
    }
    caddy!.items.length--;
    //let caddy1 = new Map(caddy?.items.map((obj)=>[1,obj]))
    //delete(itemProduct.product.idProduct);
    this.saveCaddiesToLocalStorage();
    this.getCaddiesToLocalStorage();
    this.addCaddyToListCaddies();
    this.currentCaddy=this.caddies.get(this.currentCaddyName)
  }
  public getCaddy():Caddy{
    let caddy=this.caddies.get(this.currentCaddyName);
    if(caddy){
      this.currentCaddy=caddy;
    }
    return caddy!;
  }
  public getSize(){
    let caddy=this.caddies.get(this.currentCaddyName);
    if(caddy){
      return Object.keys(caddy.items).length;
    }
    return 0
  }
  public getTotalCurrentCaddy() {
    let caddy=this.caddies.get(this.currentCaddyName);
    let total=0;
    caddy?.items.forEach(item=>{
      if(item!=null){
        total+=item.price*item.quatity
      }
    })
    return total;
  }
  public addCaddyToListCaddies() {
    this.listCaddies=[];
    this.listCaddies.push({ mun: this.listCaddies.length, name: this.currentCaddyName });
    this.caddies.forEach(caddy=>{
      if(caddy.name!=this.currentCaddyName){
        this.listCaddies.push({ mun: this.listCaddies.length, name: caddy.name });
      }
    })
  }
  public getCurrentCaddy():Caddy|undefined{
    return this.caddies.get(this.currentCaddyName);
  }
}
