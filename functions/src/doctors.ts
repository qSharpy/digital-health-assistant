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

export const createDoctorAppointment = functions.https.onRequest((req, res) => {
  setCorsHeaders(res);

  // date should be send as 2018-12-08T18:00:20.794Z
  const doctorId = req.query.doctorId;
  const patientId = req.query.patientId;
  const startDate = req.query.date;

  if (doctorId !== undefined && patientId !== undefined && startDate !== undefined) {
    createNewDoctorAppointment(doctorId, patientId, startDate).then(
      data => {
        res.send("Appointment added successfully");
      }).catch(
        error => {
          console.log(error)
          res.status(400).send(error);
        });
  } else {
    res.status(400).send("You must provide the doctor id, the patient id and the start date.")
  }
});
export const deleteDoctorppointment = functions.https.onRequest((req, res) => {
  setCorsHeaders(res);

  const doctorId = req.query.doctorId;
  const appointmentId = req.query.appointmentId;

  if (doctorId !== undefined && appointmentId !== undefined) {
    deleteExistingDoctorAppointment(doctorId, appointmentId).then(
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

export const createNewDoctorAppointment = (doctorId, patientId, date) => {
  const firestore = admin.firestore();

  const startDate = new Date(date);
  const endDate = new Date(startDate);
  // 60 mins default
  endDate.setMinutes(endDate.getMinutes() + 60);

  console.log(doctorId)
  console.log(patientId)
  console.log(date)

  return firestore.collection("doctors/" + doctorId + "/appointments").add({
    start_date: startDate,
    end_date: endDate,
    patient_id: patientId
  });
};
export const deleteExistingDoctorAppointment = (doctorId, appointmentId) => {
  const firestore = admin.firestore();
  return firestore.doc("doctors/" + doctorId + "/appointments/" + appointmentId).delete();
};