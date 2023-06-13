import { Component, OnInit } from '@angular/core';
import { Caddy } from '../model/caddy.model';
import { CaddyService } from '../services/caddy.service';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { ItemProduct } from '../model/itemproduct.model';

@Component({
  selector: 'app-caddy',
  templateUrl: './caddy.component.html',
  styleUrls: ['./caddy.component.css']
})
export class CaddyComponent implements OnInit {

  //public currentCaddy!:Caddy|undefined;
  public isAuthentificated:boolean=this.authService.isAuthetificated();

  constructor(private router:Router,
              public caddyService:CaddyService, private authService:AuthentificationService) { }
  
  ngOnInit() {
   this.currentCaddy! = this.caddyService.getCurrentCaddy();
  }



  public onRemoveProductFromCaddy(p: ItemProduct) {
    this.caddyService.deleteProductToCaddy(p);
  }

  public getTotal() {
      return this.caddyService.getTotalCurrentCaddy();
  }

  public onNewOrder() {
    this.router.navigateByUrl("/order");
  }

  public onSelectCaddy(name:string) {
    this.currentCaddyName = name;
    this.currentCaddy=this.caddyService.getCaddy();
  }
  public set currentCaddy(caddy:Caddy){
    this.caddyService.currentCaddy=caddy
  }
  public get currentCaddy():any{
    return this.caddyService.currentCaddy;
  }
  public set currentCaddyName(name:string){
    this.caddyService.currentCaddyName=name;
  }

}


