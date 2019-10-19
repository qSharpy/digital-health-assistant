export interface ChatMessage {
  text: string;
  context?: string;
  previousUserMessages?: string;
  previousUserContexts?: string;
  lastResponseFromContext?: string;
  phoneNo?: string;
  email?: string;
}
