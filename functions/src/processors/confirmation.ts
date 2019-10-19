import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable, of } from "rxjs";

export class ConfirmationProcessor extends Processor {

  constructor(context: ProcessorContext) {
    super(context);
  }

  execute(): Observable<ExecutionResult> {
    return of({
      isPositiveAnswer: true,
      dataForReplacing: ['you confirmed something']
    } as ExecutionResult);
  }

}
