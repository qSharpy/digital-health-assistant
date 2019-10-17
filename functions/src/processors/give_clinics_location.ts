import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable, of } from "rxjs";

export class GiveClinicsLocationProcessor extends Processor {

  constructor(context: ProcessorContext) {
    super(context);
  }

  execute(): Observable<ExecutionResult> {
    const rand = Math.random();
    const isPositive = rand < 0.5;
    return of({
      dataForReplacing: isPositive ? ['clinic one, clinic two'] : [],
      isPositiveAnswer: isPositive
    });
  }

}
