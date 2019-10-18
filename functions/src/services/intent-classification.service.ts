import { Observable } from "rxjs";
import * as tf from "@tensorflow/tfjs";
import { map, switchMap } from "rxjs/operators";
import { tokenize } from "string-punctuation-tokenizer";
import * as stemmer from "lancaster-stemmer";
import { TokensService } from "./tokens.service";
import { IntentClassificationTokens } from "../models/intent-classification-tokens";
import { TensorflowService } from "./tensorflow.service";
import { ChatMessage } from "../models/chat-message";
import { IntentClassificationResult } from "../models/intent-classification-result";

export class IntentClassificationService extends TensorflowService {

  constructor(modelUrl: string, errorThreshold: number = 0.25) {
    super(modelUrl, errorThreshold);
  }

  public process(message: ChatMessage): Observable<IntentClassificationResult[]> {
    return new TokensService().loadClassesAndWordsFromStorage<IntentClassificationTokens>().pipe(
      switchMap(tokens => {
        const array = this.convertSentenceToTensor(message.text, tokens.words);
        const tensor = tf.tensor([array], null, "float32");
        return this.predict(tensor).pipe(
          map(data => {
            const arr: number[] = Object.values(data);
            return arr;
          }),
          map(result => {
            const filteredWithIndices: number[][] = [];
            result.forEach((r, i) => {
              if (r > this.errorThreshold) {
                filteredWithIndices.push([i, r]);
              }
            });
            return filteredWithIndices.sort((a, b) => {
              const aVal = a[1];
              const bVal = b[1];
              if (aVal === bVal) {
                return 0;
              }
              if (aVal < bVal) {
                return -1;
              }
              return 1;
            }).reverse()
            .map(x => {
              return {
                confidence: x[1],
                theClass: tokens.classes[x[0]]
              } as IntentClassificationResult;
            });
          })
        );
      })
    );
  }

  private convertSentenceToTensor(message: string, words: string[]): any {
    let tokenizedString: string[] = tokenize({
      text: message,
      includePunctuation: true,
      parsers: {
        word: /[\w-]+/,
        number: /\d+/,
        punctuation: /[\.,;'"]/,
        whitespace: /\s+/
      }
    });
    tokenizedString = tokenizedString.map(x => stemmer(x));
    const bag: number[] = [];
    words.forEach(w => {
      bag.push(0);
    });
    for (const s of tokenizedString) {
      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        if (w === s) {
          bag[i] = 1;
        }
      }
    }
    return bag;
  }
}
