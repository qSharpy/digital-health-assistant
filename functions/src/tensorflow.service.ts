import {Observable, of} from 'rxjs';


export class TensorFlowService {

  constructor() {}

  process(message: string): Observable<string> {
    return of('test');
  }
}
