import { ChatAdapter, Message, ParticipantResponse, ChatParticipantType, ChatParticipantStatus, IChatParticipant } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { FunctionsService } from '../services/functions.service';

export class HealthChatAdapter extends ChatAdapter {
  private chatHistory: Message[] = [];
  private botParticipant: IChatParticipant = {
    participantType: ChatParticipantType.User,
    id: 1,
    displayName: 'Bot',
    avatar: 'https://66.media.tumblr.com/avatar_9dd9bb497b75_128.png',
    status: ChatParticipantStatus.Online
  };

  constructor(private fctService: FunctionsService) {
    super();
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
    this.chatHistory.push(message);
    this.fctService.process(message.message).subscribe(say => {
      const replyMessage = {
        dateSent: new Date(),
        fromId: 1,
        toId: 999,
        message: say
      };
      this.chatHistory.push(replyMessage);
      this.onMessageReceived(this.botParticipant, replyMessage);
    });
  }

}
