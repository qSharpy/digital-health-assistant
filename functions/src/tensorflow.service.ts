import {Observable, of} from 'rxjs';


export class TensorFlowService {

  constructor() {}

  process(message: string): Observable<string> {
    console.log(message);
    return of('test');
  }
}
