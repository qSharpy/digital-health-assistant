import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { setCorsHeaders } from "./services/http.service";
import { from } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";


export const checkValidInterval = functions.https.onRequest((req, res) => {
  setCorsHeaders(res);
  const doctorId = req.query.doctorId;
  const date = req.query.date;

  checkValidIntervalForAppointment(doctorId, date).subscribe(data => {
    res.send(data);
  }, err => {
    res.status(400).send(err);
  });
});


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

export const getAllDoctorAppointments = (doctorId) => {
  const firestore = admin.firestore();
  return from(firestore.collection("doctors/" + doctorId + "/doctorAppointments").get()).pipe(map(snapshot => {
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

export const createNewDoctorAppointment = (doctorId, patientId, date) => {
  const firestore = admin.firestore();

  const startDate = new Date(date);
  const endDate = new Date(startDate);
  // 60 mins default
  endDate.setMinutes(endDate.getMinutes() + 60);

  console.log(doctorId)
  console.log(patientId)
  console.log(date)

  return firestore.collection("doctors/" + doctorId + "/doctorAppointments").add({
    start_date: startDate,
    end_date: endDate,
    patient_id: patientId
  });
};
export const deleteExistingDoctorAppointment = (doctorId, appointmentId) => {
  const firestore = admin.firestore();
  return firestore.doc("doctors/" + doctorId + "/doctorAppointments/" + appointmentId).delete();
};

export const checkValidIntervalForAppointment = (doctorId, date) => {
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  // set default end date
  endDate.setMinutes(startDate.getMinutes() + 60);

  console.log(startDate);
  console.log(endDate);
  let suggested_time: any = [];

  return getAllDoctorAppointments(doctorId).pipe(map(appointments => {
    return appointments.filter(appointment => {
      const appointmentStartDate: Date = appointment.start_date.toDate();
      const appointmentEndDate: Date = appointment.end_date.toDate();
      console.log("app start date: " + appointmentStartDate);
      console.log("app end date: " + appointmentEndDate);
      if ((appointmentStartDate < endDate) && (appointmentEndDate > startDate)) {
        console.log("invalid")
        return false;
      }
      suggested_time.push(appointment);
      console.log("valid")
      return true;
    });
  }));
}

export const getAppointmentSuggestions = (doctorId, date) => {
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  // set default end date
  endDate.setMinutes(startDate.getMinutes() + 60);

}

export const getFirstDoctorAvailabilityBySpeciality = (speciality: string) => {
  const firestore = admin.firestore();
  let docsArray: FirebaseFirestore.QueryDocumentSnapshot[] = [];

  return from(firestore.collection('doctors').where('speciality', '==', speciality).get()).pipe(
    tap(doctors => docsArray = doctors.docs),
    map(doctors => doctors.docs),
    switchMap(docs =>
      from(Promise.all(docs.map(doc => doc.ref.collection('doctorAppointments').orderBy('end_date', 'asc').limit(1).get())))),
    map(appointments => appointments.map(appointment => appointment.docs[0].data())),
    map(appointments => ({ doctors: docsArray, appointments }))
  )
}
/*
export const getFirstDoctorAvailabilityBySpecialityApi = functions.https.onRequest((req, res) => {
  setCorsHeaders(res);

  const firestore = admin.firestore();
  const speciality = req.query.speciality;

  getFirstDoctorAvailabilityBySpeciality(speciality)
  .pipe(
    map(val => ({
      doctorId: val.doctors.map(doctor => doctor.id)[0],
      appointment: val.appointments[0]
    })),
    switchMap(val =>
      from(firestore.collection('clinics').get()).pipe(
        map(clinics => clinics.docs.filter(clinic => clinic.data().doctors.indexOf(val.doctorId))),
        map(clinics => ({
          clinicName: clinics[0].data().name,
          appointment: val.appointment
        })
      ))
    )
  ).subscribe(val => res.send({
    clinicName: val.clinicName,
    start_date: val.appointment.start_date,
    end_date: val.appointment.end_date,
    patient_id: val.appointment.patient_id
  }), error => res.sendStatus(400).send('Sorry, try anouther action'));
});
*/
