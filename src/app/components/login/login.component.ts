import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServiceService, User } from '../../services/auth-service.service';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error: any;
  errMessage: any = "";
  statusCode: any = "";

  loginForm: FormGroup = new FormGroup({
    userLogin: new FormControl('', [
      Validators.required,
    ]),
    userPassword: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(private service: AuthServiceService) {}

  loginUser() {
    if (this.loginForm.valid) {
      const existingUser: User = new User (
        this.loginForm.value.userLogin,
        this.loginForm.value.userPassword,
      )

      this.service.signinUser(existingUser).subscribe(
        (data: any) => {
          const token = data.token;
          const tokenPayloadBase64 = token.split('.')[1];
          const tokenPayloadJSON = JSON.parse(atob(tokenPayloadBase64));
          const userId = tokenPayloadJSON.id as string;

          const tokenExpiration = tokenPayloadJSON.exp * 1000;

          storage.setItem('userId', userId);
          storage.setItem('token', data.token);
          storage.setItem('tokenExpiration', `${tokenExpiration}`)
          window.location = '/main-route' as (string | Location) & Location
        },
        (error) => {
          this.errMessage = error.error.message;
          this.statusCode = error.error.statusCode;
        }
      );
    }
  }
}

export const storage: Storage = window.localStorage
