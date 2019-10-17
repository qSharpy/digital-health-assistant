import * as functions from "firebase-functions";
import { TensorFlowService } from "./services/tensorflow.service";
import { TokensService } from "./services/tokens.service";

export const process = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  /*const phoneNo: string = request.body.phoneNo;
  const email: string = request.body.email;*/
  if (!request.body.text || request.body.text.length === 0) {
    response.send({ say: "You didn't say anything." });
    return;
  }
  const messageLower = request.body.text.toLowerCase();
  if (messageLower === "stop") {
    response.status(400);
    response.send({ say: "Bye!" });
    return;
  }

  new TensorFlowService().process(request.body.text).subscribe(
    results => {
      if (results == null || results.length === 0) {
        response.send({ say: "Did not recognize."});
        return;
      }
      const tag = results[0].theClass;
      new TokensService().loadIntentsFromStorage().subscribe(intentsModel => {
        const foundResponse = intentsModel.intents.find(x => x.tag === tag);
        if (foundResponse == null) {
          response.send({ say: "Did not recognize."});
          return;
        }
        const randomResponse = foundResponse.responses[Math.floor(Math.random() * foundResponse.responses.length)];
        response.send({say: randomResponse});
      }, e => {
        console.error(e);
      response.send({ say: "An error occurred.", e: e });
      });
    },
    e => {
      console.error(e);
      response.send({ say: "An error occurred.", e: e });
    }
  );
});
