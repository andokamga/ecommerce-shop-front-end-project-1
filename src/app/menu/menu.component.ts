import { Component, OnInit } from '@angular/core';
import { Menu } from '../model/menu.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public menu:Array<Menu> =[{
    id:1,
    title:"Shop Products",
    icon:"fa fa-shopping-basket",
    url:"",
    sousMenu:[
      {
        id:11,
        title:"All products",
        icon:"fa fa-shopping-bag",
        url:"e",
      },
      {
        id:12,
        title:"Category",
        icon:"fa fa-ship",
        url:"",
      },
      {
        id:13,
        title:"Brands",
        icon:"fa fa-ship",
        url:"",
      }
    ],
  },
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
        url:"",
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
        url:"",
      },
      {
        id:32,
        title:"Role management",
        icon:"fa fa-street-view",
        url:"",
      }
    ]
  },
  {
    id:4,
    title:"Shop",
    icon:"fa fa-university",
    url:"",
    sousMenu:[
      {
        id:41,
        title:" Town management",
        icon:"fa fa-globe",
        url:"",
      },
      {
        id:42,
        title:"Shop management",
        icon:"fa fa-cog",
        url:"",
      },
      {
        id:43,
        title:" categories management",
        icon:"fa fa-asl-interpreting",
        url:"",
      },
      {
        id:44,
        title:"brands management",
        icon:"fa fa-asl-interpreting",
        url:"",
      }
    ]
  },
  {
  id:5,
  title:"Dashboard",
  icon:"fa fa-dashboard",
  url:"",
  sousMenu:[
    {
      id:51,
      title:"Overview",
      icon:"fa fa-low-vision",
      url:"",
    },
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
      url:"",
    },
    {
      id:54,
      title:"order management",
      icon:"fa fa-truck",
      url:"",
    }
  ]
}]
  constructor(private router:Router) { }

  ngOnInit(): void {
  }
public navigateByUrl(url:any){
  this.router.navigateByUrl(url);
  console.log(url)
}

}
