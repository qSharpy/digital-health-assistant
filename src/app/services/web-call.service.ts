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
  }

  startCall(): Observable<string> {
    this.speechRecognition.onresult = e => {
      this.sttSubject.next(e.results[0][0].transcript);
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
