import * as firebase from 'firebase/app';

export interface Account {
  firstName: string;
  lastName: string;
  email: string;
  createdDate: Date;
  phoneNumber?: string;
  geoPoint?: firebase.firestore.GeoPoint;
}
