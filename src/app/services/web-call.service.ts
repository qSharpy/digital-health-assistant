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
    this.speechSynthesis = w.webkitSpeechSynthesis || w.speechSynthesis;
    this.speechRecognition = new w.SpeechRecognition();
    this.speechRecognition.interimResults = false;
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = 'en-US';
  }

  startCall(initialMessage: string = 'Hi'): Observable<string> {
    this.isInCall = true;
    this.speechRecognition.onresult = e => {
      if (e.results[e.results.length - 1].isFinal) {
        this.sttSubject.next(e.results[e.results.length - 1][0].transcript);
      }
    };
    this.speechRecognition.onerror = e => {
      if (e.error !== 'no-speech') {
        this.sttSubject.error(e);
        this.sttSubject.complete();
        this.hangup();
      }
    };
    this.speak(initialMessage).subscribe(() => {
      this.speechRecognition.start();
    });
    return this.sttSubject.asObservable();
  }

  hangup(): void {
    this.speechRecognition.stop();
    this.isInCall = false;
  }

  speak(message: string): Observable<string> {
    const ttsSubject = new Subject<string>();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    utterance.onstart = () => {
      if (this.isInCall) {
        this.speechRecognition.stop();
      }
    };
    utterance.onerror = e => {
      ttsSubject.error(e);
      ttsSubject.complete();
    };
    utterance.onend = () => {
      if (this.isInCall) {
        this.speechRecognition.start();
      }
      ttsSubject.next(message);
      ttsSubject.complete();
    };
    this.speechSynthesis.speak(utterance);
    return ttsSubject.asObservable();
  }
}
