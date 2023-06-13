import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { ProductService } from '../services/product.service';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
  public static accessToken:string;
  public static refreshToken:string;
  constructor(private http: HttpClient,
              private productService:ProductService,
              private router:Router,
              private authService:AuthentificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.authService.loadAuthentificatedUserFromLocalStorage();
    if(this.authService.isAuthetificated() && request.url!=this.productService.host+'/api/accounts/refreshToken'){
      request = request.clone({
        setHeaders:{
          Authorization: 'Bearer '+InterceptorInterceptor.accessToken
        }
      })
    }
    return next.handle(request).pipe(catchError((err:HttpErrorResponse)=>{
      if(err.status==403){
        /*console.log(request)
        const headers = { 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYW1nYSIsImlzcyI6Ii9sb2dpbiIsImV4cCI6MTY4NTE1ODIwN30.B9n9d-uo8AYB3A4mkMwWNpxeCR-owK3h_tVZZqJI6bI' }
        InterceptorInterceptor.accessToken=''*/
        return this.authService.refreshToken(InterceptorInterceptor.refreshToken).pipe(
          switchMap((res:any)=>{
            this.authService.authentificateUser(this.authService.authentificatedUser!,res.accessToken,res.refreshToken);
          console.log('bien');
          console.log(res);
            return next.handle(request.clone({
              setHeaders:{
                Authorization: 'Bearer '+res.accessToken
              }
            }));
          })
        )
      }
      if(err.status==500 && request.url==this.productService.host+'/api/accounts/refreshToken'){
        this.authService.logout().subscribe({
          next:(data=>{
            this.router.navigateByUrl("/login");
          })
        });
      }
      return throwError(()=>err);
    }
    ));
  }
  public addTokenToHeader(request: HttpRequest<unknown>,token:string){
    return request.clone({ headers: request.headers.set('Authorization', 'Bearer '+token)})
  }
  public handleRefeshToken(request: HttpRequest<unknown>, next: HttpHandler, token:string){

  }
}
