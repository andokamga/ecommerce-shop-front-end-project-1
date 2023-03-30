import { Component, OnInit, Input,OnChanges, SimpleChanges } from '@angular/core';
import { ProductService } from '../services/product.service';
import { UrlData } from '../model/urlData.modul';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges {
  public urlData:UrlData = new UrlData();
  @Input()
  public search:string='';
  @Input()
  public isHome!:number;
  @Input()
  public currentShops!:any;
  public disable:boolean=true
  public products:any;
  public shopCat: any;
  public shopBrand: any;
  public pageSize!: number;
  public currentPage!:number;
  public currentCat=undefined;
  public currentBrand = undefined;
  public currentShop!: number;
  public pages:Array<number>=[];
  public totalPages!:number;
  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    try {
      this.homeShopProduct();
    } catch (err) {
      console.log(err);
    }
  
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['search'] && changes['search'].currentValue ){
      console.log('change:',this.search);
      console.log(this.currentShop);
      console.log(this.search);
      this.onSearchProduct(this.search,0);
    }else if(changes['isHome']&& changes['isHome'].currentValue){
      this.onBackHomeShop();
    }else if(changes['currentShops']&& changes['currentShops'].currentValue){
      this.onChangeShop(this.currentShops.idShop,0);
    }
  }
  onSearchProduct(search:string,page:number){
      this.urlData.page=page;
      this.urlData.idShop= this.currentShop;
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
  homeShopProduct(){
    this.productService.getProductHome(this.urlData)
        .subscribe((data)=>{
          this.products = data;
          console.log(data);
          this.currentShop = this.products.content[0].shop.idShop;
          this.pageSize= this.products.numberOfElements;
          this.currentPage = this.products.number;
          this.totalPages = this.products.totalPages;
          this.pages = new Array(this.totalPages);
          this.productService.getShopCat(this.products.content[0].shop.idShop)
          .subscribe((data)=>{
            this.shopCat = data;
            console.log(data);  
        });
        this.productService.getShopBrand(this.products.content[0].shop.idShop)
        .subscribe((data)=>{
          this.shopBrand = data;
          console.log(data);  
      });
   });
  }
  onBackHomeShop(){
    this.urlData.page=0;
    this.urlData.idShop= this.currentShop;
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
  onChangeShop(idShop:number,page:number){
    this.urlData.idShop= idShop;
    this.urlData.page=page;
      this.productService.getShopProduct(this.urlData)
        .subscribe((data)=>{
          this.currentShop = this.currentShops.idShop;
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
        this.productService.getShopBrand(this.currentShops.idShop)
        .subscribe((data)=>{
          this.shopBrand = data;
          console.log(data);  
      });
      });
  }
  changeShopPage(idShop:number,page:number){
    this.urlData.idShop= idShop;
    this.urlData.page=page;
      this.productService.getShopProduct(this.urlData)
        .subscribe((data)=>{
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
    this.urlData.page = page;
    this.urlData.idShop=idShop;
    this.urlData.idCat=idCategory;
    this.currentCat=idCategory;
    this.currentBrand = undefined;
    this.search = '';
    this.currentPage=0;
    this.urlData.page=this.currentPage
    this.productService.getProductByCategory(this.urlData)
        .subscribe((data)=>{
          this.products=data;
          this.currentPage = this.products.number;
          this.totalPages = this.products.totalPages;
          this.pages = new Array(this.totalPages);
          console.log(data); 
        });
  }
  onGetProductByBrand(idShop:any,idBrand:any,page:number){
    this.urlData.page = page;
    this.urlData.idShop=idShop;
    this.urlData.idCat=idBrand;
    this.currentCat = undefined;
    this.search = '';
    this.currentBrand=idBrand;
    this.currentPage=0;
    this.productService.getProductByBrand(this.urlData)
        .subscribe((data)=>{
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
      this.onGetProductByCategory(this.currentShop,this.currentCat,i);
    }else if(this.currentBrand!=undefined){
      this.onGetProductByBrand(this.currentShop,this.currentBrand,i);
    }else{
      this.changeShopPage(this.currentShop,i);
    }
    
  }

}
