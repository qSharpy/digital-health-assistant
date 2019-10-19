import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { setCorsHeaders } from "./services/http.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";

export const getAccountDetails = functions.https.onRequest((req, res) => {
    setCorsHeaders(res);
    const uid = req.query.uid;
    if (uid) {
        getAccountDetailsByUid(uid).subscribe(clinics => {
            res.send(clinics);
        }, err => {
            res.status(400).send(err);
        });
    } else {
        res.status(400).send("You must provide the user uid.");
    }
});

export const getAccountDetailsByUid = (uid) => {
    const firestore = admin.firestore();
    return from(firestore.doc("accounts/" + uid).get()).pipe(map(doc => {
        const data: any = doc.data();
        return {
            "id": doc.id,
            "firstName": data.firstName,
            "lastName": data.lastName,
            "email": data.email,
            "createdDate": data.createdDate,
            "phoneNumber": data.phoneNumber,
            "geoPoint": data.geoPoint,
        }
    }))
};