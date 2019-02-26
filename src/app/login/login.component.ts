import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  isLoading: boolean = false;
  authFailed: boolean = false;
  fromExpiration: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('expired')) {
      this.fromExpiration = true;
    }
  }

  onSubmit() {
    this.isLoading = true;

    this.authService.login(this.username, this.password)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.isLoading = false;
          this.authFailed = false;
          this.router.navigate(['/']); //navigate to home
        },
        error => {
          this.authFailed = true;
          this.isLoading = false;
        }
      );
  }
}
