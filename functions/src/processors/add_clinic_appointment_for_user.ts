import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable, from, forkJoin, of } from "rxjs";
import { getClinicByName, createNewClinicAppointment } from "../clinics";
import { map, switchMap, catchError } from "rxjs/operators";
import { getAccountDetailsEmailOrPhone } from "..";

export class AddClinicAppointmentForUser extends Processor {

    constructor(context: ProcessorContext) {
        super(context);
    }

    execute(): Observable<ExecutionResult> {
        const date = new Date(this.context.messageLower);
        const clinicName = this.context.previousUserMessages[this.context.previousUserMessages.length - 1];

        return forkJoin([getClinicByName(clinicName),
        getAccountDetailsEmailOrPhone(this.context.email, this.context.phoneNo)]).pipe(
            switchMap(([clinic, account]) => from(createNewClinicAppointment(clinic.id, account.id, date))),
            catchError((e) => {
                return of({
                    isPositiveAnswer: false
                } as ExecutionResult
                )
            }),
            map(val => ({
                isPositiveAnswer: true,
            } as ExecutionResult))
        )
    }

}
