import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { UserApp } from '../model/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  errorMessage!: string;
  visible: boolean = true;
  changeType: boolean = true;
  constructor(private fb: FormBuilder,
              private authService:AuthentificationService,
              private router:Router) { }

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      username: this.fb.control(""),
      password: this.fb.control("")
    }
    );
  }
  viewPassword(){
    this.visible = !this.visible;
    this.changeType = !this.changeType;
  }
  handleLogin(){
    let username = this.loginFormGroup.value.username;
    let password = this.loginFormGroup.value.password;
    this.authService.login(username,password).subscribe({
      next:(userApp)=>{
        this.authService.authentificateUser(userApp).subscribe({
          next:(boolean)=>{
            this.router.navigateByUrl("");
          }
        });
      },
      error:(err)=>{
        this.errorMessage = err;
      }
    });
  }
  public set currentUser(userApp: UserApp){
    this.authService.authentificatedUser = userApp;
  }

}
