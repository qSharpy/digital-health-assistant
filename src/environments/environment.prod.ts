export const environment = {
  production: true,
  twillio: {
    startFlowFunction: 'https://blue-wren-6952.twil.io/start-flow' // add ?phoneNo=+4....
  },
  firebase: {
    processFunction: 'https://us-central1-digital-health-assistant.cloudfunctions.net/process'
  }
};
