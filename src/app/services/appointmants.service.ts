import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Appointment } from '../models/account';
import { switchMap, tap } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmantsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  getUserAppointments(): Observable<Appointment[]> {
    const url = 'https://us-central1-digital-health-assistant.cloudfunctions.net/getDoctorAppointments';

    return this.authService.firebaseLoggedInAccount.pipe(
      switchMap(user => this.http.get<Appointment[]>(url,
        {
          params: new HttpParams().set('userId', '4FMHHTiSeuUyVMzdSRb84iwCM4l1')
        }
      )),
      tap(val => console.log(val))
    );
  }
}
