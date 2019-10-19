import * as firebase from 'firebase/app';

export interface Clinic {
    address: string;
    address_geopoint: firebase.firestore.GeoPoint;
    doctors: string[];
    laboratory_analysis: boolean;
    name: string;
    schedule: string;
    image_url: string;
}
