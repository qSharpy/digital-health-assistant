import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { ClinicsComponent } from './clinics/clinics.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  {path: 'clinics', component: ClinicsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
