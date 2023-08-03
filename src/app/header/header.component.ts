import { Component, OnInit,Input,Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { AuthentificationService } from '../services/authentification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserApp } from '../model/user.model';
import { ProductService } from '../services/product.service';
import { UrlData } from '../model/urlData.modul';
import { CaddyService } from '../services/caddy.service';
import { HomePageComponent } from '../home-page/home-page.component';
import { Time } from '@angular/common';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public urlData:UrlData = new UrlData();
  /*@Input()
  public currentShops:any;*/
  @Output()
  public currentShopsChange:EventEmitter<any>= new EventEmitter<any>();
  /*@Input()
  public search!:string*/
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
  public joursFinPromotion!:string;
  public intervalId!:any;
  constructor(public shopService: ShopService,
              private authService:AuthentificationService,
              public activatedRoute:ActivatedRoute,
              private router:Router,
              private productService:ProductService,
              private caddyService:CaddyService) { }
  public homePage:HomePageComponent = new HomePageComponent(this.productService,this.caddyService,
                                                            this.activatedRoute,this.shopService,
                                                            this.authService,this.router)
  ngOnInit(): void {
    this.timerPromotion()
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("bien");
    if(changes['currentCat'] && changes['currentCat'].currentValue ){
      console.log("bien");
    }else if(changes['isHome']&& changes['isHome'].currentValue){
     
      
    }else if(changes['currentShops']&& changes['currentShops'].currentValue){
      console.log("bien");
    }
  }
  onSearch(){
    this.urlData.page=0;
    this.urlData.idShop= this.currentShop.idShop;
    this.urlData.search = this.search;
    this.productService.getProductByFilter(this.urlData)
      .subscribe((data)=>{
        this.products=data;
        this.currentBrand = undefined;
        this.currentCat = undefined;
      });
      this.router.navigate([''],{queryParams:{search:this.search},
      skipLocationChange:false
    });
    console.log(this.search);
  }

  public currentSearch(){
    this.urlData.page=0;
    this.urlData.idShop= this.currentShop.idShop;
    this.urlData.search = this.search;
    console.log("bien")
    this.productService.getProductByFilter(this.urlData)
      .subscribe((data)=>{
        this.products=data;
        this.currentBrand = undefined;
        this.currentCat = undefined;
      });
      this.router.navigate([''],{queryParams:{search:this.search},
      skipLocationChange:false
    });
    console.log(this.search);
  }

  backHome(){
    console.log('bjr');
    this.homePage.changeShopPage(this.currentShop.idShop,0);
    this.router.navigate([''],{queryParams:{back:""},
    skipLocationChange:true
  });
    //this.onBackHomeShop();
    //this.router.navigate(["/e"]);
    //this.isHomeChange.emit(this.isHome+=1);
  }
  onBackHomeShop(){
    this.urlData.page=0;
    this.urlData.idShop= this.currentShop.idShop;
    this.productService.getShopProduct(this.urlData)
    .subscribe((data)=>{
      this.currentBrand = undefined;
      this.currentCat = undefined;
      this.search = '';
      this.products=data;
      this.currentPage = this.products.number;
      //this.totalPages = this.products.totalPages;
      //this.pages = new Array(this.totalPages);
      console.log(data); 
    });
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
  onGreting(){
    var dAujourdhui = new Date()
    if(dAujourdhui.getHours()>12){
      return 'Afternoon'
    }else{
      return 'Morning'
    }
  }
  timerPromotion(){
    var first = '02/24/2020';
    var second = 'January 10, 2022';
    let currentDate = new Date();
    let dateSent = new Date(second);
    let dat = new Date(Date.UTC(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDate(),currentDate.getHours(),currentDate.getMinutes(),currentDate.getSeconds())- Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()));
    let sec = dat.getSeconds();
    let min = dat.getMinutes();
    let heu = dat.getHours();
    let jou = dat.getDate();
    this.intervalId=setInterval(()=>{
      this.joursFinPromotion = jou + 'J, ' + heu + ' : ' + min + ' : ' + sec;
      if(jou!=0||heu!=0||min!=0||sec!=0){
        sec -= 1;
        if(sec == 0){sec = 60; min -= 1;}
        if(min ==0){min = 60; heu -= 1;}
        if(heu ==0){heu = 24; jou -= 1;} 
      }else{
        this.stopTimer();
      }
  }, 1000);
  }
  stopTimer(){
    clearInterval(this.intervalId);
  }
  onGetProduct(shop:any){
    //this.currentShops=shop;
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
  public set products(products:any){
    this.productService.products=products;
  }
  public get products():any{
    return this.productService.products; 
  }
  public get currentShop():any{
    return this.productService.currentShop; 
  }
  public set currentShop(currentShop:any){
    this.productService.currentShop=currentShop;
  } 
  public get currentPage():any{
    return this.productService.currentPage; 
  }
  public set currentPage(currentPage:any){
    this.productService.currentPage=currentPage;
  } 
  public get currentCat():any{
    return this.productService.currentCat; 
  }
  public set currentCat(currentCat:any){
    this.productService.currentCat=currentCat;
  } 
  public get currentBrand():any{
    return this.productService.currentBrand; 
  }
  public set currentBrand(currentBrand:any){
    this.productService.currentBrand=currentBrand;
  } 
  public get search():any{
    return this.productService.search; 
  }
  public set search(search:any){
    this.productService.search=search;
  } 
  public get currentShops():any{
    return this.productService.currentShops; 
  }
  public get currentCaddyName(){
    return this.caddyService.currentCaddyName;
  }
  public get currentSize(){
    return this.caddyService.getSize();
  }
  public get progressBar(){
    return this.productService.progressBar;
  } 
  public get isLoading():any{
    return this.productService.isLoadingP; 
  }
}
