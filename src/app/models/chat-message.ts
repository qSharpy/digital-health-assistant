export interface ChatMessage {
  text: string;
  context?: string;
  previousUserMessages?: string;
  lastResponseFromContext?: string;
  phoneNo?: string;
  email?: string;
}
