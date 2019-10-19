import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { PublicClinicsComponent } from './public-clinics/public-clinics.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'public/clinics', component: PublicClinicsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
