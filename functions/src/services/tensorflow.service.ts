import { Observable, from, Subject } from "rxjs";
import * as tf from "@tensorflow/tfjs";
import { map, switchMap } from "rxjs/operators";
import { tokenize } from "string-punctuation-tokenizer";
import * as stemmer from "lancaster-stemmer";
import * as request from "request";
import { StorageIoHandler } from "./storage.iohandler";

export class TensorFlowService {
  process(message: string): Observable<any> {
    return this.loadWordsFromStorage().pipe(
      switchMap(words => {
        const array = this.convertSentenceToTensor(message, words);
        console.log(array);
        return this.loadModel().pipe(
          map(model => {
            return model.predict(tf.tensor(array));
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
    return [bag];
  }

  private loadWordsFromStorage(): Observable<string[]> {
    const subject = new Subject<string[]>();
    request(
      "https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fwords.json?alt=media&token=94f3fac4-bb72-42f9-bda9-aef191f3b043",
      { json: true },
      (err, res, body) => {
        if (err) subject.error(err);
        subject.next(body);
      }
    );
    return subject.asObservable();
  }

  private loadModel(): Observable<tf.LayersModel> {
    return from(tf.loadLayersModel(new StorageIoHandler()));
  }
}
