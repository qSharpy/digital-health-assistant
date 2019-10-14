import { ChatAdapter, Message, ParticipantResponse, ChatParticipantType, ChatParticipantStatus, IChatParticipant } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { FunctionsService } from '../services/functions.service';
import { WordProcessorService } from '../services/word-processor.service';
import { ChatService } from '../services/chat.service';
import { switchMap } from 'rxjs/operators';

export class HealthChatAdapter extends ChatAdapter {
  private chatHistory: Message[] = [];
  private botParticipant: IChatParticipant = {
    participantType: ChatParticipantType.User,
    id: 1,
    displayName: 'Bot',
    avatar: 'https://66.media.tumblr.com/avatar_9dd9bb497b75_128.png',
    status: ChatParticipantStatus.Online
  };

  constructor(private fctService: FunctionsService, private wordProcessorService: WordProcessorService, private chatService: ChatService) {
    super();

    this.chatService.onChatCleared.subscribe(() => {
      this.chatHistory = [];
    });
  }


  listFriends(): Observable<ParticipantResponse[]> {
    return of([
      {
        metadata: {},
        participant: this.botParticipant
      } as ParticipantResponse
    ]);
  }
  getMessageHistory(destinataryId: any): Observable<Message[]> {
    return of(this.chatHistory);
  }

  sendMessage(message: Message): void {
    const lowerMessage = message.message.toLowerCase();
    this.chatService.allUserSentences.push(lowerMessage);
    this.chatHistory.push(message);
    this.wordProcessorService.process(lowerMessage).pipe(
      switchMap(x => x != null ? of(x) : this.fctService.process(lowerMessage))
    ).subscribe(say => {
      this.receiveMessage(say);
    });
  }

  receiveMessage(say: string) {
    const replyMessage = {
      dateSent: new Date(),
      fromId: 1,
      toId: 999,
      message: say
    };
    this.chatHistory.push(replyMessage);
    this.onMessageReceived(this.botParticipant, replyMessage);
  }

  sendStringMessage(messageText: string) {
    this.sendMessage({
      dateSent: new Date(),
      fromId: 999,
      toId: 1,
      message: messageText
    });
  }

}
