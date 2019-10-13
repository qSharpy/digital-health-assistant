exports.handler = function (context, event, callback) {
  let r = new Twilio.Response();
  r.appendHeader('Content-Type', 'application/json');
  r.appendHeader("Access-Control-Allow-Origin", "*");
  r.appendHeader("Access-Control-Allow-Methods", "*");
  r.appendHeader("Access-Control-Allow-Headers", "*");
  if (!event.phoneNo) {
    r.setStatusCode(400);
    r.setBody({ 'error': 'No phone no.' });
    callback(null, r);
    return;
  }
  const client = context.getTwilioClient();
  client.studio.flows('FW5889ad716ce6f568b2519e6572e2d7c0')
    .executions
    .create({ to: event.phoneNo, from: '+12512207243', parameters: { userName: event.userName } })
    .then(execution => {
      r.setBody(execution);
      r.setStatusCode(200);
      callback(null, r);
    });

};
