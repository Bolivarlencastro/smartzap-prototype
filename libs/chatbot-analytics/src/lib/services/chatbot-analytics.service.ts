import { Injectable } from '@angular/core';
import { AskQuestionDto, ChatbotAnalyticsApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { saveAs } from 'file-saver-es';
import { map, Observable } from 'rxjs';
import { ChatMessage } from '../models';

@Injectable()
export class ChatbotAnalyticsService {
  constructor(private readonly chatbotApi: ChatbotAnalyticsApi) {}

  startAgent(report_id: string): Observable<string> {
    return this.chatbotApi.startAgent(report_id).pipe(map((res) => res.analysis_token));
  }

  sendMessage(text: string, token: string): Observable<AskQuestionDto> {
    return this.chatbotApi.askQuestion(text, token);
  }

  generateFollowupQuestions(answer: AskQuestionDto, analysisToken: string): Observable<ChatMessage> {
    return this.chatbotApi
      .generateFollowupQuestions(analysisToken)
      .pipe(map(({ questions }) => this.buildInteractiveAnswer(questions, answer)));
  }

  generateTable(token: string): Observable<ChatMessage> {
    return this.chatbotApi.generateTable(token).pipe(map((res) => this.buildVisualAnswer(res, 'table')));
  }

  generatePlot(token: string): Observable<ChatMessage> {
    return this.chatbotApi.generatePlot(token).pipe(map((res) => this.buildVisualAnswer(res, 'plot')));
  }

  downloadCSV(token: string): Observable<string> {
    return this.chatbotApi.downloadCSV(token);
  }

  saveCSV(csv: string) {
    const filename = `ai_data_${Date.now()}.csv`;
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, filename);
  }

  private buildInteractiveAnswer(questions: string[], answer: AskQuestionDto): ChatMessage {
    return {
      sender: 'bot',
      time: Date.now(),
      type: 'interactive',
      questionToken: answer.question_token,
      text: answer.summary,
      followupQuestions: questions,
    };
  }

  private buildVisualAnswer(data: unknown, type: 'table' | 'plot'): ChatMessage {
    return {
      sender: 'bot',
      time: Date.now(),
      type,
      data,
    };
  }
}
