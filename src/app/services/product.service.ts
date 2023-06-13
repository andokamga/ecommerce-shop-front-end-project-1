import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlData } from '../model/urlData.modul';
import { Brand } from '../model/brand.model';
import { Category } from '../model/category.model';
import { Product } from '../model/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //public urlData:UrlData = new UrlData();
  public shopCat: Array<Category>=[];
  public shopBrand: any;
  public products:any;
  public currentShop:any;
  public currentShops:any;
  public currentPage!:number;
  public currentCat=undefined;
  public currentBrand = undefined;
  public currentProduct:any;
  public search!:string;
  public host:String= "http://localhost:8080";
  constructor(private http: HttpClient) {
    
  }
  public  getProductHome(urlData:UrlData){
    return this.http.post(this.host+"/api/products/home",urlData);
  }
  public getShopCat(idShop:any){
    return this.http.get<Array<Category>>(this.host+"/api/products/categories/"+idShop);
  }
  public getShopBrand(idShop:any){
    return this.http.get<Array<Brand>>(this.host+"/api/products/brands/"+idShop);
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
  public getOneCategory(id:number){
    return this.http.get<Category>(this.host+"/api/products/category/"+id);
  }
  public getOneBrand(id:number){
    return this.http.get<Brand>(this.host+"/api/products/brand/"+id);
  }
  public getOneProduct(id:number){
    return this.http.get<Product>(this.host+"/api/products/"+id);
  }
  public saveOneCategory(category:Category){
    return this.http.post(this.host+"/api/products/category",category);
  }
  public saveOneBrand(brand:Brand){
    return this.http.post(this.host+"/api/products/brand",brand);
  }
  public saveOneProduct(product:Product){
    return this.http.post<Product>(this.host+"/api/products",product);
  }
  public updateOneCategory(category:Category){
    return this.http.put(this.host+"/api/products/category",category);
  }
  public updateOneBrand(brand:Brand){
    return this.http.put(this.host+"/api/products/brand",brand);
  }
  public updateOneProduct(product:Product){
    return this.http.put<Product>(this.host+"/api/products/",product);
  }
  public deleteOneCategory(id:number){
    return this.http.delete(this.host+"/api/products/category/"+id);
  }
  public deleteOneBrand(id:number){
    return this.http.delete(this.host+"/api/products/brands/"+id);
  }
  public deleteOneProduct(id:number){
    return this.http.delete(this.host+"/api/products/"+id);
  }
  public saveAndUpdateImage(file:File,id:number){
    return this.http.post<File>(this.host+"/api/products/image/"+id,file);
  }
  public stoctProduct(urlData:UrlData){
    return this.http.post(this.host+"/api/products/stock",urlData);
  }
  public destoctProduct(urlData:UrlData){
    return this.http.post(this.host+"/api/products/destock",urlData);
  }
  public  uploadPhotoProduct(file: File, idProduct:number): Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', this.host+'/api/products/image/'+idProduct, formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
}
