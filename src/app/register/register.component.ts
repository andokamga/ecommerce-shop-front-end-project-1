import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  visible: boolean = true;
  changeType: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }
  viewPassword(){
    this.visible = !this.visible;
    this.changeType = !this.changeType;
  }
}
