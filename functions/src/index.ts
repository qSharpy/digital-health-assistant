import * as functions from 'firebase-functions';
import { TensorFlowService } from './tensorflow.service';


export const process = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  /*const phoneNo: string = request.body.phoneNo;
  const email: string = request.body.email;*/
  if (request.body.text == null || request.body.text.length === 0) {
    response.send({ say: 'Didn\'t get that. Please repeat.' });
    return;
  }
  const messageLower = request.body.text.toLowerCase();
  if (messageLower === 'stop') {
    response.status(400);
    response.send({ say: 'Bye!' });
    return;
  }

  // tensorflow
  const service = new TensorFlowService();
  const message = service.process(messageLower);
  response.send({ say: `You said: ${request.body.text}` });
});
