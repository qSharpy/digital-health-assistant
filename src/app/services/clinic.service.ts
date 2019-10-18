import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clinic } from '../models/clinic';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(private angularFirestore: AngularFirestore) { }

  getAllClinics(): Observable<Clinic[]> {
    return this.angularFirestore.collection<Clinic>('clinics').valueChanges();
  }
}
