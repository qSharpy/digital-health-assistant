import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { setCorsHeaders } from "./services/http.service";
import { from, of, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { Query } from "@google-cloud/firestore";

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


export const getAccountInsuranceTypeByUid = functions.https.onRequest((req, res) => {
    setCorsHeaders(res);

    const uid = req.query.uid;

    if (uid !== undefined) {
        getAccountInsuranceType(uid).subscribe(doctors => {
            res.send(doctors);
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

export const getAccountDetailsEmailOrPhone = (email, phone) => {
    console.log("email: " + email);
    console.log("phone: " + phone);
    const firestore = admin.firestore();
    let accountsCollectionQuery: Query = null;
    if (email != null) {
        accountsCollectionQuery = firestore.collection("accounts").where("email", "==", email);
    }
    if (phone != null) {
        accountsCollectionQuery = firestore.collection("accounts").where("phoneNumber", "==", phone);
    }

    if (accountsCollectionQuery != null) {
        return from(accountsCollectionQuery.get()).pipe(map(snapshot => {
            const data = snapshot.docs[0].data();

            console.log("account: " + snapshot.docs[0].id);
            return {
                "id": snapshot.docs[0].id,
                "firstName": data.firstName,
                "lastName": data.lastName,
                "email": data.email,
                "createdDate": data.createdDate,
                "phoneNumber": data.phoneNumber,
                "geoPoint": data.geoPoint,
            }
        }))
    } else {
        return of(null);
    }
};

export const getAccountInsuranceType = (uid) => {
    const firestore = admin.firestore();
    return from(firestore.doc("insurances/" + uid).get()).pipe(map(doc => {
        const data: any = doc.data();
        return {
            "patient_id": doc.id,
            "type": data.type,
            "price": data.price,
            "options": data.options,
            "acquisition_date": data.acquisition_date,
            "expiry_date": data.expiry_date
        }
    }))
};

export const getDoctorAppointments = functions.https.onRequest((request, response) => {
    setCorsHeaders(response);
    const userId = request.query.userId;
    const firestore = admin.firestore();
    const appointments = [];

    const promises: Promise<void>[] = [];
    promises.push(firestore.collectionGroup("doctorAppointments").where("patient_id", "==", userId).get().then(item => {
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


export const getMyClinicAppointments = functions.https.onRequest((request, response) => {
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

export const getAppointmentsForUser = (uid) => {
    const firestore = admin.firestore();

    const appointments = [];
    console.log("User uid " + uid);
    let doctorAppointment = from(firestore.collectionGroup("doctorAppointments").where("patient_id", "==", uid).get());
    let clinicAppointment = from(firestore.collectionGroup("clinicAppointments").where("patient_id", "==", uid).get());
    return forkJoin([doctorAppointment, clinicAppointment]).pipe(map(snapshots => {
        snapshots.forEach(snapshot => {
            snapshot.docs.forEach(doc => {
                const data: any = doc.data();
                const appointment = {
                    "end_date": data.end_date,
                    "patient_id": data.patient_id,
                    "start_date": data.start_date
                }
                appointments.push(appointment);
            });

        });
        return appointments;
    }));
}