import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebCallService {
  isInCall: boolean;
  private speechRecognition: SpeechRecognition;
  private sttSubject = new Subject<string>();

  constructor() {
    const w = window as any;
    w.SpeechRecognition = w.webkitSpeechRecognition || w.SpeechRecognition;
    this.speechRecognition = new w.SpeechRecognition();
    this.speechRecognition.interimResults = false;
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = 'en-US';
  }

  startCall(): Observable<string> {
    this.speechRecognition.onresult = e => {
      if (e.results[e.results.length - 1].isFinal) {
        this.sttSubject.next(e.results[e.results.length - 1][0].transcript);
      }
    };
    this.speechRecognition.onerror = e => {
      this.sttSubject.error(e);
      this.sttSubject.complete();
      this.hangup();
    };
    this.speechRecognition.start();
    this.isInCall = true;
    return this.sttSubject.asObservable();
  }

  hangup(): void {
    this.speechRecognition.stop();
    this.isInCall = false;
  }
}
