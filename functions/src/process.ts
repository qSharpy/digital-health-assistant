import * as functions from "firebase-functions";
import { TensorFlowService } from "./services/tensorflow.service";
import { TokensService } from "./services/tokens.service";
import { ChatMessage } from './models/chat-message';
import { ProcessResponse } from "./models/process-response";

export const process = functions.https.onRequest((request, response) => {
  if (request.method.toUpperCase() !== 'POST') {
    response.status(400).send('Error.');
    return;
}
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  const phoneNo: string = request.body.phoneNo;
  const email: string = request.body.email;
  console.log(phoneNo, email);
  const chatMessage = request.body as ChatMessage;
  if (!chatMessage.text || chatMessage.text.length === 0) {
    response.send({ say: "You didn't say anything." } as ProcessResponse);
    return;
  }
  const messageLower = chatMessage.text.toLowerCase();
  if (messageLower === "stop") {
    response.status(400);
    response.send({ say: "Bye!" } as ProcessResponse);
    return;
  }

  // CONTEXT
  if (chatMessage.context != null) {
    new TokensService().loadIntentsFromStorage().subscribe(intentsModel => {
      const intentForContext = intentsModel.intents.find(x => x.tag === chatMessage.context);
      if (intentForContext == null) {
        response.send({ say: "Did not recognize."} as ProcessResponse);
        return;
      }
      const randomResponse = intentForContext.responses[Math.floor(Math.random() * intentForContext.responses.length)];
      const context = intentForContext.context != null && intentForContext.context.length > 0 ? intentForContext.context[0] : null;
      response.send({ say: randomResponse, context: context} as ProcessResponse);
    });
    return;
  }

  // NO CONTEXT, GO TO TENSORFLOW AI
  new TensorFlowService().process(chatMessage).subscribe(
    results => {
      if (results == null || results.length === 0) {
        response.send({ say: "Did not recognize."} as ProcessResponse);
        return;
      }
      const tag = results[0].theClass;
      new TokensService().loadIntentsFromStorage().subscribe(intentsModel => {
        const foundResponse = intentsModel.intents.find(x => x.tag === tag);
        if (foundResponse == null) {
          response.send({ say: "Did not recognize."} as ProcessResponse);
          return;
        }
        const randomResponse = foundResponse.responses[Math.floor(Math.random() * foundResponse.responses.length)];
        const context = foundResponse.context != null && foundResponse.context.length > 0 ? foundResponse.context[0] : null;
        response.send({say: randomResponse, context: context} as ProcessResponse);
      }, e => {
        console.error(e);
      response.send({ say: "An error occurred.", e: e } as ProcessResponse);
      });
    },
    e => {
      console.error(e);
      response.send({ say: "An error occurred.", e: e } as ProcessResponse);
    }
  );
});
