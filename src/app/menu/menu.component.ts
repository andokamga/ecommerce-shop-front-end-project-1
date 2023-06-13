import { Component, OnInit } from '@angular/core';
import { Menu } from '../model/menu.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { ProductService } from '../services/product.service';
import { CaddyService } from '../services/caddy.service';
import { AuthentificationService } from '../services/authentification.service';
import { HomePageComponent } from '../home-page/home-page.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public currentSousMenu!: number
  public menu:Array<Menu> =[
  {
    id:2,
    title:"Order",
    icon:"fa fa-truck",
    url:"",
    sousMenu:[
      {
        id:21,
        title:" order vue",
        icon:"fa fa-low-vision",
        url:"order",
      }
    ]
  }
]
public menu2:Array<Menu> =[{
  
    id:3,
    title:"User app",
    icon:"fa fa-user",
    url:"",
    sousMenu:[
      {
        id:31,
        title:" user management",
        icon:"fa fa-users",
        url:"users",
      },
      {
        id:32,
        title:"Role management",
        icon:"fa fa-street-view",
        url:"users",
      }
    ]
  },
  {
    id:4,
    title:"Shop",
    icon:"fa fa-shopping-basket",
    url:"",
    sousMenu:[
      {
        id:41,
        title:" Town management",
        icon:"fa fa-globe",
        url:"shops",
      },
      {
        id:42,
        title:"Shop management",
        icon:"fa fa-cog",
        url:"shops",
      },
      {
        id:43,
        title:" categories management",
        icon:"fa fa-asl-interpreting",
        url:"categories",
      },
      {
        id:44,
        title:"brands management",
        icon:"fa fa-asl-interpreting",
        url:"categories",
      }
    ]
  },
  {
  id:5,
  title:"Dashboard",
  icon:"fa fa-dashboard",
  url:"",
  sousMenu:[
    /*{
      id:51,
      title:"Overview",
      icon:"fa fa-low-vision",
      url:"",
    },*/
    {
      id:52,
      title:"Statistics",
      icon:"fa fa-bar-chart-o",
      url:"",
    },
    {
      id:53,
      title:"Products management",
      icon:"fa fa-gears",
      url:"products",
    },
    {
      id:54,
      title:"order management",
      icon:"fa fa-truck",
      url:"order",
    }
  ]
}];


public homePage:HomePageComponent = new HomePageComponent(this.productService,this.caddyService,
                                                          this.activatedRoute,this.shopService,
                                                          this.authService,this.router)

  public menu3:Array<Menu>=[{
      id:this.homePage.menu[0].id,
      title:this.homePage.menu[0].title,
      icon:this.homePage.menu[0].icon,
      sousMenu:this.homePage.menu[0].sousMenu
  },
  {
      id:this.homePage.menu[1].id,
      title:this.homePage.menu[1].title,
      icon:this.homePage.menu[1].icon,
      sousMenu:this.homePage.menu[1].sousMenu
  }];
 

  constructor(public productService: ProductService,
              private caddyService:CaddyService,
              public activatedRoute:ActivatedRoute,
              public shopService: ShopService,
              private authService:AuthentificationService,
              public router:Router) { }

  ngOnInit(): void { 
    this.homePage.initMenuShop();
    this.homePage.homeShopProduct();
    //this.initMenuShop();
  }
  /*public initMenuShop(){

    this.shopService.getAllTown()
    .subscribe((data)=>{
      data.forEach(town=>{
        if(town!=undefined){
          this.menu3[0].sousMenu?.push({
            id:town.idTown,
            title:town.townName,
          })
        }
      })
      console.log(data); 
    });
  }*/
 public navigateById(title:String,id:number){
  this.homePage.navigateById(title,id);
 }
 public navigateByUrl(url:any,id:number){
  this.currentSousMenu = id;
  if(url=="order"){
    this.router.navigate(['order'],{queryParams:{mode:"3"},
    skipLocationChange:true
    });
  }else{
    this.router.navigateByUrl(url);
   console.log(url)
  }
 }

}
