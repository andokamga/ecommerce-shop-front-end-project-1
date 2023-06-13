import { Component, OnInit, VERSION  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaddyService } from '../services/caddy.service';
import { AuthentificationService } from '../services/authentification.service';
import { OrderService } from '../services/order.service';
import { Client } from '../model/client.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';  
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; 
import { Column, Content, Margins, StyleDictionary } from 'pdfmake/interfaces';
import { PageSize } from 'pdfmake/interfaces';
import { PageOrientation } from 'pdfmake/interfaces';
import { ProductService } from '../services/product.service';
import { UrlData } from '../model/urlData.modul';
import { Order } from '../model/order.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public mode:number=0;
  public totalPages!:number;
  public pageSize!: number;
  public currentPage!: number;
  public resultData:Array<{date:string,orders:Array<Order>,checked:boolean}>=[];
  panelStyle:string= "panel-default";
  clientFormGroup!: FormGroup;
  errorMessage!: string;
  stetusMessage!:string;
  stetusAnswer!:string;
  infoBill!:any
  item!:any
  checkIFBoxChecke:boolean=false
  shopOrder:Array<Order>=[];
  selectedOrders:Order[]=[];
  constructor(private router:Router,
              private fb: FormBuilder,
              public productService: ProductService,
              public caddyService:CaddyService,
              public activatedRoute:ActivatedRoute,  
              private authService:AuthentificationService,
              public orderService:OrderService,) { }

ngOnInit() {
  if(!this.authService.isAuthetificated()){
    this.router.navigateByUrl('/login');
  }
  if(this.caddyService.getCurrentCaddy()?.client!=undefined){
    let client = this.caddyService.getCurrentCaddy()?.client;
    this.clientFormGroup = this.fb.group({
      name: this.fb.control(client!.name),
      address: this.fb.control(client!.address),
      phoneNumber: this.fb.control(client!.phoneNumber),
      email: this.fb.control(client!.email)
    }
    );
  }else{
    this.clientFormGroup = this.fb.group({
      name: this.fb.control(""),
      address: this.fb.control(""),
      phoneNumber: this.fb.control(""),
      email: this.fb.control("")
    }
    );
  }
  if(this.activatedRoute.snapshot.queryParamMap.get("mode")!=undefined){
    this.mode=3;
    
  }
  this.getShopOrder(0);
}
public onSaveClient() {
  let client=new Client();
  client.name = this.clientFormGroup.value.name;
  client.address = this.clientFormGroup.value.address;
  client.phoneNumber = this.clientFormGroup.value.phoneNumber;
  client.email = this.clientFormGroup.value.email;
  this.orderService.setClient(client);
  //this.caddyService.setClient(client);
  this.orderService.loadProductsFromCaddy();
  this.mode=1;
}
public onOrder() {
  this.orderService.submitOrder().subscribe (data=>{
    //this.orderService.order.idOrde=data.content[1];
    this.panelStyle="panel-success";
  }/*,err=>{
    console.log(err);
  }*/);
}

onPayOrder() {
  this.router.navigateByUrl("/payment/"+this.orderService.order.idOrde);
}
public getPrintOrder(id:number){
  this.orderService.infoBill(id).subscribe({
    next:(bill)=>{
     this.infoBill=bill;
     this.infoBill
     localStorage.setItem("infoBill",JSON.stringify(bill));
     console.log(this.infoBill.orde.itemProducts);
     this.onPrintOrder(this.infoBill.orde.itemProducts);
    },
    error:(err)=>{
      this.stetusMessage="bad credantials"
      this.stetusAnswer="alert-danger"
      this.errorMessage = err.error.message || err.error || err.message;;
      console.log(this.errorMessage)
    }
  })
}
onPrintOrder(item:[]){
  
  const document=this.getDocumentDefinition(item);
  
  pdfMake.createPdf(document).open();
  
  
}
getDocumentDefinition(item:[]) {
  return {
    pageSize: 'A5' as PageSize,
    /*pageSize: {
      width: 595.28,
      height: 300
    }as PageSize,*/
    pageOrientation: 'landscape' as PageOrientation,
    pageMargins: [ 20, 20, 20, 20 ] as Margins,
    watermark: { text: 'kamga shop', color: 'blue', opacity: 0.1, bold: true, italics: false },
    footer: function(currentPage:number, pageCount:number) {  return {
      table: {
        body: [
          [
            { text: "Page  " + currentPage.toString() + " of " + pageCount, alignment: 'center',margin:[250,0,0,0]},
           
          ]
        ]
      },
      layout:'noBorders'
    };
  },
    content: [
    { 
      columns: [[{
        
        text: 'Code: '+this.infoBill.code,
      
      }, 
      {
        
        
        text: 'Client name: '+this.infoBill.orde.name,
      }, 
      {
        
        text: 'Shop: '+this.infoBill.town+' '+this.infoBill.shop,
      }, 
      {
       
        text: 'Date order: '+this.infoBill.orde.orderDate,
      }]as Column] ,
    },
    {
      text:'List of item',
      bold:true,
      fontSize:20,
      alignment: 'center',
      margin:[0,0,0,20]
    },
    this.getOrderItem(item),
    {
      text:'Totaux pay: '+this.infoBill.orde.orderPrice+' fafa',
      bold:true,
      fontSize:12,
      alignment: 'center',
      margin:[0,10,0,0]
    },
    {
      text:'signature:..',
      style:'sign',
    }
  ] as Content,
    
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 20, 0, 10],
        decoration: 'underline'
      },
      name: {
        fontSize: 16,
        bold: true
      },
      jobTitle: {
        fontSize: 14,
        bold: true,
        italics: true
      },
      sign: {
        margin: [0, 10, 50, 10],
        alignment: 'right',
        italics: true
      },
      tableHeader: {
        bold: true,
      }
    } as StyleDictionary
  };
}
Header(){
  return{

  }
}
public getOrderItem(item:[]){
  return{
    table:{
      widths:['*','*','*','*','*'],
      body:[
      [
        {
          text:'no',
          style:'tableHeader'
        },
        {
          text:'Name',
          style:'tableHeader'
        },
        {
          text:'price',
          style:'tableHeader'
        },
        {
          text:'Quantity',
          style:'tableHeader'
        },
        {
          text:'price*Quantity',
          style:'tableHeader'
        }
      ],
      ...item.map(item=>{
        this.item=item;
        console.log(this.item)
        return[this.item.idItemProduct,this.item.product.productName,this.item.product.productPrice+' Fcfa',this.item.quatity,this.item.quatity*this.item.product.productPrice+' Fcfa'];
      })
    ]

    },
    layout: {
      fillColor: function (rowIndex:number, node:number, columnIndex:number) {
          if(rowIndex==0){
            return '#87CEEB';
          }
          return (rowIndex % 2 == 0 && rowIndex!=0) ? '#CCCCCC' : null;
      }
  }
  }
}
public getShopOrder(page:number){
  let  urlData= new UrlData()
  urlData.idShop=this.currentShop.idShop;
  urlData.size=10;
  urlData.page=page;
  urlData.idUser=this.authService.authentificatedUser?.idUserApp;
  this.orderService.getShopOrder(urlData).subscribe({
    next:(order)=>{
      this.shopOrder = order.content;
      this.currentPage = order.number+1;
      this.pageSize = order.size;
      this.totalPages = order.totalElements;
      this.groupOrderByDate();
      console.log(order.content)
      console.log(order.size)
    },
    error:(err)=>{
      this.stetusMessage="bad credantials"
      this.stetusAnswer="alert-danger"
      this.errorMessage = err.error.message || err.error || err.message;;
      console.log(this.errorMessage)
    }
  })
}
public onDeleteOrder(id:number){
  this.orderService.deleteOrder(id).subscribe({
    next:(res)=>{
      this.getShopOrder(this.currentPage);
      this.stetusMessage="the order was delete successfully"
      this.stetusAnswer="alert-success"
    },
    error:(err)=>{
      this.stetusMessage="the order wasn't delete"
      this.stetusAnswer="alert-danger"
      this.errorMessage = err.error.message || err.error || err.message;;
      console.log(this.errorMessage)
    }
  })
}
public groupOrderByDate(){
  this.resultData=[];
  let data = new Set(this.shopOrder.map(i =>i.orderDate));
  data.forEach((date)=>{
    this.resultData.push({
      date:date, 
      orders: this.shopOrder.filter(i => i.orderDate == date),
      checked:false
    })
  })
  console.log(this.resultData)
}
public onChange(event:any,date:string){
  this.checkIFBoxChecke=false;
  this.resultData.filter(i=>i.date==date).map(orders=>{
    let hasEmpty:boolean=false;
    orders.orders.forEach(order=>{
      let empty:boolean=true;
      if(order.checked==false||order.checked==undefined){
        orders.checked=false;
        hasEmpty=true;
      };
    })
    if(!hasEmpty){
      orders.checked=true;
    }
  });
  this.shopOrder.forEach(order=>{
    if(order.checked==true){
      this.checkIFBoxChecke=true;
    }
  })
  console.log(this.resultData);
}
public checkAllCheckBox(event:any,date:string){
  this.checkIFBoxChecke=false;
  this.shopOrder.filter(i => i.orderDate == date).forEach(order=>{
    order.checked=event.target.checked;
  });
  this.shopOrder.forEach(order=>{
    if(order.checked==true){
      this.checkIFBoxChecke=true;
    }
  })
}
public deleteAllSeleterOrder(){
  this.selectedOrders = this.shopOrder.filter(i => i.checked == true);
  console.log(this.selectedOrders);
}
public get currentShop():any{
  return this.productService.currentShop; 
}
public handlePageChange(event: number){
  this.shopOrder=[];
  this.getShopOrder(event-1);
}
}
