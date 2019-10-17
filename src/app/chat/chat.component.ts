import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { FunctionsService } from "../services/functions.service";
import { HealthChatAdapter } from "./health.chat-adapter";
import { WordProcessorService } from "../services/word-processor.service";
import { ChatService } from "../services/chat.service";
import { WebCallService } from "../services/web-call.service";
import { Subscription } from "rxjs";
import { NgChat } from "ng-chat/ng-chat/ng-chat.component";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
  userId = 999;
  adapter: HealthChatAdapter;
  private darkTheme: boolean;
  chatTheme = "light-theme";
  buttonColor = "primary";
  phoneColor = "primary";
  private sub: Subscription;
  @ViewChild("chat", { static: true }) chat: NgChat;

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

  onThemeChanged() {
    this.darkTheme = !this.darkTheme;
    this.chatTheme = this.darkTheme ? "dark-theme" : "light-theme";
    this.buttonColor = this.darkTheme ? "accent" : "primary";
    this.phoneColor = this.wcs.isInCall
      ? "warn"
      : this.darkTheme
      ? "accent"
      : "primary";
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
      this.phoneColor = "warn";
    }
  }
}
