import * as firebase from 'firebase/app';

export interface Account {
  firstName: string;
  lastName: string;
  email: string;
  createdDate: Date;
  phoneNumber?: string;
  geoPoint?: firebase.firestore.GeoPoint;
}

export interface Appointment {
  start_date: {
    _seconds: number,
    _nanoseconds: number
  };
  end_date: {
    _seconds: number,
    _nanoseconds: number
  };
  patient_id: number;
}
