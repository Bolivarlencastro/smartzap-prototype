import { Injectable } from '@angular/core';
import { AuthService, CourseExamsApi, QuestionRequest } from '@keeps-platform-frontend-workspace/kp-keeps';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  constructor(
    private courseExamApi: CourseExamsApi,
    private authService: AuthService,
  ) {}

  fetchExam(examId: string) {
    return this.courseExamApi.fetchExam(examId);
  }

  fetchExamAnswers(examId: string, enrollmentId: string) {
    const userId = this.authService.userId;
    return this.courseExamApi.getExamAnswers(examId, userId, enrollmentId).pipe(map((response) => response.results));
  }

  saveAnswer(answer: QuestionRequest, examId: string, enrollmentId?: string) {
    return this.courseExamApi.saveExamAnswer(examId, answer, enrollmentId);
  }
}
