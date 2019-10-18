import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecureComponent } from './secure.component';
import { HomeComponent } from './home/home.component';
import { ClinicsComponent } from './clinics/clinics.component';

const routes: Routes = [
  {
    path: 'secure', component: SecureComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'clinics', component: ClinicsComponent }    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
