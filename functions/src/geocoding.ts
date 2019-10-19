import * as functions from "firebase-functions";
import { setCorsHeaders } from "./services/http.service";
import { Observable, of } from "rxjs";
import { LatLng } from "./models/lat-lng";

export const geocoding = functions.https.onRequest((req, res) => {
    setCorsHeaders(res);
    addressToPoint(req.query.address).subscribe(latLng => {
      res.send(latLng);
    }, e => {
      res.status(400).send(e);
    });
});

export function addressToPoint(address: string): Observable<LatLng> {
  return of({lat: 1, lng: 2} as LatLng);
}

