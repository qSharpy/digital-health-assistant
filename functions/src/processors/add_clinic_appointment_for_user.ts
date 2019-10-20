import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable, from, forkJoin } from "rxjs";
import { getClinicByName, createNewClinicAppointment } from "../clinics";
import { map, switchMap } from "rxjs/operators";
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
            map(val => ({
                isPositiveAnswer: true,
            } as ExecutionResult))
        )
    }

}
