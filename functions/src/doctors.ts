import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { setCorsHeaders } from "./services/http.service";

export const getDoctors = functions.https.onRequest((req, res) => {
    setCorsHeaders(res);

    const doctors = [];
    const firestore = admin.firestore();
    firestore.collection("doctors").get().then(snapshot => {

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
        res.send(doctors);
    }).catch(e => {
        res.status(400).send(e);
    })
});