import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  constructor(private http: HttpClient) { }

  startCallFlow(phoneNo: string, userName: string = null) {
    let url = `${environment.twillio.startFlowFunction}?phoneNo=${phoneNo}`;
    if (userName != null) {
      url += `&userName=${userName}`;
    }
    return this.http.get(url);
  }
}
