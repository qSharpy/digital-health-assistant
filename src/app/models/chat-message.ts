export interface ChatMessage {
  text: string;
  context?: string;
  previousUserMessages?: string;
  phoneNo?: string;
  email?: string;
}
