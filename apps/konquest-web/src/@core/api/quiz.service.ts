import { Injectable } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KonquestAPI } from '@core/api';
import { Pagination } from '@core/model';
import { Exam, Question, QuestionRequest } from '@core/model/exam';
import { Answer, AuthService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { forkJoin, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { KonquestExamAPI } from './base';

@Injectable({ providedIn: 'root' })
export class ExamService {
  public static readonly PULSE_TYPE_QUESTION_ID = '7a41a8e0-ee37-4d0b-ad4f-35bada67134d';

  constructor(
    private _http: KonquestAPI,
    private _authService: AuthService,
    private _messageService: KpMessageService,
    private _examAPI: KonquestExamAPI,
  ) {}

  getExam(id: string, params = { per_page: '999' }): any {
    return this._http.get(`/exams/${id}/questions`, params);
  }

  saveExamAnswers(examId: string, answers: any): Observable<any> {
    return this._http.post(`/exams/${examId}/answers/batch`, { questions: answers }).pipe(
      tap(() => this._messageService.success('QUIZ.MESSAGES.ANSWERS_SUCCESSFULLY_SAVED')),
      catchError((error) => {
        this._messageService.error('QUIZ.MESSAGES.ANSWERS_ERROR_SAVED');
        return error;
      }),
    );
  }

  saveExamAnswer(examId: string, question: QuestionRequest, enrollmentId?: string): Observable<Answer> {
    return this._http.post(`/exams/${examId}/answers`, {
      question: question.id,
      ...(enrollmentId && { enrollment: enrollmentId }),
      options: question.options,
    });
  }

  getExamAnswers(examId: string, userId: string, enrollmentId?: string): Observable<Pagination<Answer>> {
    return this._http.get(`/exams/${examId}/answers`, {
      user__id: userId,
      ...(enrollmentId && { enrollment__id: enrollmentId }),
    });
  }

  fetchExam(examId: string): Observable<Exam> {
    return this._http.get(`/exams/${examId}`);
  }

  fetchExamQuestions(examId: string): Observable<Pagination<Question>> {
    return this._examAPI.getExamQuestions(examId);
  }

  createExam(exam: any, channelId: number): Observable<any> {
    let pulseBody: any;
    this._messageService.info(marker('QUIZ.MESSAGES.WAITING_CREATION'));
    return this._examAPI.createPulseExam(exam.title).pipe(
      tap((ex: any) => ({ ...ex, description: exam.description })),
      tap((ex) => (pulseBody = this.buildPulseRequest(ex))),
      switchMap((createdExam) => this.createExamQuestions(exam.questions, createdExam)),
      switchMap(() => this.createPulse(pulseBody)),
      switchMap((pulse: any) => this.createPulseChannelRelationship(pulse.id, channelId)),
      switchMap((response: any) => this.examUpdate(pulseBody.learn_content_uuid, response)),
      catchError((error) => {
        this._messageService.error(marker('QUIZ.MESSAGES.ERROR_CREATE'));
        return error;
      }),
    );
  }

  updateExamQuestion(id: string, questionId: string, question: Question): Observable<Question> {
    return this._examAPI.updateExamQuestion(id, questionId, question);
  }

  private buildPulseRequest(exam: any): any {
    const { title: name, description, id: learn_content_uuid } = exam;
    const pulse_type = ExamService.PULSE_TYPE_QUESTION_ID;
    const user_creator = this._authService.userId;
    return { name, description, learn_content_uuid, pulse_type, user_creator };
  }

  private createExamQuestions(questions: any[], exam: any): Observable<any> {
    const questionsCopy = questions.map((question: any) => ({
      exam_question: question.question,
      question_type: 'correct_choices',
      points: 5,
      options: [
        {
          option: question.fisrtAnswer,
          correct_answer: question.rightAnswer === '1',
        },
        {
          option: question.secondAnswer,
          correct_answer: question.rightAnswer === '2',
        },
        {
          option: question.thirdAnswer,
          correct_answer: question.rightAnswer === '3',
        },
        {
          option: question.fourthAnswer,
          correct_answer: question.rightAnswer === '4',
        },
      ],
    }));

    const URI = `/exams/${exam.id}/questions`;
    const questions$ = questionsCopy.map((question) => this._http.post(URI, { ...question }));

    return forkJoin(questions$);
  }

  private createPulse(pulse: any): Observable<any> {
    return this._http.post('/pulses', {
      ...pulse,
      user_creator: this._authService.userId,
    });
  }

  private createPulseChannelRelationship(pulse: number, channel: number): Observable<any> {
    return this._http.post(`/channels/${channel}/pulses`, { pulse_id: pulse });
  }

  private examUpdate(examId: string, response: { pulse: string; channel: string }): Observable<any> {
    return this._http.patch(`/exams/${examId}`, {
      pulse: response.pulse,
      channel: response.channel,
    });
  }
}
