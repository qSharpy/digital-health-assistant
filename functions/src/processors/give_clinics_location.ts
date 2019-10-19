import { Processor, ExecutionResult, ProcessorContext } from "./processor";
import { Observable } from "rxjs";
import {  getAllClinicsByAddress } from "../clinics";
import { map, switchMap } from "rxjs/operators";
import { addressToPoint } from "../geocoding";

export class GiveClinicsLocationProcessor extends Processor {

  constructor(context: ProcessorContext) {
    super(context);
  }

  execute(): Observable<ExecutionResult> {
    return addressToPoint(this.context.messageLower).pipe(
      switchMap(latLng => getAllClinicsByAddress(+latLng.lat, +latLng.lng)),
      map(clinics => {
        return {
          isPositiveAnswer: clinics.length > 0,
          dataForReplacing: [clinics.map(x => x.name).join(', ')]
        } as ExecutionResult;
      })
    );
  }

}
