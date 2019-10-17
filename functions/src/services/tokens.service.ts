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
    return loadFile<string[]>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fclasses.json?alt=media&token=e0fa117f-488e-4109-9f3f-791221152a1a");
  }

  loadWordsFromStorage(): Observable<string[]> {
    return loadFile<string[]>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fwords.json?alt=media&token=94f3fac4-bb72-42f9-bda9-aef191f3b043");
  }

  loadIntentsFromStorage(): Observable<IntentsModel> {
    return loadFile<IntentsModel>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/tensorflow%2Fintents.json?alt=media&token=a3b5cee8-0115-42db-bd05-f6ff625da133");
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
