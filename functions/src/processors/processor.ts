import { Observable, of } from "rxjs";

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
  try {
    const clazz = require(`${__dirname}/${tag}.js`);
    return of(new clazz(processorContext) as Processor);
  } catch (err) {
    return of(null);
  }
}
