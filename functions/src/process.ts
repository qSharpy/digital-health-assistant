import * as functions from "firebase-functions";
import { TensorFlowService } from "./services/tensorflow.service";
import { TokensService, IntentsModel } from "./services/tokens.service";
import { ChatMessage } from './models/chat-message';
import { ProcessResponse } from "./models/process-response";
import { Observable, of } from 'rxjs';

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

  // We have previous user messages (10)
  let previousUserMessages: string[] = [];
  if (chatMessage.previousUserMessages != null) {
    previousUserMessages = chatMessage.previousUserMessages.split('^');
  }

  // WE HAVE A CONTEXT
  if (chatMessage.context != null && chatMessage.context.length > 0) {
    new TokensService().loadIntentsFromStorage().subscribe(intentsModel => {
      giveResponse(chatMessage.context, messageLower, intentsModel, null, previousUserMessages, phoneNo, email).subscribe(x => {
        if (x.e) {
          response.status(400);
        }
        response.send(x);
      });
    });
    return;
  }

  // ELSE : NO CONTEXT, GO TO TENSORFLOW AI
  new TensorFlowService().process(chatMessage).subscribe(
    results => {
      if (results == null || results.length === 0) {
        response.send({ say: "Did not recognize." } as ProcessResponse);
        return;
      }
      // WE HAVE THE TAG, THE ACTION ID
      const tag = results[0].theClass;
      new TokensService().loadIntentsFromStorage().subscribe(intentsModel => {
        giveResponse(tag, messageLower, intentsModel, chatMessage.context, previousUserMessages, phoneNo, email).subscribe(x => {
          if (x.e) {
            response.status(400);
          }
          response.send(x);
        });
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

function giveResponse(tag: string, messageLower: string, intentsModel: IntentsModel, currentContext: string, previousUserMessages: string[], phoneNo: string, email: string): Observable<ProcessResponse> {
  const response: ProcessResponse = { say: 'Did not recognize.' };
  console.log(messageLower);
  console.log(currentContext);
  console.log(previousUserMessages);
  // TODO LOGIC HERE - DATABASE AND STUFF - GIVE CUSTOM RESPONSE OR CONTEXT
  console.log(phoneNo, email);

  // OR WE CAN LET THE AI DECIDE
  const foundResponse = intentsModel.intents.find(x => x.tag === tag);
  if (foundResponse == null) {
    response.e = true;
    return of(response);
  }
  const randomResponse = foundResponse.responses[Math.floor(Math.random() * foundResponse.responses.length)];
  const context = foundResponse.context != null && foundResponse.context.length > 0 ? foundResponse.context[0] : null;
  response.say = randomResponse;
  response.context = context;
  return of(response);
}
