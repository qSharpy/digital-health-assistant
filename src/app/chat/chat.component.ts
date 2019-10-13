import { Component, OnInit } from '@angular/core';
import { ChatAdapter } from 'ng-chat';
import { FunctionsService } from '../services/functions.service';
import { HealthChatAdapter } from './health.chat-adapter';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  userId = -1;
  adapter: ChatAdapter;
  constructor(private fctService: FunctionsService) {
    this.adapter = new HealthChatAdapter(fctService);
  }

  ngOnInit() {
  }

}
