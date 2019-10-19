import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clinic } from '../models/clinic';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(private http: HttpClient) { }

  getAllClinics(): Observable<Clinic[]> {
    const url = 'https://us-central1-digital-health-assistant.cloudfunctions.net/getClinics';

    return this.http.get<Clinic[]>(url);
  }
}
