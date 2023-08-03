import { Component, OnInit } from '@angular/core';
import { HomePageComponent } from '../home-page/home-page.component';
import { ProductService } from '../services/product.service';
import { CaddyService } from '../services/caddy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { AuthentificationService } from '../services/authentification.service';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import { Product } from '../model/product.model';
import { Category } from '../model/category.model';
import { Brand } from '../model/brand.model';
import { UrlData } from '../model/urlData.modul';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  public mode:number=0;
  productFormGroup!: FormGroup;
  stockFormGroup!: FormGroup;
  destockFormGroup!: FormGroup;
  errorMessage!: string ;
  public addPhoto:boolean=false;
  public progress!:number;
  public imageLink:any="assets/images/product.png"
  public currentUploadFile!:any;
  public selectedFile:any 
  public currentTime:any;
  public currentProduct:any
  public savaProduct:Product= new Product()
  public brand:any
  public action:number=0;
  public stetusAnswer:string="";
  public stetusMessage:string="";
 
  constructor(public productService: ProductService,
              private caddyService:CaddyService,
              public activatedRoute:ActivatedRoute,
              public shopService: ShopService,
              private authService:AuthentificationService,
              public router:Router,
              private fb: FormBuilder) { }
  public homePage:HomePageComponent = new HomePageComponent(this.productService,this.caddyService,
                                                            this.activatedRoute,this.shopService,
                                                            this.authService,this.router);

  ngOnInit(): void {
    this.productFormGroup = this.fb.group({
      productName: this.fb.control(null,[Validators.required,Validators.minLength(4)]),
      productPrice: this.fb.control(null,[Validators.required,Validators.min(0)]),
      reductionPrince: this.fb.control(null,[Validators.min(0)]),
      productQuantity: this.fb.control(null,[Validators.required,Validators.min(0)]),
      brand: this.fb.control(null),
      category: this.fb.control(null,[Validators.required]),
      description: this.fb.control(null),
      available: this.fb.control("true",[Validators.required])
    });
    this.stockFormGroup = this.fb.group({
      stock: this.fb.control(null,[Validators.required,Validators.min(0)]),
    });
    this.destockFormGroup = this.fb.group({
      destock: this.fb.control(null,[Validators.required,Validators.min(0)]),
    });
    //this.homePage.changeShopPage(this.currentShop.idShop,0);
    this.homePage.products=this.products;
  }
  public onCreateNewProduct(){
    this.mode=1;
  }
  public handleProdut(){
    let product = new Product()
    //product.productName="dddddd"
   if(this.productFormGroup.value.category!=undefined){
      this.productService.getOneCategory(this.productFormGroup.value.category).subscribe(category=>{
        console.log(category)
        this.savaProduct.category =  category;
          console.log();
      })
    }
    console.log(this.savaProduct.category);
    if(this.productFormGroup.value.brand!=undefined){
      this.productService.getOneBrand(this.productFormGroup.value.category).subscribe((brand)=>{
        this.savaProduct.brand=brand
        if(this.action==1){
          this.productService.updateOneProduct(this.savaProduct).subscribe({
            next:(product)=>{
              console.log(product)
              if(product!=undefined||this.selectedFile.item(0)!=undefined){
                console.log(product);
                console.log("je taime")
                this.uploadPhoto(product.idProduct)
              }
            },
            error: (err)=>{
              this.errorMessage=err.error.error;
            }
          });
        }else{
          this.productService.saveOneProduct(this.savaProduct).subscribe({
            next:(product)=>{
              console.log(product)
              this.stetusMessage="the product was saved successfully"
              this.stetusAnswer="alert-success"
              if(product!=undefined && this.selectedFile!=undefined){
                console.log(product);
                console.log("je taime")
                this.uploadPhoto(product.idProduct);
              }
            },
            error: (err)=>{
              this.stetusMessage="bad resquest";
              this.stetusAnswer="alert-danger";
              this.errorMessage=err.error.error;
            }
          });
        }
        console.log(brand);
      })
    }
    //let product=this.productFormGroup.value;
    console.log(this.savaProduct.brand);
    this.savaProduct.productName=this.productFormGroup.value.productName;
    this.savaProduct.productPrice=this.productFormGroup.value.productPrice;
    this.savaProduct.reductionPrince=this.productFormGroup.value.reductionPrince;
    this.savaProduct.productQuantity=this.productFormGroup.value.productQuantity;
    this.savaProduct.description=this.productFormGroup.value.description;
    this.savaProduct.available= this.productFormGroup.value.available;
    this.savaProduct.category = this.brand;
    console.log(this.savaProduct.category);
    this.savaProduct.shop=this.productService.currentShop;
    console.log(this.productService.currentShop)
   
    /*this.productService.saveOneCategory(brand).subscribe(brand=>{
      console.log("je taime")
      
    })*/
    
  }
  public getErrorMessage(field:string,error:ValidationErrors):string{
    if(error['required']){
      return field+" is required"
    }else if(error['minlength']){
      return field+"should have at least "+error['minlength']['requiredLength']+" caracters";
    }else if(error['min']){
      return field+"should egaul or upper than "+error['min']['min'];
    }else{
      return "";
    }
  }
  public get currentShop():any{
    return this.productService.currentShop; 
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
  public get products():any{
    return this.productService.products; 
  }
  public set products(products:any){
    this.productService.products=products;
  } 
  public onSelectFile(){
    this.addPhoto=!this.addPhoto;
  }
  public onSelectImage(event:any){
    var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.onload = (_event) => {
			this.imageLink = reader.result; 
		}
    this.selectedFile = event.target.files;
    console.log(event.target.files.item(0))
    if(event.target.files.item(0).type=="image/jpeg"){
      console.log("type valide");
    }
    console.log(this.selectedFile)
  }
  public uploadPhoto(id:number){
    this.progress=0;
    this.currentUploadFile=this.selectedFile.item(0);
    this.productService.uploadPhotoProduct(this.currentUploadFile,id).subscribe({
      next: (event)=>{
        if (event.type == HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total!);
        } else if (event instanceof HttpResponse) {
          //console.log(this.router.url);
          //this.getProducts(this.currentRequest);
          //this.refreshUpdatedProduct();
          this.currentTime=Date.now();
        }
      },
      error: (err)=>{
        this.errorMessage=err;
      }
    })
    this.selectedFile = undefined
    this.onSelectFile();
  }
  public onUpdateProduct(id:number){
    this.productService.getOneProduct(id).subscribe({
      next: (product)=>{
        this.productFormGroup = this.fb.group({
          productName: this.fb.control(product.productName),
          productPrice: this.fb.control(product.productPrice),
          reductionPrince: this.fb.control(product.reductionPrince),
          productQuantity: this.fb.control(product.productQuantity),
          brand: this.fb.control(product.brand.idBrand),
          category: this.fb.control(product.category.idCategory),
          description: this.fb.control(product.description),
          available: this.fb.control(product.available+"")
        });
        this.imageLink=this.productService.host+'/api/products/image/'+product.idProduct;
        this.action=1;
        this.mode=1;
      },
      error: (err)=>{
        this.errorMessage=err;
        console.log(err)
        /*err.status*/
      }
    })
  }
  public onDeleteProduct(id:number){
    this.productService.deleteOneProduct(id).subscribe({
      next: (result)=>{
        this.homePage.onChangeShop(this.currentShop,0);
        this.stetusMessage="the product was delete successfully"
        this.stetusAnswer="alert-success"
        console.log("supr")
      },
      error: (err)=>{
        this.stetusMessage="bad resquest";
        this.stetusAnswer="alert-danger";
      }
    })
  }
  public stoctProduct(id:number){
    console.log(id)
    let urlData:UrlData = new UrlData();
    urlData.idProduct = id;
    urlData.qte = this.stockFormGroup.value.stock;
    if(this.stockFormGroup.valid){
      this.productService.stoctProduct(urlData).subscribe({
        next:(resultat)=>{
          console.log("bjr")
          this.homePage.onChangeShop(this.currentShop,0);
          this.stetusMessage="the product was stock successfully"
          this.stetusAnswer="alert-success"
        },
        error:(err)=>{
          this.stetusMessage="bad resquest";
          this.stetusAnswer="alert-danger";
        }
      });
    }
  }
  public productQty(quantity:number){
    this.destockFormGroup = this.fb.group({
      destock: this.fb.control(null,[Validators.required,Validators.min(quantity)]),
    });
  }
  public destoctProduct(product:Product){
   /* this.destockFormGroup = this.fb.group({
      destock: this.fb.control(null,[Validators.required,Validators.min(product.quantity)]),
    });*/
    let urlData:UrlData = new UrlData();
    urlData.idProduct = product.idProduct;
    urlData.qte = this.destockFormGroup.value.destock;
    if(this.destockFormGroup.valid){
      this.productService.destoctProduct(urlData).subscribe({
        next:(resultat)=>{
          this.homePage.onChangeShop(this.currentShop,0);
          this.stetusMessage="the product was destock successfully"
          this.stetusAnswer="alert-success"
        },
        error:(err)=>{
          this.stetusMessage="bad resquest";
          this.stetusAnswer="alert-danger";
        }
      });
    }
  }
  public set progressBar(progress:number){
    this.productService.progressBar=progress;
  } 
}
