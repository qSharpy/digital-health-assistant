import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Messages } from '../../util/messages';
import { Account } from '../../models/account';
import { AuthenticationCredential } from 'src/app/models/authentication';
import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  errorMessage: string;
  registerForm: FormGroup;
  hide = true;
  latitude: number;
  longitude: number;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
      }, error => console.error('Denied location access', error));
    } else {
      console.log('No support for geolocation');
    }

    this.registerForm = this.fb.group({
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phoneNumber: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
    });
  }

  onSubmit() {
    this.authService.signUp(this.createAuthenticationCredential()).pipe(
      switchMap(userCredenttial =>
        this.authService.addAccount(this.createAccount(), userCredenttial.user.uid))
    ).subscribe(() => {
      this.toastr.success('Account created');
      this.router.navigate(['/']);
    }, error => {
      this.errorMessage = error;
      console.error(error);
    });
  }

  private createAuthenticationCredential(): AuthenticationCredential {
    return {
      email: this.email.value,
      password: this.password.value,
    };
  }

  private createAccount: () => Account = () => ({
    email: this.email.value,
    firstName: this.firstName.value,
    lastName: this.lastName.value,
    createdDate: new Date(),
    phoneNumber: this.phoneNumber.value,
    geoPoint: new firebase.firestore.GeoPoint(this.latitude, this.longitude)
  })

  get firstName(): AbstractControl {
    return this.registerForm.controls.firstName;
  }

  get lastName(): AbstractControl {
    return this.registerForm.controls.lastName;
  }

  get email(): AbstractControl {
    return this.registerForm.controls.email;
  }

  get password(): AbstractControl {
    return this.registerForm.controls.password;
  }

  get phoneNumber(): AbstractControl {
    return this.registerForm.controls.phoneNumber;
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
