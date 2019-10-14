import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebCallService {
  isInCall: boolean;
  private speechRecognition: SpeechRecognition;
  private speechSynthesis: SpeechSynthesis;
  private sttSubject = new Subject<string>();

  constructor() {
    const w = window as any;
    w.SpeechRecognition = w.webkitSpeechRecognition || w.SpeechRecognition;
    w.SpeechSynthesis = w.webkitSpeechSynthesis || w.SpeechSynthesis;
    this.speechRecognition = new w.SpeechRecognition();
    this.speechSynthesis = new w.SpeechSynthesis();
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

  speak(message: string) {
    const utterance = new SpeechSynthesisUtterance(message);
    this.speechSynthesis.speak(utterance);
  }
}
