export const environment = {
  production: true,
  twillio: {
    startFlowFunction: 'https://blue-wren-6952.twil.io/start-flow' // add ?phoneNo=+4....
  },
  firebase: {
    firestoreEmulator: false,
    processFunction: 'https://us-central1-digital-health-assistant.cloudfunctions.net/process',
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
