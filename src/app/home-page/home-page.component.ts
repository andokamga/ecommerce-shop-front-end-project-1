import { Component, OnInit, Input,OnChanges, SimpleChanges,Output,EventEmitter } from '@angular/core';
import { ProductService } from '../services/product.service';
import { UrlData } from '../model/urlData.modul';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CaddyService } from '../services/caddy.service';
import { Product } from '../model/product.model';
import { ItemProduct } from '../model/itemproduct.model';
import { AuthentificationService } from '../services/authentification.service';
import { Menu } from '../model/menu.model';
import { ShopService } from '../services/shop.service';
import { Town } from '../model/town.model';
import { Category } from '../model/category.model';
import { Shop } from '../model/shop.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges {
  public urlData:UrlData = new UrlData();
  /*@Input()
  public search!:string;*/
  @Output()
  public searchChange:EventEmitter<any>= new EventEmitter<any>();
  @Input()
  public isHome!:number;
  /*@Input()
  public currentShops!:any;
  @Output()*/
  public currentShopsChange:EventEmitter<any>= new EventEmitter<any>();
  public disable:boolean=true
  //public products:any;
  //public shopCat: Array<Category>=[];
  //public shopBrand: any;
  public pageSize!: number;
  public isAuthentificated:boolean=this.authService.isAuthetificated();
  /*public currentPage!:number;
  public currentCat=undefined;
  public currentBrand = undefined;*/
  //public currentShop!: number;
  public pages:Array<number>=[];
  public totalPages!:number;
  public collapseValue:any;
  public menu:Array<Menu>=[
    {
      id:6,
      title:"Towns",
      icon:"fa fa-bank",
      sousMenu:[]
    },
    {
      id:7,
      title:"Categories",
      icon:"fa fa-hourglass-1",
      sousMenu:[]
    },
    {
      id:8,
      title:"Brands",
      icon:"fa fa-leaf",
      sousMenu:[]
    }
  ];
  constructor(public productService: ProductService,
              private caddyService:CaddyService,
              public activatedRoute:ActivatedRoute,
              public shopService: ShopService,
              private authService:AuthentificationService,
              public router:Router) { }
  ngOnInit(): void {
    if(this.activatedRoute.snapshot.queryParamMap.get("search")!=undefined){
      this.onSearchProduct(this.search,0);
      this.getShopCat();
      this.getShopBrand();
    }else if(this.activatedRoute.snapshot.queryParamMap.get("back")!=undefined) {
      this.changeShopPage(this.currentShop.idShop,0);
    }else{
      try {
        this.homeShopProduct();
      } catch (err) {
        console.log(err);
      }
    }
    this.initMenuShop();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.progressBar = 0;
    }, 3000);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("dificile")
    if(changes['search'] && changes['search'].currentValue ){
      console.log('change:',this.search);
      console.log(this.currentShop);
      console.log(this.search);
      this.onSearchProduct(this.search,0);
    }else if(changes['isHome']&& changes['isHome'].currentValue){
      this.search="";
      this.searchChange.emit(this.search);
      console.log("fin")
      this.onBackHomeShop();
    }else if(changes['currentShops']&& changes['currentShops'].currentValue){
      this.search="";
      this.searchChange.emit(this.search);
      this.onChangeShop(this.currentShop.idShop,0);
    }
  }
  onSearchProduct(search:string,page:number){
      this.isLoadingP=true;
      this.urlData.page=page;
      this.urlData.idShop= this.currentShop.idShop;
      this.urlData.search = search;
      this.productService.getProductByFilter(this.urlData)
      .subscribe((data)=>{
        this.currentBrand = undefined;
        this.currentCat = undefined;
        this.products=data;
        this.currentPage = this.products.number;
        this.totalPages = this.products.totalPages;
        this.pages = new Array(this.totalPages);
      });
  }
  /*homeShopProduct(){
    this.productService.getProductHome(this.urlData)
        .subscribe((data)=>{
          this.products = data;
          console.log(data);
          this.currentShop = this.products.content[0].shop;
          //this.currentShops = this.products.content[0].shop;
          this.currentShopsChange.emit(this.currentShops);
          this.pageSize= this.products.numberOfElements;
          this.currentPage = this.products.number;
          this.totalPages = this.products.totalPages;
          this.pages = new Array(this.totalPages);
          this.getShopCat();
    this.getShopBrand();
   });
  }*/
  homeShopProduct(){
    this.progressBar=0;
    this.productService.getProductHome(this.urlData).subscribe({
      next: (event)=>{
        if (event.type == HttpEventType.UploadProgress) {
          this.progressBar = Math.round(100 * event.loaded / event.total!);
        } else if (event instanceof HttpResponse) {
          //console.log(this.router.url);
          //this.getProducts(this.currentRequest);
          //this.refreshUpdatedProduct();
          //this.currentTime=Date.now();
        }
        if (event.type == HttpEventType.Response) {
          const responseData = event.body;
          this.products=responseData;
          console.log(responseData)
          this.currentShop = this.products.content[0].shop;
          //this.currentShops = this.products.content[0].shop;
          this.currentShopsChange.emit(this.currentShops);
          this.pageSize= this.products.numberOfElements;
          this.currentPage = this.products.number;
          this.totalPages = this.products.totalPages;
          this.pages = new Array(this.totalPages);
          this.getShopCat();
          this.getShopBrand();
        }
      },
      error: (err)=>{
        
      }     
   });
   this.progressBar=0
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
      this.totalPages = this.products.totalPages;
      this.pages = new Array(this.totalPages);
      console.log(data); 
    });
  }
  onChangeShop(shop:any,page:number){
    this.isLoadingP=true;
    this.urlData.idShop= shop.idShop;
    this.urlData.page=page;
      this.productService.getShopProduct(this.urlData)
        .subscribe((data)=>{
          setTimeout(() => {
            this.isLoadingP=false;
          }, 2000);
          this.currentShop = shop;
          //this.currentShop = this.currentShops.idShop;
          this.currentBrand = undefined;
          this.currentCat = undefined;
          this.search = '';
          this.products = data;
          this.currentPage = this.products.number;
          console.log(data);
          this.totalPages = this.products.totalPages;
          this.pages = new Array(this.totalPages);
          this.productService.getShopCat(this.currentShops.idShop)
          .subscribe((data)=>{
            this.shopCat = data;
            console.log(data);  
        });
        this.productService.getShopBrand(this.currentShop.idShop)
        .subscribe((data)=>{
          this.shopBrand = data;
          console.log(data);  
      });
      });
  }
  getShopCat(){
    this.productService.getShopCat(this.currentShop.idShop)
    .subscribe((data)=>{
      this.shopCat = data;
      data.forEach(cat=>{
        if(cat!=undefined){
          this.menu[1].sousMenu?.push({
            id:cat.idCategory,
            title:cat.categoryName,
          })
        }
      })
      console.log(data);  
  });
  }
  getShopBrand(){
    this.productService.getShopBrand(this.currentShop.idShop)
    .subscribe((data)=>{
      this.shopBrand = data;
      data.forEach(brand=>{
        if(brand!=undefined){
          this.menu[2].sousMenu?.push({
            id:brand.idBrand,
            title:brand.brandName,
          })
        }
      })
      console.log(data);  
  });
  }
  navigateById(title:String,id:number){
    if(title=="Categories"){
      this.onGetProductByCategory(this.currentShop.idShop,id,0);
      this.collapseValue="Categories"+this.currentCat
    }else if(title=="Brands"){
      this.onGetProductByBrand(this.currentShop.idShop,id,0);
      this.collapseValue="Brands"+this.currentBrand
    }else{
      this.shopService.getShopOfTown(id).subscribe((data)=>{
        this.currentShops = data.shops;
        this.collapseValue="Towns"+id;
        console.log(data)
      })
    }
  }
  changeShopPage(idShop:number,page:number){
    this.isLoadingP=true;
    this.urlData.idShop= idShop;
    this.urlData.page=page;
    
      this.productService.getShopProduct(this.urlData)
        .subscribe((data)=>{
          setTimeout(() => {
            this.isLoadingP=false;
          }, 2000);
          this.currentBrand = undefined;
          this.currentCat = undefined;
          this.search = '';
          this.products = data;
          this.currentPage = this.products.number;
          console.log(data);
          this.totalPages = this.products.totalPages;
          this.pages = new Array(this.totalPages);
      });
  }
  onGetProductByCategory(idShop:any,idCategory:any,page:number){
    this.isLoadingP=true;
    this.urlData.page = page;
    this.urlData.idShop=idShop;
    this.urlData.idCat=idCategory;
    this.currentCat=idCategory;
    this.currentBrand = undefined;
    this.search = '';
    this.currentPage=0;
    this.urlData.page=this.currentPage
    this.search="";
    this.searchChange.emit(this.search);
    this.productService.getProductByCategory(this.urlData)
        .subscribe((data)=>{
          this.products=data;
          this.currentPage = this.products.number;
          this.totalPages = this.products.totalPages;
          this.pages = new Array(this.totalPages);
          setTimeout(() => {
            this.isLoadingP=false;
          }, 2000);
          console.log(data); 
        });
  }
  onGetProductByBrand(idShop:any,idBrand:any,page:number){
    this.isLoadingP=true;
    this.urlData.page = page;
    this.urlData.idShop=idShop;
    this.urlData.idCat=idBrand;
    this.currentCat = undefined;
    this.search = '';
    this.currentBrand=idBrand;
    this.currentPage=0;
    this.search="";
    this.searchChange.emit(this.search);
    this.productService.getProductByBrand(this.urlData)
        .subscribe((data)=>{
          setTimeout(() => {
            this.isLoadingP=false;
          }, 2000);
          this.products=data;
          this.currentPage = this.products.number;
          this.totalPages = this.products.totalPages;
          this.pages = new Array(this.totalPages);
          console.log(data); 
        });
  }
  onGoToPage(i:number){
    console.log(i); 
    this.urlData.page=this.currentPage;
    if(this.search){
      this.onSearchProduct(this.search,i);
    }else if(this.currentCat!=undefined){
      this.onGetProductByCategory(this.currentShop.idShop,this.currentCat,i);
    }else if(this.currentBrand!=undefined){
      this.onGetProductByBrand(this.currentShop.idShop,this.currentBrand,i);
    }else{
      this.changeShopPage(this.currentShop.idShop,i);
    }
    
  }
  public onProductDetails(product:any) {
    this.currentProduct=product;
    this.router.navigateByUrl("/detail");
    /*this.router.navigate(['detail'],{queryParams:{id:id},
      skipLocationChange:false
    });*/
  }
  public onAddProductToCaddy(p:Product) {
    let itemProduct:ItemProduct = new ItemProduct();
    itemProduct.product = p;
    itemProduct.shopName=this.currentShop.shopName;
    itemProduct.quatity=p.quantity;
    this.caddyService.addProductToCaddy(itemProduct);
  }
  public initMenuShop(){
    
    console.log(this.shopCat)
    this.shopService.getAllTown()
    .subscribe((data)=>{
      data.forEach(town=>{
        if(town!=undefined){
          this.menu[0].sousMenu?.push({
            id:town.idTown,
            title:town.townName,
          })
        }
      })
      console.log(data); 
    });
    /*this.shopService.getAllTown().
    .forEach(town=>{
      if(town!=undefined){
        this.menu.sousMenu![i]={
          id:town.,
          title:"aime",
        }
       i++
      }
    })*/
    
  }
  public get products():any{
    return this.productService.products; 
  }
  public set products(products:any){
    this.productService.products=products;
  } 
  public get currentShop():any{
    return this.productService.currentShop; 
  }
  public set currentShop(currentShop:any){
    this.productService.currentShop=currentShop;
    this.caddyService.currentShop=currentShop;
    this.caddyService.currentCaddyName=currentShop.shopName;
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
  public set currentShops(currentShops:any){
    this.productService.currentShops=currentShops;
    //this.caddyService.currentShop=currentShops;
    //this.caddyService.currentCaddyName=currentShops.shopName;
    console.log(currentShops.shopName)
  } 
  public set currentProduct(product:any){
    this.productService.currentProduct=product;
  }
  public get shopCat():any{
    return this.productService.shopCat; 
  }
  public set shopCat(shopCat:any){
    this.productService.shopCat=shopCat;
  } 
  public get shopBrand():any{
    return this.productService.shopBrand; 
  }
  public set shopBrand(shopBrand:any){
    this.productService.shopBrand=shopBrand;
  } 
  public set progressBar(progress:number){
    this.productService.progressBar=progress;
  } 
  public set isLoadingP(isLoading:boolean){
    this.productService.isLoadingP=isLoading;
  } 
  public get isLoadingP():any{
    return this.productService.isLoadingP; 
  }
}
