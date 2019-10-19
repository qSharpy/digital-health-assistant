import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { setCorsHeaders } from "./services/http.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";

export const getDoctors = functions.https.onRequest((req, res) => {
    setCorsHeaders(res);
    getAllDoctors().subscribe(doctors => {
      res.send(doctors);
    }, err => {
      res.status(400).send(err);
    });
});

export const getAllDoctors = () => {
    const firestore = admin.firestore();
    return from(firestore.collection("doctors").get()).pipe(map(snapshot => {
      let doctors = [];
        snapshot.forEach(doc => {
            const data: any = doc.data();
            const doctor = {
                "id": doc.id,
                "email": data.email,
                "phone_number": data.phone_number,
                "specialty": data.specialty,
                "name": data.name,
            }
            doctors.push(doctor);
        });
        return doctors;
    }))
  };