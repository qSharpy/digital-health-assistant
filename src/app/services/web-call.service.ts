import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebCallService {
  isInCall: boolean;

  constructor() { }

  startCall(): void {
    this.isInCall = true;
  }

  hangup(): void {
    this.isInCall = false;
  }
}
