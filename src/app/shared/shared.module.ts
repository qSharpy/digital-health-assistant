import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [],
  imports: [
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatIconModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  exports: [
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatIconModule,
    FlexLayoutModule,
    HttpClientModule
  ]
})
export class SharedModule { }
