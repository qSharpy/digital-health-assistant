import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable, of } from "rxjs";
import { getDoctorsForClinicByClinicName } from "../clinics";
import { map } from "rxjs/operators";

export class ShowDoctorsFromClinicProcessor extends Processor {

  constructor(context: ProcessorContext) {
    super(context);
  }

  execute(): Observable<ExecutionResult> {
    const fromWordIndex = this.context.messageLower.indexOf(' from ');
    if (fromWordIndex === -1) {
      return of({
        isPositiveAnswer: false
      } as ExecutionResult);
    }
    const newIndex = fromWordIndex + 6;
    const clinicName = this.context.messageLower.substring(newIndex);
    return getDoctorsForClinicByClinicName(clinicName).pipe(map(doctors => {
      return {
        isPositiveAnswer: doctors && doctors.length > 0,
        dataForReplacing: [doctors.map(d => d.name).join(', ')]
      } as ExecutionResult;
    }));
  }

}
