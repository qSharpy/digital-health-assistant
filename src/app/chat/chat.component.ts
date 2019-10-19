import { Component, OnInit, ViewChild, NgZone, ElementRef, AfterViewInit } from '@angular/core';
import { FunctionsService } from '../services/functions.service';
import { HealthChatAdapter } from './health.chat-adapter';
import { WordProcessorService } from '../services/word-processor.service';
import { ChatService } from '../services/chat.service';
import { WebCallService } from '../services/web-call.service';
import { Subscription, timer } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { VisionUploadService } from '../services/vision-upload.service';
import { map, tap } from 'rxjs/operators';

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
    private zone: NgZone,
    private vision: VisionUploadService
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
    const file = event.target.files[0];
    console.log(file);
    this.vision.callGoogleVisionAPI(file).pipe(
      map(val => val.responses[0].fullTextAnnotation.text as string))
      .subscribe(text => {

        console.log(text);

        const initString = '6. Symptomatology at the time of medical examination and its debut:';
        const initIndex = text.indexOf(initString) + initString.length;

        const finalString = '7. Presumably for current events';
        const finalIndex = text.indexOf(finalString);

        console.log(initIndex, finalIndex);

        const result = text.substring(initIndex, finalIndex);

        console.log(result.split('-'));
      });
  }

  private removeNewLineAndSpaces(text: string): string {
    return text.replace('/\r?\n|\r/g', '').replace(/\s+/g, '');
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
