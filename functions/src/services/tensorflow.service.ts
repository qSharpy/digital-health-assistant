import { Observable, from, Subject, combineLatest } from "rxjs";
import * as tf from "@tensorflow/tfjs";
import { map, switchMap } from "rxjs/operators";
import { tokenize } from "string-punctuation-tokenizer";
import * as stemmer from "lancaster-stemmer";
import * as request from "request";
import { StorageIoHandler } from "./storage.iohandler";
import { Tokens } from "./tokens";
import { Result } from "./result";

export class TensorFlowService {
  private errorThreshold = 0.25;

  process(message: string): Observable<Result[]> {
    return this.loadTokensFromStorage().pipe(
      switchMap(tokens => {
        const array = this.convertSentenceToTensor(message, tokens.words);
        const tensor = tf.tensor([array], null, "float32");
        return this.loadModel().pipe(
          switchMap(model => {
            return from(
              (model.predict(tensor, {
                verbose: true
              }) as any).data()
            );
          }),
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
              } as Result;
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

  private loadTokensFromStorage(): Observable<Tokens> {
    return combineLatest([this.loadClassesFromStorage(), this.loadWordsFromStorage()]).pipe(map(x => {
      return {
        classes: x[0],
        words: x[1]
      } as Tokens;
    }));
  }

  private loadClassesFromStorage(): Observable<string[]> {
    return this.loadFile<string[]>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fclasses.json?alt=media&token=e0fa117f-488e-4109-9f3f-791221152a1a");
  }

  private loadWordsFromStorage(): Observable<string[]> {
    return this.loadFile<string[]>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fwords.json?alt=media&token=94f3fac4-bb72-42f9-bda9-aef191f3b043");
  }

  private loadModel(): Observable<tf.LayersModel> {
    return from(tf.loadLayersModel(new StorageIoHandler()));
  }

  private loadFile<T>(url: string, isJson: boolean = true): Observable<T> {
    const subject = new Subject<T>();
    request(
      url, { json: isJson },
      (err, res, body) => {
        if (err) subject.error(err);
        subject.next(body);
      }
    );
    return subject.asObservable();
  }
}
