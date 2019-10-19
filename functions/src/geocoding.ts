import * as functions from "firebase-functions";
import * as request from 'request';
import { setCorsHeaders } from "./services/http.service";
import { Observable, Subject } from "rxjs";
import { LatLng } from "./models/lat-lng";
import { map } from "rxjs/operators";

export const geocoding = functions.https.onRequest((req, res) => {
  setCorsHeaders(res);
  addressToPoint(req.query.address).subscribe(latLng => {
    res.send(latLng);
  }, e => {
    res.status(400).send(e);
  });
});

export function addressToPoint(address: string): Observable<LatLng> {
  const subj = new Subject<any>();
  request.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDKRl6kxuv6RKhOFvRGcG63fnXy4P7fj_E`,
    { json: true },
    (err, resp, body) => {
      if (err) {
        subj.error(err);
        return;
      }
      subj.next(body);
    });
  return subj.asObservable().pipe(map(body => {
    if (body.status.toLowerCase() !== 'ok') {
      throw new Error('Geocoding failed.');
    }
    if (body.results == null || body.results.length === 0) {
      throw new Error('Geocoding failed.');
    }
    const goodResult = body.results[0].geometry.location;
    return {lat: +goodResult.lat, lng: +goodResult.lng} as LatLng;
  }));
}

