import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(private http: HttpClient) { }

  process(message: string) {
    return this.http.post<ProcessResponse>(environment.firebase.processFunction, { text: message }).pipe(map(x => x.say));
  }
}

interface ProcessResponse {
  say: string;
}
