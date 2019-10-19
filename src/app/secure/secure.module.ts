import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure.component';
import { HomeComponent } from './home/home.component';
import { SecureNavbarComponent } from './secure-navbar/secure-navbar.component';
import { SharedModule } from '../shared/shared.module';
import { ClinicsComponent } from './clinics/clinics.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [SecureComponent, HomeComponent, SecureNavbarComponent, ClinicsComponent, AppointmentsComponent],
  imports: [
    CommonModule,
    SecureRoutingModule,
    SharedModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ]
})
export class SecureModule { }
