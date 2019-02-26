import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { RegisterModel } from '../models/registermodel';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerUser: RegisterModel;

  passwordValid: boolean = true;
  emailValid: boolean = true;
  usernameValid: boolean = true;

  constructor(
    private router: Router,
    private registerService: RegisterService
  ) {
    this.registerUser = new RegisterModel();
  }

  ngOnInit() {
  }

  async onSubmit() {
    if (!(await this.isValidEmail(this.registerUser.email))) {
      this.emailValid = false;
      return;
    } else {
      this.emailValid = true;
    }

    if (!(await this.isValidUsername(this.registerUser.username))) {
      this.usernameValid = false;
      return;
    } else {
      this.usernameValid = true;
    }

    if (!this.isValidPassword(this.registerUser.password)) {
      this.passwordValid = false;
      return;
    } else {
      this.passwordValid = true;
    }

    this.registerService.register(this.registerUser)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error);
        }
      );
  }

  private isValidPassword(password: string): boolean {
    let regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.[!@#\$%\^&])(?=.{8,})/;
    return regex.test(password);
  }

  private async isValidUsername(username: string) {
    return await this.registerService
      .isValidUsername(username)
      .pipe(map(
        data => {
          return data.valid ? true : false;
        },
        error => {
          return false;
        })).toPromise();
  }

  private async isValidEmail(password: string) {
    return await this.registerService
      .isValidEmail(password)
      .pipe(map(
        data => {
          return data.valid ? true : false;
        },
        error => {
          return false;
        }
      )).toPromise();
  }
}
