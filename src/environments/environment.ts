// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  twillio: {
    startFlowFunction: 'https://blue-wren-6952.twil.io/start-flow' // add ?phoneNo=+4....
  },
  firebase: {
    functionsEmulator: true,
    firestoreEmulator: false,
    fct_processUrl: 'https://us-central1-digital-health-assistant.cloudfunctions.net/process',
    fct_getClinicsUrl: 'https://us-central1-digital-health-assistant.cloudfunctions.net/getClinics',
    fct_getDoctorsUrl: 'https://us-central1-digital-health-assistant.cloudfunctions.net/getDoctors',
    apiKey: 'AIzaSyCpMy4UwL5LALmp2KGBaRFWjlvJ9ha3n6w',
    authDomain: 'digital-health-assistant.firebaseapp.com',
    databaseURL: 'https://digital-health-assistant.firebaseio.com',
    projectId: 'digital-health-assistant',
    storageBucket: 'digital-health-assistant.appspot.com',
    messagingSenderId: '569280339149',
    appId: '1:569280339149:web:b3fac67965ff046a699d84',
    measurementId: 'G-W9XFG88VWK'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
