import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Messages } from '../util/messages';
import { Account } from '../models/account';

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
        let account = new Account();
        account.id = data.user.uid;
        account.firstName = this.firstName.value;
        account.lastName = this.lastName.value;
        account.email = this.email.value;
        account.phoneNumber = this.phoneNumber.value;
        account.createdDate = new Date();

        this.authService.addAccount(account).then(
          _ => this.router.navigate(['/home'])
        ).catch(
          error => this.errorMessage = error
        );
      }
    ).catch(
      error => {
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
