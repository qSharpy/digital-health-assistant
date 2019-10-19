import * as functions from "firebase-functions";
import { TokensService } from "./services/tokens.service";
import { ChatMessage } from './models/chat-message';
import { ProcessResponse } from "./models/process-response";
import { Observable, of } from 'rxjs';
import { ProcessorContext, tryLoadProcessorByTagName } from "./processors/processor";
import { setCorsHeaders } from "./services/http.service";
import { switchMap, map } from "rxjs/operators";
import { IntentsModelWithTag } from "./models/intents-model-with-tag";
import { getAnswer } from "./services/helpers";
import { IntentClassificationService } from "./services/intent-classification.service";


export const process = functions.https.onRequest((request, response) => {
  setCorsHeaders(response);
  getHttpResult(request).subscribe(x => {
    let resp = response.status(200);
    if (x.error) {
      resp = response.status(400);
    }
    resp.send(x);
  }, e => {
    response.status(400).send(e);
  });
});

function getHttpResult(request: functions.Request): Observable<ProcessResponse> {
  const chatMessage = request.body as ChatMessage;
  if (!chatMessage.text || chatMessage.text.length === 0) {
    return of({ say: 'You did not say anything' });
  }
  let previousUserMessages: string[] = [];
  if (chatMessage.previousUserMessages) {
    previousUserMessages = chatMessage.previousUserMessages.split('^');
  }
  const processorContext: ProcessorContext = {
    currentContext: chatMessage.context,
    email: chatMessage.email,
    messageLower: chatMessage.text.toLowerCase(),
    phoneNo: chatMessage.phoneNo,
    previousUserMessages: previousUserMessages
  };
  return new TokensService().loadIntentsFromStorage().pipe(
    switchMap(intentsModel => {
      if (!chatMessage.context) {
        return new IntentClassificationService('https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/intentclassification%2Fmodel.json?alt=media').process(chatMessage).pipe(map(results => {
          if (!results || results.length === 0) {
            return { intentsModel, tag: null } as IntentsModelWithTag;
          }
          return { intentsModel, tag: results[0].theClass } as IntentsModelWithTag;
        }));
      }
      return of({ intentsModel, tag: chatMessage.context } as IntentsModelWithTag);
    }),
    switchMap(imt => {
      const response: ProcessResponse = { say: 'Did not recognize.' };
      if (!imt.tag) {
        return of(response);
      }
      const foundResponse = imt.intentsModel.intents.find(x => x.tag === imt.tag);
      if (!foundResponse) {
        return of(response);
      }
      response.context = foundResponse.context && foundResponse.context.length > 0 ? foundResponse.context[0] : null;
      return tryLoadProcessorByTagName(imt.tag, processorContext).pipe(switchMap(processor => {
        if (!processor) {
          response.say = foundResponse.responses[Math.floor(Math.random() * foundResponse.responses.length)].replace('*', '');
          return of(response);
        }
        return processor.execute().pipe(map(executionResult => {
          const textResponse = getAnswer(foundResponse.responses, executionResult.isPositiveAnswer, executionResult.dataForReplacing);
          response.say = textResponse.length === 0 ? 'Did not understand' : textResponse;
          return response;
        }));
      }));
    })
  );
}
