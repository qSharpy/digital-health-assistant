import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Messages } from '../../util/messages';
import { AuthenticationCredential } from 'src/app/models/authentication';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  errorMessage: string;
  loginForm: FormGroup;
  hide = true;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.errorMessage = '';
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required])
    });
  }

  get email(): AbstractControl {
    return this.loginForm.controls.email;
  }

  get password(): AbstractControl {
    return this.loginForm.controls.password;
  }

  onSubmit() {
    this.authService.signIn(this.createAuthenticationCredential())
      .subscribe(() => this.router.navigate(['/secure/home']),
        error => {
          this.errorMessage = 'Invalid credentials';
          console.log(error);
        });
  }

  private createAuthenticationCredential: () => AuthenticationCredential = () => ({
    email: this.email.value,
    password: this.password.value
  })

  get emailErrorMessage() {
    return this.email.hasError('required') ? Messages.INPUT_REQUIRED :
      this.email.hasError('email') ? Messages.EMAIL_INVALID : '';
  }

  get passwordErrorMessage() {
    return this.email.hasError('required') ? Messages.INPUT_REQUIRED : '';
  }

}
