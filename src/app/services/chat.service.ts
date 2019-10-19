import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  allUserSentences: string[] = [];
  lastContext: string;
  lastResponseFromContext: string;
  private clearSubject = new Subject<boolean>();

  constructor() { }

  clearChat() {
    this.lastContext = null;
    this.allUserSentences = [];
    this.clearSubject.next(true);
  }

  get onChatCleared() {
    return this.clearSubject.asObservable();
  }

  get initialMessage() {
    return 'Hi! You can even say "call *phone no*"!';
  }

  get allUserSentencesAsString() {
    let result = ['start'];
    result = result.concat(this.allUserSentences);
    return result.join('^');
  }

}
