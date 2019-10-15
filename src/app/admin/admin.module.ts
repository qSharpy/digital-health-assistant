import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { ClinicsComponent } from './clinics/clinics.component';


@NgModule({
  declarations: [AdminComponent, ClinicsComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
