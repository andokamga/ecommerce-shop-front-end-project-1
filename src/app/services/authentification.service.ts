import { Injectable } from '@angular/core';
import { UserApp } from '../model/user.model';
import { Observable, of, throwError } from 'rxjs';
import { UserRole } from '../model/role.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from './product.service';
import { UrlData } from '../model/urlData.modul';
import { InterceptorInterceptor } from '../interceptor/interceptor.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  public users: UserApp[] = [];
  public authentificatedUser: UserApp | undefined;
  constructor(private http: HttpClient,private productService:ProductService) { 
    this.users.push({idUserApp: 1 , userName: "user1", password:"1234", userRoles:[{userRoleName:"USER"}]});
    this.users.push({idUserApp: 2 , userName: "user2", password:"1234", userRoles:[{userRoleName:"USER"}]});
    this.users.push({idUserApp: 3 , userName: "adnim", password:"1234", userRoles:[{userRoleName:"USER"},{userRoleName:"ADMIN"}]});
  }
  public login(username:string, password:string):Observable<UserApp>{
    let userApp = this.users.find(u=>u.userName == username);
    if(!userApp) return throwError(()=> new Error("user not found"));
    if(userApp!.password!=password){
      return throwError(()=> new Error("bad credentiats"));
    }
    return of(userApp);
  }
  /*public authentificateUser(userApp : UserApp):Observable<boolean>{
    this.authentificatedUser = userApp ;
    localStorage.setItem("authUser",(JSON.stringify({user:userApp, roles:userApp.userRoles,jwt: "JWT_TOKEN"})));
    return of(true);
  }*/
  public authentificateUser(userApp : UserApp,accessToken:string,refreshToken:string):Observable<boolean>{
    this.authentificatedUser = userApp ;
    localStorage.setItem("authUser",(JSON.stringify({user:userApp, roles:userApp.userRoles,accessToken:accessToken,refreshToken:refreshToken})));
    return of(true);
  }
  public hasRole(role:string):boolean{
    let userRole = this.authentificatedUser!.userRoles!.find(r=>r.userRoleName=role)
    if(!userRole){
      return false;
    }
    return true;
     //this.authentificatedUser!.userRoles!.includes();
  }
  public isAuthetificated():boolean{
    return this.authentificatedUser!=undefined;
  }
  public logout():Observable<boolean>{
    this.authentificatedUser=undefined;
    localStorage.removeItem("authUser");
    return of(true);
  }
  public loadAuthentificatedUserFromLocalStorage(){
    let userLocalStorage = localStorage.getItem("authUser");
    if(userLocalStorage){
     
      let userApp = JSON.parse((userLocalStorage));
      this.authentificatedUser = userApp.user;
      InterceptorInterceptor.accessToken=userApp.accessToken;
      InterceptorInterceptor.refreshToken=userApp.refreshToken;
      console.log(this.authentificatedUser)
    }
  }
  public loginUser(userName:string,password:string){
    let body = new URLSearchParams();
    body.set('userName', userName);
    body.set('password', password);

    let formData = new FormData();
formData.append('userName', userName);
formData.append('password', password);

    let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<{accessToken:string,refreshToken:string}>(this.productService.host+"/login", body,options);
    
  }
  public findUserToBackEnd(username:string){
    let urlData = new UrlData();
    urlData.username=username;
    return this.http.post<UserApp>(this.productService.host+"/api/accounts/verify",urlData);
  }
  public refreshToken(token:string){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token                       
     })
    };
    let reqOptions = new HttpHeaders().set('Content-Type','application/json')
    const headers = { 'Authorization': 'Bearer '+token }
    console.log(headers)
    reqOptions = new HttpHeaders().set( 'Content-Type', 'application/json'         ).set('Authorization','Bearer ');
    return this.http.get<{accessToken:string,refreshToken:string}>(this.productService.host+"/api/accounts/refreshToken",{ headers });
  }
  public deleteImage(id:number){
    return this.http.delete(this.productService.host+"/api/accounts/image/"+id);
  }
  public deleteUser(id:number){
    return this.http.delete(this.productService.host+"/api/accounts/user/"+id);
  }
  public deleteRole(id:number){
    return this.http.delete(this.productService.host+"/api/accounts/role/"+id);
  }
  public getUserImage(id:number){
    return this.http.get(this.productService.host+"/api/accounts/image/"+id);
  }
  public ListUser(urlData:UrlData){
    return this.http.post(this.productService.host+"/api/accounts/users",urlData);
  }
  public getUserAccount(id:number){
    return this.http.get(this.productService.host+"/api/accounts/user/"+id);
  }
  public getlistsRoles(){
    return this.http.get(this.productService.host+"/api/accounts/roles");
  }
  public getOneRole(id:number){
    return this.http.get(this.productService.host+"/api/accounts/role/"+id);
  }
  public getUserProfile(){
    return this.http.get(this.productService.host+"/api/accounts/profile");
  }
  public conexionByFacebook(){
    return this.http.get(this.productService.host+"/api/accounts/facebook");
  }
  public addRole(role:UserRole){
    return this.http.post(this.productService.host+"/api/accounts/role/",role);
  }
  public signUp(user:UserApp){
    return this.http.post(this.productService.host+"/api/accounts/signup",user);
  }
  public addRoleToUser(urlData:UrlData){
    return this.http.post(this.productService.host+"/api/accounts/role/",urlData);
  }
  public removeRoleToUser(urlData:UrlData){
    return this.http.post(this.productService.host+"/api/accounts/remove",urlData);
  }
  public addPhotoToUser(id:number,file:File){
    return this.http.post(this.productService.host+"/api/accounts/add"+id,file);
  }
  public updateRole(role:UserRole){
    return this.http.put(this.productService.host+"/api/accounts/role",role);
  }
  public updateUser(user:UserApp){
    return this.http.put(this.productService.host+"/api/accounts/user",user);
  }
}

