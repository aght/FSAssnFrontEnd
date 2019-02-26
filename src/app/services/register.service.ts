import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterModel } from '../models/registermodel';
import { map } from 'rxjs/operators';

const endpoint = "https://fsassnbackend.azurewebsites.net/register";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(model: RegisterModel) {
    return this.http.post<any>(endpoint, model)
      .pipe(map(result => {
        return result;
      }));
  }
}
