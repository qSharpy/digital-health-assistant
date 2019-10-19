import {
  ChatAdapter,
  Message,
  ParticipantResponse,
  ChatParticipantType,
  ChatParticipantStatus,
  IChatParticipant
} from 'ng-chat';
import { Observable, of } from 'rxjs';
import { FunctionsService } from '../services/functions.service';
import { WordProcessorService } from '../services/word-processor.service';
import { ChatService } from '../services/chat.service';
import { switchMap, catchError } from 'rxjs/operators';
import { WebCallService } from '../services/web-call.service';
import { ProcessResponse } from '../models/process-response';
import { ChatMessage } from '../models/chat-message';
import { AuthService } from '../services/auth.service';
import { Account } from '../models/account';

export class HealthChatAdapter extends ChatAdapter {
  private chatHistory: Message[] = [];
  private user: Account;
  private botParticipant: IChatParticipant = {
    participantType: ChatParticipantType.User,
    id: 1,
    displayName: 'Digital Assistant',
    avatar: '/assets/images/bot.png',
    status: ChatParticipantStatus.Online
  };

  constructor(
    private fctService: FunctionsService,
    private wordProcessorService: WordProcessorService,
    private chatService: ChatService,
    private callService: WebCallService,
    private auth: AuthService
  ) {
    super();

    this.chatService.onChatCleared.subscribe(() => {
      this.chatHistory = [];
    });

    this.auth.loggedInUserAccount.subscribe(account => {
      console.log(account);
      this.user = account;
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
    this.chatHistory.push(message);
    const obj = {
      text: lowerMessage,
      context: this.chatService.lastContext,
      previousUserMessages: this.chatService.allUserSentencesAsString,
      previousUserContexts: this.chatService.allUserContextsAsString,
      lastResponseFromContext: this.chatService.lastResponseFromContext,
      email: this.user != null ? this.user.email : null,
      phoneNo: this.user != null ? this.user.phoneNumber : null
    } as ChatMessage;
    this.chatService.allUserSentences.push(lowerMessage);
    this.wordProcessorService
      .process(obj)
      .pipe(
        switchMap(x => (x != null ? of(x) : this.fctService.process(obj))),
        catchError(e => {
          return of(e.error.say as ProcessResponse);
        })
      )
      .subscribe(say => {
        this.chatService.lastContext = say.context;
        this.chatService.lastResponseFromContext = say.lastResponseFromContext;
        this.chatService.allUserContexts.push(say.lastResponseFromContext == null ? '' : say.lastResponseFromContext);
        this.receiveMessage(say.say);
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

  sendMessageFromAudio(say: string) {
    const msg = {
      dateSent: new Date(),
      fromId: 999,
      toId: 1,
      message: say
    };
    this.chatHistory.push(msg);
    this.onMessageReceived(this.botParticipant, msg);
    const lowerMessage = msg.message.toLowerCase();
    const obj = {
      text: lowerMessage,
      context: this.chatService.lastContext,
      lastResponseFromContext: this.chatService.lastResponseFromContext,
      previousUserMessages: this.chatService.allUserSentencesAsString,
      previousUserContexts: this.chatService.allUserContextsAsString,
      email: this.user != null ? this.user.email : null,
      phoneNo: this.user != null ? this.user.phoneNumber : null
    } as ChatMessage;
    this.chatService.allUserSentences.push(say);
    this.wordProcessorService
      .process(obj)
      .pipe(
        switchMap(x => (x != null ? of(x) : this.fctService.process(obj))),
        catchError(e => {
          return of(e.error.say as ProcessResponse);
        })
      )
      .subscribe(x => {
        this.chatService.lastContext = x.context;
        this.chatService.lastResponseFromContext = x.lastResponseFromContext;
        this.chatService.allUserContexts.push(x.lastResponseFromContext == null ? '' : x.lastResponseFromContext);
        this.callService.speak(x.say).subscribe(() => { });
        this.receiveMessage(x.say);
      });
  }
}
