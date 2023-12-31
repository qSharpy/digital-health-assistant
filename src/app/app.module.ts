import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ChatComponent } from './chat/chat.component';
import { NgChatModule } from 'ng-chat';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { PublicModule } from './public/public.module';
import { SecureModule } from './secure/secure.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ChatComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    PublicModule,
    SecureModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgChatModule,
    AngularFireModule.initializeApp(environment.firebase, 'Digital Health Assistant'),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFirestoreModule,
    AngularFireAuthModule,
    SharedModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
