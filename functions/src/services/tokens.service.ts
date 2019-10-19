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
    return loadFile<string[]>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/intentclassification%2Fclasses.json?alt=media");
  }

  loadWordsFromStorage(): Observable<string[]> {
    return loadFile<string[]>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/intentclassification%2Fwords.json?alt=media");
  }

  loadIntentsFromStorage(): Observable<IntentsModel> {
    return loadFile<IntentsModel>("https://firebasestorage.googleapis.com/v0/b/digital-health-assistant.appspot.com/o/intentclassification%2Fintents.json?alt=media");
  }
}

export interface IntentsModel {
  intents: Intent[];
  symptomsMap: SymptomDefinition[];
}

export interface SymptomDefinition {
  dept?: string;
  type: string;
  description?: string;
  tests?: string[];
}

export interface Intent {
  tag: string;
  patterns: string[];
  responses: string[];
  context: string[];
}
