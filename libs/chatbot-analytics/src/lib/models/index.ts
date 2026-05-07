export interface ChatMessage {
  sender: 'user' | 'bot';
  time: number;
  type: 'text-only' | 'table' | 'interactive' | 'plot';
  questionToken?: string;
  data?: unknown;
  text?: string;
  followupQuestions?: string[];
}

export interface ChatbotViewModel {
  initialState: boolean;
  initialLoading: boolean;
  chat: ChatMessage[];
  isLoading: boolean;
}
