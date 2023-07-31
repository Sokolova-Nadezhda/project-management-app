import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthServiceService, User } from '../../services/auth-service.service';
import { storage } from '../../components/login/login.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { checkTokenAndRedirect } from '../../functions/check-token';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  constructor(
    private service: AuthServiceService,
    private singUp: SignUpComponent
  ) {}

  confirmPasswordClass = this.singUp.confirmPasswordClass;
  myForm = this.singUp.myForm;
  pass = this.singUp.pass;
  conf_pass = this.singUp.conf_pass;
  password = this.singUp.password;

  error: any;
  errMessage: any = "";
  statusCode: any = "";

  isModalVisible = false;

  token = storage.getItem('token');
  thisUserName: string = '';
  thisUserLogin: string = '';
  user: any;

  ngOnInit() {
    if (this.token) {
      this.user = this.service.getUserById().subscribe(
        (data: any) => {
          this.thisUserName = data.name;
          this.thisUserLogin = data.login;
        },
        error => {
          this.errMessage = error.error.message;
          this.statusCode = error.error.statusCode;
        }
      );
    }
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors?.['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  logout() {
    storage.removeItem('token');
    this.token = '';
    window.location = '/' as (string | Location) & Location;
  }

  saveChangesProfile() {
    if (this.myForm.valid && this.password.valid) {
      const user: User = new User(
        this.myForm.value.userLogin,
        this.password.value.pass,
        this.myForm.value.userName,
      );

      this.service.updateUser(user).subscribe(
        () => {
          this.thisUserName = this.myForm.value.userName;
          this.thisUserLogin = this.myForm.value.userLogin;
        },
        (error) => {
          checkTokenAndRedirect();
          this.errMessage = error.error.message
          this.statusCode = error.error.statusCode;
        }
      );
    }
  }
}
