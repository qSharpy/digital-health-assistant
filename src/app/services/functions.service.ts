import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProcessResponse } from '../models/process-response';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(private http: HttpClient) { }

  process(message: ChatMessage) {
    return this.http.post<ProcessResponse>(environment.firebase.fct_processUrl, message);
  }
}
