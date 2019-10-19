import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { getAppointmentsForUser, getAccountDetailsEmailOrPhone } from "../accounts";

export class ShowAppointmentsForUser extends Processor {

  constructor(context: ProcessorContext) {
    super(context);
  }

  execute(): Observable<ExecutionResult> {
    const a = getAccountDetailsEmailOrPhone(this.context.email, this.context.phoneNo).pipe(
      switchMap(account => getAppointmentsForUser(account.id)),
      map(appointments => ({
        isPositiveAnswer: appointments && appointments.length > 0,
        dataForReplacing: [appointments.map(x => 
          "<br/> Appointment from " + new Date(x.start_date.seconds * 1000).toLocaleString() + " to " + new Date(x.end_date.seconds * 1000).toLocaleString()).join(";")]
      } as ExecutionResult
      ))
    );

    return a;
  }
}
