import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { TwilioService } from './twilio.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordProcessorService {

  constructor(private chatService: ChatService, private tws: TwilioService) { }

  process(message: string): Observable<string> {
    switch (message) {
      case 'clear':
        this.chatService.clearChat();
        return of('Hai sa incepem de la capat.');
    }

    if (message.includes('suna la ')) {
      const phoneNo = message.replace('suna la ', '');
      const userName = null; // get this from account, here
      return this.tws.startCallFlow(phoneNo, userName).pipe(map(() => 'Imediat te sun.'));
    }

    return of(null);
  }
}
