import { Observable, from, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

export abstract class Processor {

  constructor(protected context: ProcessorContext) {

  }

  abstract execute(): Observable<ExecutionResult>;
}

export interface ExecutionResult {
  isPositiveAnswer: boolean;
  dataForReplacing?: string[];
}

export interface ProcessorContext {
  messageLower: string;
  currentContext: string;
  previousUserMessages?: string[];
  phoneNo?: string;
  email?: string;
}

export function tryLoadProcessorByTagName(tag: string, processorContext: ProcessorContext): Observable<Processor> {
  return from(import(`${__dirname}/${tag}.js`)).pipe(map(x => {
    const newInstance = Object.create(x.prototype);
    newInstance.constructor.apply(processorContext);
    return newInstance as Processor;
  })).pipe(catchError(e => {
    console.error(e);
    return of(null);
  }));
}
