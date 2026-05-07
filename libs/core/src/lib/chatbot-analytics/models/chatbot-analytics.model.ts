export interface StartAgentDto {
  analysis_token: string;
}

export interface AskQuestionDto {
  question_token: string;
  summary: string;
}

export interface FollowupQuestionDto {
  questions: string[];
}

export interface ChatbotDialogData {
  report_id: string;
  name: string;
}
