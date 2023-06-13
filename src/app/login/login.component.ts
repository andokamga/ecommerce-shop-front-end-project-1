import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { UserApp } from '../model/user.model';
import { InterceptorInterceptor } from '../interceptor/interceptor.interceptor';

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
  public stetusAnswer:string="";
  public stetusMessage:string="";
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
    this.authService.findUserToBackEnd(username).subscribe({
      next:(user)=>{
        console.log(user)
        this.authService.loginUser(username,password).subscribe({
          next:(tokens)=>{
            this.authService.authentificateUser(user,tokens.accessToken,tokens.refreshToken);
            this.authService.loadAuthentificatedUserFromLocalStorage();
            this.stetusAnswer="";
            console.log(tokens.refreshToken)
            console.log(user.userRoles)
          },
          error:(err)=>{
            this.stetusMessage="bad credantials"
            this.stetusAnswer="alert-danger"
            this.errorMessage = err.error.message || err.error || err.message;;
            console.log(err)
          }
        })
        if(!this.stetusAnswer){this.router.navigateByUrl("");}
      },
      error:(err)=>{
        this.errorMessage = err;
        this.stetusMessage="the user wasn't found"
        this.stetusAnswer="alert-danger"
        console.log(err)
      }
    })
    /*this.authService.loginUser(username,password).subscribe({
      next:(tokens)=>{
        console.log(tokens.accessToken)
      },
      error:(err)=>{
        this.errorMessage = err;
        console.log(err)
      }
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
    });*/
  }

  public set currentUser(userApp: UserApp){
    this.authService.authentificatedUser = userApp;
  }

}
