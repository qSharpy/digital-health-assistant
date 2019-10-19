import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { setCorsHeaders } from "./services/http.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";

export const getClinics = functions.https.onRequest((req, res) => {
    setCorsHeaders(res);
    getAllClinics().subscribe(clinics => {
      res.send(clinics);
    }, err => {
      res.status(400).send(err);
    });
});

//Get clinic by name
export const getClinicByName = functions.https.onRequest((request, response) => {
    setCorsHeaders(response);
    let clinicByName : any;
    const clinicName : String = request.query.clinicName;

    const firestore = admin.firestore();
    firestore.collection("clinics").get().then(allClinics => {

        allClinics.forEach(clinic => {
           const data : any = clinic.data();             
               
           if(clinicName === data.name) {
               clinicByName = {
                "id": clinic.id,
                "address": data.address,
                "address_geopoint": data.address_geopoint,
                "doctors": data.doctors,
                "laboratory_analysis": data.laboratory_analysis,
                "name": data.name,
                "schedule": data.schedule,
                "image_url": data.image_url,
            }
            response.send(clinicByName);
           }
        });
         
        if(clinicByName == null)
        response.status(400).send(clinicByName);

    }).catch(e => {
        response.status(400).send(e);
    })

});

export const getAllClinics = () => {
  const firestore = admin.firestore();
  return from(firestore.collection("clinics").get()).pipe(map(snapshot => {
    let clinics = [];
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
              "image_url": data.image_url,
          }
          clinics.push(clinic);
      });
      return clinics;
  }))
};

