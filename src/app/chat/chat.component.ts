import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FunctionsService } from '../services/functions.service';
import { HealthChatAdapter } from './health.chat-adapter';
import { WordProcessorService } from '../services/word-processor.service';
import { ChatService } from '../services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  userId = 999;
  adapter: HealthChatAdapter;
  @ViewChild('chat', { static: true, read: ElementRef }) chat: ElementRef<HTMLElement>;

  constructor(fctService: FunctionsService, private wps: WordProcessorService, private cs: ChatService) {
    this.adapter = new HealthChatAdapter(fctService, wps, cs);
  }

  ngOnInit() {
    setTimeout(() => {
      this.adapter.receiveMessage(this.cs.initialMessage);
    }, 1000);
  }

}
