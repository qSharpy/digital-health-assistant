import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { getAppointmentsForUser } from "../accounts";

export class ShowAppointmentsForUser extends Processor {

  constructor(context: ProcessorContext) {
    super(context);
  }

  execute(): Observable<ExecutionResult> {

    const uid = "4FMHHTiSeuUyVMzdSRb84iwCM4l1";

    return getAppointmentsForUser(uid).pipe(
      map(appointments => {
        return {
          isPositiveAnswer: appointments && appointments.length > 0,
          dataForReplacing: [appointments.map(x => x.patient_id).join(', ')]
        } as ExecutionResult;
      })
    );
  }

}
