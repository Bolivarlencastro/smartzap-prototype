import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AskQuestionDto, FollowupQuestionDto, StartAgentDto } from '../models';
import { ChatbotAnalyticsClient } from './chatbot-analytics.client';

@Injectable({
  providedIn: 'root',
})
export class ChatbotAnalyticsApi {
  constructor(private readonly http: ChatbotAnalyticsClient) {}

  startAgent(report_id: string): Observable<StartAgentDto> {
    return this.http.post<StartAgentDto>(`/start-session`, { report_id });
  }

  askQuestion(question: string, analysis_token: string): Observable<AskQuestionDto> {
    return this.http.post<AskQuestionDto>('/ask-question', {
      question,
      analysis_token,
    });
  }

  generateFollowupQuestions(analysis_token: string): Observable<FollowupQuestionDto> {
    return this.http.post<FollowupQuestionDto>('/followup-questions', { analysis_token });
  }

  generateTable(question_token: string): Observable<string> {
    return this.http.post<string>('/generate-table', { question_token });
  }

  generatePlot(question_token: string): Observable<string> {
    return this.http.post<string>('/generate-plot', { question_token });
  }

  downloadCSV(question_token: string): Observable<string> {
    return this.http.downloadCSV('post', '/download-csv', { question_token });
  }
}
