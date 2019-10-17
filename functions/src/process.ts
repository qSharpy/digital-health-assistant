import * as functions from "firebase-functions";
import { TensorFlowService } from "./services/tensorflow.service";
import { TokensService } from "./services/tokens.service";
import { ChatMessage } from './models/chat-message';
import { ProcessResponse } from "./models/process-response";

export const process = functions.https.onRequest((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  const chatMessage = request.body as ChatMessage;
  const phoneNo: string = chatMessage.phoneNo;
  const email: string = chatMessage.email;
  console.log(phoneNo, email);
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
  if (chatMessage.context != null && chatMessage.context.length > 0) {
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
      // WE HAVE THE TAG, THE ACTION ID
      const tag = results[0].theClass;
      new TokensService().loadIntentsFromStorage().subscribe(intentsModel => {
        const foundResponse = intentsModel.intents.find(x => x.tag === tag);
        if (foundResponse == null) {
          response.send({ say: "Did not recognize."} as ProcessResponse);
          return;
        }
        // WE HAVE A RANDOM RESPONSE
        const randomResponse = foundResponse.responses[Math.floor(Math.random() * foundResponse.responses.length)];

        // WE HAVE THE NEXT (FUTURE ANSWER) CONTEXT
        const context = foundResponse.context != null && foundResponse.context.length > 0 ? foundResponse.context[0] : null;

        // TODO ALL LOGIC HERE - DATABASE STUFF ETC
        // WE ALSO HAVE THIS:
        console.log(chatMessage.previousUserMessages);

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
