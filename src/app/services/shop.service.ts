import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  public host:String= "http://localhost:8080";
  constructor(private http: HttpClient) { }
  public getAllTown(){
    return this.http.get(this.host+"/api/shops/towns");
  }

}
