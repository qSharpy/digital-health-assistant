import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

export const getClinics = functions.https.onRequest((req, res) => {
    let clinics = [];
    const firestore = admin.firestore();
    firestore.collection("clinics").get().then(snapshot => {

        snapshot.forEach(doc => {
            const data: any = doc.data();
            const clinic = {
                "id": doc.id,
                "address": data.address,
                "address_geopoint": data.address_geopoint,
                "doctors": data.doctors,
                "laboratory_analysis": data.laboratory_analysis,
                "name": data.name,
                "schedule": data.schedule,
                "imageUrl": data.imageUrl,
            }
            clinics.push(clinic);
        });
        res.send(clinics);
    }).catch(e => {
        res.status(400).send(e);
    })
});