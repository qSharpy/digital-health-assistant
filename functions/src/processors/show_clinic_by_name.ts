import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable } from "rxjs";
import { getClinicByName } from "../clinics";
import { map } from "rxjs/operators";

export class ShowClinicByName extends Processor {

    constructor(context: ProcessorContext) {
        super(context);
    }

    execute(): Observable<ExecutionResult> {
        return getClinicByName(this.context.messageLower).pipe(map(clinics => {
            return {
                isPositiveAnswer: clinics.length > 0,
                dataForReplacing: [clinics.map(x => x.name).join(', ')]
            } as ExecutionResult;
        }));
    }

}
