import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable } from "rxjs";
import { getClinicByName } from "../clinics";
import { map } from "rxjs/operators";

export class AppointmentProvideDate extends Processor {

    constructor(context: ProcessorContext) {
        super(context);
    }

    execute(): Observable<ExecutionResult> {
        return getClinicByName(this.context.messageLower).pipe(map(clinic => {
            console.log(clinic.name);
            return {
                isPositiveAnswer: clinic !== undefined,
                dataForReplacing: [clinic.name]
            } as ExecutionResult;
        }));
    }

}
