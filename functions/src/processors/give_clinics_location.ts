import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable } from "rxjs";
import { getAllClinics } from "../clinics";
import { map } from "rxjs/operators";

export class GiveClinicsLocationProcessor extends Processor {

  constructor(context: ProcessorContext) {
    super(context);
  }

  execute(): Observable<ExecutionResult> {
    return getAllClinics().pipe(map(clinics => {
      return {
        isPositiveAnswer: clinics.length > 0,
        dataForReplacing: [clinics.map(x => x.name).join(', ')]
      } as ExecutionResult;
    }));
  }

}
