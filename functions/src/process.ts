import * as functions from "firebase-functions";
import { TensorFlowService } from "./services/tensorflow.service";

export const process = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  /*const phoneNo: string = request.body.phoneNo;
  const email: string = request.body.email;*/
  if (!request.body.text || request.body.text.length === 0) {
    response.send({ say: "Did not understand." });
    return;
  }
  const messageLower = request.body.text.toLowerCase();
  if (messageLower === "stop") {
    response.status(400);
    response.send({ say: "Bye!" });
    return;
  }
  new TensorFlowService().process(request.body.text).subscribe(
    message => {
      console.log(message);
      response.send({ say: message });
    },
    e => {
      console.error(e);
      response.send({ say: "Did not understand.", e: e });
    }
  );
});
