import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable } from "rxjs";
import { getClinicByName } from "../clinics";
import { map } from "rxjs/operators";

export class AddClinicAppointmentForUser extends Processor {

    constructor(context: ProcessorContext) {
        super(context);
    }

    execute(): Observable<ExecutionResult> {
        console.log("prev messages");
        console.log(this.context.previousUserMessages);
        const clinicName = this.context.previousUserMessages[this.context.previousUserMessages.length - 1];
        console.log(clinicName);
        return getClinicByName(clinicName).pipe(map(clinic => {
            console.log(clinic.name);
            return {
                isPositiveAnswer: clinic !== undefined,
                dataForReplacing: [clinic.name]
            } as ExecutionResult;
        }));
    }

}
