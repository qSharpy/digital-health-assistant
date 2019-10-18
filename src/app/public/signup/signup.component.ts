import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Messages } from '../../util/messages';
import { Account } from '../../models/account';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  errorMessage: string;
  registerForm: FormGroup;
  hide = true;
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.required]);

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.errorMessage = "";
    this.registerForm = this.formBuilder.group({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
    });
  }

  onSubmit() {
    this.authService.signUp(this.registerForm.value).then(
      data => {
        const account: Account = {
          id: data.user.uid,
          firstName: this.firstName.value,
          lastName: this.lastName.value,
          createdDate: new Date(),
          email: this.email.value,
          phoneNumber: this.phoneNumber.value
        };
        this.authService.addAccount(account).then(
          _ => {
            console.log(_);
            this.router.navigate(['/']);
          }
        ).catch(

          error => { this.errorMessage = error; console.error(error); }
        );
      }
    ).catch(
      error => {
        console.error(error);
        this.errorMessage = error;
      }
    )
  }


  get firstNameErrorMessage() {
    return this.firstName.hasError('required') ? Messages.INPUT_REQUIRED : '';
  }
  get lastNameErrorMessage() {
    return this.lastName.hasError('required') ? Messages.INPUT_REQUIRED : '';
  }
  get emailErrorMessage() {
    return this.email.hasError('required') ? Messages.INPUT_REQUIRED :
      this.email.hasError('email') ? Messages.EMAIL_INVALID : '';
  }
  get passwordErrorMessage() {
    return this.password.hasError('required') ? Messages.INPUT_REQUIRED : '';
  }
  get phoneNumberErrorMessage() {
    return this.phoneNumber.hasError('required') ? Messages.INPUT_REQUIRED : '';
  }
}
