import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FunctionsService } from '../services/functions.service';
import { HealthChatAdapter } from './health.chat-adapter';
import { WordProcessorService } from '../services/word-processor.service';
import { ChatService } from '../services/chat.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { WebCallService } from '../services/web-call.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  userId = 999;
  adapter: HealthChatAdapter;
  chatTheme = 'light-theme';
  buttonColor = 'primary';
  phoneColor = 'primary';
  @ViewChild('chat', { static: true, read: ElementRef }) chat: ElementRef<HTMLElement>;

  constructor(fctService: FunctionsService, private wps: WordProcessorService, private cs: ChatService, private wcs: WebCallService) {
    this.adapter = new HealthChatAdapter(fctService, wps, cs);
  }

  ngOnInit() {
    setTimeout(() => {
      this.adapter.receiveMessage(this.cs.initialMessage);
    }, 1000);
  }

  onThemeChanged(event: MatSlideToggleChange) {
    this.chatTheme = event.checked ? 'dark-theme' : 'light-theme';
    this.buttonColor = event.checked ? 'accent' : 'primary';
    this.phoneColor = this.wcs.isInCall ? 'warn' : (event.checked ? 'accent' : 'primary');
  }

  startOrEndWebCall() {
    if (this.wcs.isInCall) {
      // hangup
      this.wcs.hangup();
      this.phoneColor = this.buttonColor;
    } else {
      // call
      this.wcs.startCall().subscribe(newMessage => {
        this.adapter.sendStringMessage(newMessage);
      });
      this.phoneColor = 'warn';
    }
  }
}
