import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { AuthServiceService, User } from '../../services/auth-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})

export class SignUpComponent {
  confirmPasswordClass = 'form-control';
  error: any;
  errMessage: any = "";
  statusCode: any = "";

  myForm: FormGroup = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern('[A-Za-zА-Яа-я]+'),
    ]),
    userLogin: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern('^[a-zA-Z0-9]+$'),
    ]),
  });

  pass = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).*$/),
    Validators.minLength(8),
  ]);

  conf_pass = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
  ]);

  password: FormGroup;

  constructor(fb: FormBuilder, private service: AuthServiceService) {
    this.password = fb.group(
      {
        pass: this.pass,
        conf_pass: this.conf_pass,
      },
      {
        validator: this.ConfirmedValidator('pass', 'conf_pass'),
      }
    );
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

  addUser() {
    if (this.myForm.valid && this.password.valid) {
      const user: User = new User(
        this.myForm.value.userLogin,
        this.password.value.pass,
        this.myForm.value.userName,
      );

      this.service.signupUser(user).subscribe(
        (data) => {
          window.location = '/main-route' as (string | Location) & Location
        },
        (error) => {
          this.errMessage = error.error.message
          this.statusCode = error.error.statusCode;
        }
      );
    }
  }
}
