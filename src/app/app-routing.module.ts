import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthentificationGuard } from './guards/authentification.guard';
import { CaddyComponent } from './caddy/caddy.component';
import { OrderComponent } from './order/order.component';
import { ProductsComponent } from './products/products.component';
import { ShopsComponent } from './shops/shops.component';
import { UsersComponent } from './users/users.component';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  {
    path:"",
    component: HomeComponent ,
    children:[
      {
        path:"",
        component:HomePageComponent,
      },
      {
        path:"caddy",
        component: CaddyComponent,
      },
      {
        path:"order",
        component: OrderComponent,
      },
      {
        path:"detail",
        component: DetailProductComponent,
      },
      {
        path:"products",
        component: ProductsComponent,
      },
      {
        path:"shops",
        component: ShopsComponent,
      },
      {
        path:"users",
        component: UsersComponent,
      },
      {
        path:"categories",
        component: CategoriesComponent,
      }
    ]
  },
  {
    path:"login",
    component: LoginComponent
  },
  {
    path:"dashboard", canActivate: [AuthentificationGuard],
    component: DashboardComponent
  
  },
  {
    path:"register",
    component: RegisterComponent 
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
