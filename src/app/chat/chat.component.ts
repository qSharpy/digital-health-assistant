import { Component, OnInit, ViewChild, NgZone, ElementRef, AfterViewInit } from '@angular/core';
import { FunctionsService } from '../services/functions.service';
import { HealthChatAdapter } from './health.chat-adapter';
import { WordProcessorService } from '../services/word-processor.service';
import { ChatService } from '../services/chat.service';
import { WebCallService } from '../services/web-call.service';
import { Subscription, timer } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  userId = 999;
  adapter: HealthChatAdapter;
  private darkTheme: boolean;
  chatTheme = 'light-theme';
  buttonColor = 'primary';
  phoneColor = 'primary';
  private sub: Subscription;
  expanded = true;

  @ViewChild('chat', { static: true, read: ElementRef }) chat: ElementRef<HTMLElement>;

  constructor(
    fctService: FunctionsService,
    private wps: WordProcessorService,
    private cs: ChatService,
    private auth: AuthService,
    public wcs: WebCallService,
    private zone: NgZone
  ) {
    this.adapter = new HealthChatAdapter(fctService, wps, cs, wcs, auth);
  }

  ngOnInit() {

    setTimeout(() => {
      this.adapter.receiveMessage(this.cs.initialMessage);
    }, 1000);
  }

  ngAfterViewInit() {

    timer(1000).subscribe(() => this.expandChat());
  }

  onThemeChanged() {
    this.darkTheme = !this.darkTheme;
    this.chatTheme = this.darkTheme ? 'dark-theme' : 'light-theme';
    this.buttonColor = this.darkTheme ? 'accent' : 'primary';
    this.phoneColor = this.wcs.isInCall
      ? 'warn'
      : this.darkTheme
        ? 'accent'
        : 'primary';
  }

  startOrEndWebCall() {
    if (this.wcs.isInCall) {
      // hangup
      if (this.sub != null) {
        this.sub.unsubscribe();
      }
      this.wcs.hangup();
      this.phoneColor = this.buttonColor;
    } else {
      // call
      this.sub = this.wcs.startCall().subscribe(newMessage => {
        this.zone.run(() => {
          this.adapter.sendMessageFromAudio(newMessage);
        });
      });
      this.phoneColor = 'warn';
    }
  }

  onImageUpload(event) {
    console.log(event.target.files);
  }

  toggleChat() {

    this.expanded = !this.expanded;

    if (this.expanded) {
      this.expandChat();
    } else {
      this.compressChat();
    }
  }

  private expandChat() {
    const elemnt = this.chat.nativeElement.getElementsByClassName('ng-chat-window');

    elemnt.item(0).classList.add('maximized-chat');
  }

  private compressChat() {
    const elemnt = this.chat.nativeElement.getElementsByClassName('ng-chat-window');

    elemnt.item(0).classList.remove('maximized-chat');
  }
}
