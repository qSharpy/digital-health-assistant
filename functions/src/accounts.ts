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

export const getDoctorAppointments = functions.https.onRequest((request, response) => {
    setCorsHeaders(response);
    const userId = request.query.userId;
    const firestore = admin.firestore();
    const appointments = [];

    const promises: Promise<void>[] = [];
    promises.push(firestore.collectionGroup("appointments").where("patient_id", "==", userId).get().then(item => {
        item.forEach(app => {
            const data: any = app.data();
            const tempAppointment = {
                "end_date": data.end_date,
                "patient_id": data.patient_id,
                "start_date": data.start_date
            };
            appointments.push(tempAppointment);
        });
    }).catch(e => console.log(e)));

    Promise.all(promises).then(() => {
        response.send(appointments);
    }).catch(error => console.log(error));

});


export const getCliniCAppointments = functions.https.onRequest((request, response) => {
    setCorsHeaders(response);
    const userId = request.query.userId;
    const firestore = admin.firestore();
    const appointments = [];

    const promises: Promise<void>[] = [];
    promises.push(firestore.collectionGroup("clinicAppointments").where("patient_id", "==", userId).get().then(item => {
        item.forEach(app => {
            const data: any = app.data();
            const tempAppointment = {
                "end_date": data.end_date,
                "patient_id": data.patient_id,
                "start_date": data.start_date
            };
            appointments.push(tempAppointment);
        });
    }).catch(e => console.log(e)));

    Promise.all(promises).then(() => {
        response.send(appointments);
    }).catch(error => console.log(error));

});