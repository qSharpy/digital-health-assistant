import { Observable, Subject } from "rxjs";
import * as request from "request";

export function loadFile<T>(url: string, isJson: boolean = true): Observable<T> {
  const subject = new Subject<T>();
  request(
    url, { json: isJson },
    (err, res, body) => {
      if (err) subject.error(err);
      subject.next(body);
    }
  );
  return subject.asObservable();
}
