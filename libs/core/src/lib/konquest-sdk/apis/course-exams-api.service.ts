import { Injectable } from '@angular/core';
import { KonquestClient } from './konquest.client';
import { Answer, AnswerDto, CourseExam, Question, QuestionRequest } from '../models';
import { Pagination } from '../../pagination';

@Injectable({ providedIn: 'root' })
export class CourseExamsApi {
  constructor(private _http: KonquestClient) {}

  saveExamAnswer(examId: string, question: QuestionRequest, enrollmentId?: string) {
    const body: AnswerDto = {
      question: question.id,
      options: question.options,
    };

    if (enrollmentId) {
      body.enrollment = enrollmentId;
    }

    return this._http.post<Answer>(`/exams/${examId}/answers`, body);
  }

  getExamAnswers(examId: string, userId: string, enrollmentId: string) {
    return this._http.get<Pagination<Answer>>(`/exams/${examId}/answers`, {
      user__id: userId,
      enrollment__id: enrollmentId,
    });
  }

  fetchExam(examId: string) {
    return this._http.get<CourseExam>(`/exams/${examId}`);
  }

  fetchExamQuestions(examId: string) {
    return this._http.get<Pagination<Question>>(`/exams/${examId}/questions`);
  }
}
