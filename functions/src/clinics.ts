import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { setCorsHeaders } from "./services/http.service";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { GeoCollectionReference, GeoFirestore, GeoQuery } from 'geofirestore';

export const getClinics = functions.https.onRequest((req, res) => {

  getAllClinics().subscribe(clinics => {
    res.send(clinics);
  }, err => {
    res.status(400).send(err);
  });

  const lat = req.query.lat;
  const long = req.query.long;

  if (lat !== undefined && long !== undefined) {
    getAllClinicsByAddress(lat, long).subscribe(clinics => {
      res.send(clinics);
    }, err => {
      res.status(400).send(err);
    });
  } else {
    getAllClinics().subscribe(clinics => {
      res.send(clinics);
    }, err => {
      res.status(400).send(err);
    });
  }

});

export const createClinicAppointment = functions.https.onRequest((req, res) => {
  setCorsHeaders(res);

  // date should be send as 2018-12-08T18:00:20.794Z
  const clinicId = req.query.clinicId;
  const patientId = req.query.patientId;
  const startDate = req.query.date;

  if (clinicId !== undefined && patientId !== undefined && startDate !== undefined) {
    createNewClinicAppointment(clinicId, patientId, startDate).then(
      data => {
        res.send("Appointment added successfully");
      }).catch(
        error => {
          res.status(400).send(error);
        });
  } else {
    res.status(400).send("You must provide the clinic id, the patient id and the start date.")
  }
});
export const deleteClinicAppointment = functions.https.onRequest((req, res) => {
  setCorsHeaders(res);

  const clinicId = req.query.clinicId;
  const appointmentId = req.query.appointmentId;

  if (clinicId !== undefined && appointmentId !== undefined) {
    deleteExistingClinicAppointment(clinicId, appointmentId).then(
      data => {
        res.send("Appointment deleted successfully");
      }).catch(
        error => {
          res.status(400).send(error);
        });
  } else {
    res.status(400).send("You must provide the clinic id and the appointment id.")
  }
});

export const getClinicAppointments = functions.https.onRequest((req, res) => {
  setCorsHeaders(res);

  const clinicId = req.query.clinicId;
  if (clinicId !== undefined) {
    getAllClinicAppointments(clinicId).subscribe(appointments => {
      res.send(appointments);
    }, err => {
      res.status(400).send(err);
    });
  } else {
    res.status(400).send("You must provide the clinic id.")
  }
});

//Get clinic by name
export const getClinicByName = functions.https.onRequest((request, response) => {
  setCorsHeaders(response);
  let clinicByName: any;
  const clinicName: String = request.query.clinicName;

  const firestore = admin.firestore();
  firestore.collection("clinics").get().then(allClinics => {

    allClinics.forEach(clinic => {
      const data: any = clinic.data();

      if (clinicName === data.name) {
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

    if (clinicByName == null)
      response.status(400).send(clinicByName);

  }).catch(e => {
    response.status(400).send(e);
  })

});

export const getDoctorsDetailsFromClinic = functions.https.onRequest((request, response) => {
  setCorsHeaders(response);
  const clinicName: String = request.query.clinicName;
  let doctorsOfClinic = [];
  const doctorsDetails = [];

  const firestore = admin.firestore();
  firestore.collection("clinics").get().then(allClinics => {
    const promises: Promise<void>[] = [];
    allClinics.forEach(clinic => {
      const data: any = clinic.data();

      if (clinicName === data.name) {
        doctorsOfClinic = data.doctors;
      }

      doctorsOfClinic.forEach(id => {
        promises.push(firestore.doc("/doctors/" + id).get().then(item => {
          const tempData: any = item.data();
          const doctorData = {
            "email": tempData.email,
            "name": tempData.name,
            "phone_number": tempData.phone_number,
            "speciality": tempData.speciality
          };
          doctorsDetails.push(doctorData);
        }).catch(err => console.log(err)));
      });
    });

    Promise.all(promises).then(() => {
      response.send(doctorsDetails);
    }).catch(error => console.log(error));

  }).catch(e => {
    response.status(400).send(e);
  });
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


  return from(firestore.collection("clinics").get())
    .pipe(map(snapshot => {
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

export const getAllClinicsByAddress = (lat: number = null, long: number = null) => {
  console.log("lat: " + lat)
  console.log("long: " + long)
  const firestore = admin.firestore();
  const geofirestore: GeoFirestore = new GeoFirestore(firestore);
  const geocollection: GeoCollectionReference = geofirestore.collection('clinics');
  const km = 50;
  console.log(new admin.firestore.GeoPoint(+lat, +long));
  const query: GeoQuery = geocollection.near({ center: new admin.firestore.GeoPoint(+lat, +long), radius: km });

  return from(query.get())
    .pipe(map(snapshot => {
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

export const getAllClinicAppointments = (clinicId) => {
  const firestore = admin.firestore();
  return from(firestore.collection("clinics/" + clinicId + "/appointments").get()).pipe(map(snapshot => {
    let appointments = [];
    snapshot.forEach(doc => {
      const data: any = doc.data();
      const appointment = {
        "id": doc.id,
        "patient_id": data.patient_id,
        "start_date": data.start_date,
        "end_date": data.end_date,
      }
      appointments.push(appointment);
    });
    return appointments;
  }))
};

export const createNewClinicAppointment = (clinicId, patientId, date) => {
  const firestore = admin.firestore();

  const startDate = new Date(date);
  const endDate = new Date(startDate);
  // 60 mins default
  endDate.setMinutes(endDate.getMinutes() + 60);

  return firestore.collection("clinics/" + clinicId + "/appointments").add({
    start_date: startDate,
    end_date: endDate,
    patient_id: patientId
  });
};
export const deleteExistingClinicAppointment = (clinicId, appointmentId) => {
  const firestore = admin.firestore();
  return firestore.doc("clinics/" + clinicId + "/appointments/" + appointmentId).delete();
};