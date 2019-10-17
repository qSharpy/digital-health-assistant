import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { TwilioService } from './twilio.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcessResponse } from '../models/process-response';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class WordProcessorService {

  constructor(private chatService: ChatService, private tws: TwilioService) { }

  process(message: ChatMessage): Observable<ProcessResponse> {
    switch (message.text) {
      case 'clear':
        this.chatService.clearChat();
        return of({
          say: 'Let\'s start fresh.'
        } as ProcessResponse);
    }

    if (message.text.includes('call ')) {
      const phoneNo = message.text.replace('call ', '');
      const userName = null; // get this from account, here
      return this.tws.startCallFlow(phoneNo, userName).pipe(map(() => {
        return {
          say: 'Calling you in a second.'
        } as ProcessResponse;
      }));
    }

    return of(null);
  }
}
