import { Component, OnInit } from '@angular/core';
import { UserApp } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public fromSearch!:string;
  public search!:string
  public town:any
  public isHome:number=0;
  public currentShops:any;
  public isSearch:number=0;
  public shops:any
  public userApp: UserApp | undefined;

  constructor(private authService:AuthentificationService) { }

  ngOnInit(): void {
  }
  public get isAuthetificated(): boolean{
    if(this.authService.isAuthetificated()){
      this.userApp = this.authService.authentificatedUser;
    }
    return this.authService.isAuthetificated();
  } 

}
