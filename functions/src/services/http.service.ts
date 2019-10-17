import { Observable, Subject } from "rxjs";
import * as request from "request";
import * as functions from "firebase-functions";

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

export function setCorsHeaders(response: functions.Response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
}
