import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Messages } from '../util/messages';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  errorMessage = "";
  loginForm: FormGroup;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  rememberMe = false;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.errorMessage = "";
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });
  }

  onSubmit() {
    this.authService.signIn(this.loginForm.value).then(
      _ => this.router.navigate(['/home'])
    ).catch(
      error => this.errorMessage = error
    );
  }

  get emailErrorMessage() {
    return this.email.hasError('required') ? Messages.INPUT_REQUIRED :
      this.email.hasError('email') ? Messages.EMAIL_INVALID : '';
  }

  get passwordErrorMessage() {
    return this.email.hasError('required') ? Messages.INPUT_REQUIRED : '';
  }

}
