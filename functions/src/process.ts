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
  const forcedContexts = ['negation', 'confirmation'];
  const chatMessage = request.body as ChatMessage;
  if (!chatMessage.text || chatMessage.text.length === 0) {
    return of({ say: 'You did not say anything' });
  }
  let previousUserMessages: string[] = [];
  if (chatMessage.previousUserMessages) {
    previousUserMessages = chatMessage.previousUserMessages.split('^');
  }
  let previousUserContexts: string[] = [];
  if (chatMessage.previousUserContexts) {
    previousUserContexts = chatMessage.previousUserContexts.split('^');
  }
  chatMessage.text = stripUneededKeywords(chatMessage.text);
  const processorContext: ProcessorContext = {
    currentContext: chatMessage.context,
    email: chatMessage.email,
    messageLower: chatMessage.text.toLowerCase(),
    phoneNo: chatMessage.phoneNo,
    previousUserMessages: previousUserMessages,
    previousUserContexts: previousUserContexts,
  };
  return new TokensService().loadIntentsFromStorage().pipe(
    switchMap(intentsModel => {
      processorContext.intentsModel = intentsModel;
      return new IntentClassificationService('https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/intentclassification%2Fmodel.json?alt=media').process(chatMessage).pipe(map(results => {
        if (!results || results.length === 0) {
          if (!chatMessage.context) {
            return { intentsModel, tag: null } as IntentsModelWithTag;
          } else {
            return { intentsModel, tag: chatMessage.context } as IntentsModelWithTag;
          }
        }
        if (forcedContexts.indexOf(results[0].theClass) !== -1) {
          return { intentsModel, tag: results[0].theClass } as IntentsModelWithTag;
        } else {
          if (!chatMessage.context) {
            return { intentsModel, tag: results[0].theClass } as IntentsModelWithTag;
          } else {
            return { intentsModel, tag: chatMessage.context} as IntentsModelWithTag;
          }
        }

      }));
    }),
    switchMap(imt => {
      const response: ProcessResponse = { say: 'Did not recognize.' };
      if (!imt.tag) {
        imt.tag = 'noanswer';
      }
      const foundResponse = imt.intentsModel.intents.find(x => x.tag === imt.tag);
      if (!foundResponse) {
        return of(response);
      }
      response.lastResponseFromContext = imt.tag;
      response.context = foundResponse.context != null && foundResponse.context.length > 0 && foundResponse.context[0].length > 0 ? foundResponse.context[0] : null;
      return tryLoadProcessorByTagName(imt.tag, processorContext).pipe(switchMap(processor => {
        if (!processor) {
          response.say = foundResponse.responses[Math.floor(Math.random() * foundResponse.responses.length)].replace('*', '');
          return of(response);
        }
        return processor.execute().pipe(map(executionResult => {
          console.log(executionResult);
          const textResponse = executionResult.forceAnswer != null ? executionResult.forceAnswer :
            getAnswer(foundResponse.responses, executionResult.isPositiveAnswer, executionResult.dataForReplacing);
          console.log(textResponse);
          if (executionResult.forceContext !== undefined) {
            response.context = executionResult.forceContext;
          }
          response.say = textResponse.length === 0 ? 'Did not understand' : textResponse;
          return response;
        }));
      }));
    })
  );
}

export function stripUneededKeywords(x: string) {
  let xt = x.toLowerCase();
  [',', '.', '!', '?', ';', '"', '"', '(', ')',
  'i think ', 'please', 'can you ', 'will you ', 'could you ', 'if you could', 'if possible'].forEach(y => {
    xt = xt.replace(y, '');
  });
  return xt;
}
