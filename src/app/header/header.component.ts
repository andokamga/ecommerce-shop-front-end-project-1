import { Component, OnInit,Input,Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { UserApp } from '../model/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input()
  public currentShops:any;
  @Output()
  public currentShopsChange:EventEmitter<any>= new EventEmitter<any>();
  @Input()
  public search!:string
  @Output()
  public searchChange:EventEmitter<any>= new EventEmitter<any>();
  @Input()
  public isHome:number=0;
  @Output()
  public isHomeChange:EventEmitter<number>= new EventEmitter<number>();
  public fromSearch!:string;
  public town:any
  public isSearch:number=0;
  public shops:any
  public userApp: UserApp | undefined;
  constructor(public shopService: ShopService,
              private authService:AuthentificationService,
              private router:Router) { }
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("bien");
    if(changes['search'] && changes['search'].currentValue ){
   
    }else if(changes['isHome']&& changes['isHome'].currentValue){
      
    }else if(changes['currentShops']&& changes['currentShops'].currentValue){
    
    }
  }
  onSearch(){
    this.fromSearch=this.search;
    this.searchChange.emit(this.fromSearch)
    console.log(this.search);
  }
  backHome(){
    console.log('bjr');
    this.isHomeChange.emit(this.isHome+=1);
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
    this.currentShopsChange.emit(this.currentShops)
  }
  public handLogout(){
    this.authService.logout().subscribe({
      next:(data=>{
        this.router.navigateByUrl("/login");
      })
    });
  }
  public get isAuthetificated(): boolean{
    if(this.authService.isAuthetificated()){
      this.userApp = this.authService.authentificatedUser;
    }
    return this.authService.isAuthetificated();
  } 
}
