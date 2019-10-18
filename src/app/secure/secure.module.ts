import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure.component';
import { HomeComponent } from './home/home.component';
import { SecureNavbarComponent } from './secure-navbar/secure-navbar.component';
import { SharedModule } from '../shared/shared.module';
import { ClinicsComponent } from './clinics/clinics.component';

@NgModule({
  declarations: [SecureComponent, HomeComponent, SecureNavbarComponent, ClinicsComponent],
  imports: [
    CommonModule,
    SecureRoutingModule,
    SharedModule
  ]
})
export class SecureModule { }
