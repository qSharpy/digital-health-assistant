import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  allUserSentences: string[] = [];
  private clearSubject = new Subject<boolean>();

  constructor() { }

  clearChat() {
    this.clearSubject.next(true);
  }

  get onChatCleared() {
    return this.clearSubject.asObservable();
  }

  get initialMessage() {
    return 'Hi! You can even say "call *phone no*"!';
  }
}
