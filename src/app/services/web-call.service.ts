import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebCallService {
  isInCall: boolean;
  private speechRecognition: SpeechRecognition;
  private speechSynthesis: SpeechSynthesis;
  private sttSubject = new Subject<SttResultWithDate>();
  private firstTime = true;

  constructor() {
    const w = window as any;
    w.SpeechRecognition = w.webkitSpeechRecognition || w.SpeechRecognition;
    this.speechSynthesis = w.webkitSpeechSynthesis || w.speechSynthesis;
    this.speechRecognition = new w.SpeechRecognition();
    this.speechRecognition.interimResults = false;
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = 'en-US';
  }

  startCall(initialMessage: string = 'Hello!'): Observable<string> {
    this.isInCall = true;
    this.speechRecognition.onresult = e => {
      if (e.results[e.results.length - 1].isFinal) {
        this.sttSubject.next({transcript: e.results[e.results.length - 1][0].transcript, ts: new Date().getTime()});
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
      // this.speechRecognition.start();
    });
    return this.sttSubject.asObservable().pipe(
      distinctUntilChanged((x, y) => {
        return x.transcript === y.transcript && Math.abs(x.ts - y.ts) < 1000;
      }),
      map(x => x.transcript)
    );
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
        setTimeout(() => {
          this.speechRecognition.start();
        }, 100);
      }
      ttsSubject.next(message);
      ttsSubject.complete();
    };
    this.speechSynthesis.speak(utterance);
    return ttsSubject.asObservable();
  }
}

interface SttResultWithDate {
  transcript: string;
  ts: number;
}
