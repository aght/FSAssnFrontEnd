import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { RegisterModel } from '../models/registermodel';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUser: RegisterModel;

  passwordValid: boolean = true;

  constructor(
    private router: Router,
    private registerService: RegisterService
  ) { 
    this.registerUser = new RegisterModel();
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.isValidPassword(this.registerUser.password)) {
      this.passwordValid = true;

      this.registerService.register(this.registerUser)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error);
        }
      )
    } else {
      this.passwordValid = false;
    }
  }

  private isValidPassword(password: string): boolean {
    let regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.[!@#\$%\^&])(?=.{8,})/;
    return regex.test(password);
  }
}
