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

const routes: Routes = [
  {
    path:"",
    component: HomeComponent ,
    children:[
      {
        path:"e",
        component: LoginComponent,
      }

    ]
  },
  {
    path:"login",
    component: LoginComponent
  },
  {
    path:"dashboard", canActivate: [AuthentificationGuard],
    component: DashboardComponent,
    children:[
      {
        path:"e",
        component: LoginComponent ,
      }

    ]
  },
  {
    path:"registe",
    component: FooterComponent 
  },
  {
    path:"register",
    component: RegisterComponent 
  },
  {
    path:"detail",
    component: DetailProductComponent 
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
