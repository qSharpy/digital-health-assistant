import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { loadFile } from "./http.service";

export class TokensService {
  loadClassesAndWordsFromStorage<T>(): Observable<T> {
    return combineLatest([this.loadClassesFromStorage(), this.loadWordsFromStorage()]).pipe(map(x => {
      return {
        classes: x[0],
        words: x[1]
      } as any;
    }));
  }

  loadClassesFromStorage(): Observable<string[]> {
    return loadFile<string[]>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fclasses.json?alt=media");
  }

  loadWordsFromStorage(): Observable<string[]> {
    return loadFile<string[]>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fwords.json?alt=media");
  }

  loadIntentsFromStorage(): Observable<IntentsModel> {
    return loadFile<IntentsModel>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fintents.json?alt=media");
  }
}

export interface IntentsModel {
  intents: Intent[];
}

export interface Intent {
  tag: string;
  patterns: string[];
  responses: string[];
  context: string[];
}
