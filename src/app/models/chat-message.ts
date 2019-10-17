export interface ChatMessage {
  text: string;
  context?: string;
  previousUserMessages?: string;
}
