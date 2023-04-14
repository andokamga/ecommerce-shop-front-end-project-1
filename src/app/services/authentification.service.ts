import { Injectable } from '@angular/core';
import { UserApp } from '../model/user.model';
import { Observable, of, throwError } from 'rxjs';
import { UserRole } from '../model/role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  public users: UserApp[] = [];
  public authentificatedUser: UserApp | undefined;
  constructor() { 
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
  public authentificateUser(userApp : UserApp):Observable<boolean>{
    this.authentificatedUser = userApp ;
    localStorage.setItem("authUser",(JSON.stringify({user:userApp, roles:userApp.userRoles,jwt: "JWT_TOKEN"})));
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
      console.log(this.authentificatedUser)
    }
  }
}
