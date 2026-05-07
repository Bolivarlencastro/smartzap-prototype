import { inject, Injectable } from '@angular/core';
import { KonquestClient } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Observable } from 'rxjs';
import {
  AnswerInput,
  AnswerOutput,
  QuestionBankFilters,
  QuestionBankOutput,
  QuestionConsumerOutput,
  QuizConsumerOutput,
  QuizInput,
  QuizOutput,
  QuizScoreOutput,
} from '../models/quiz';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly quizzes = '/quizzes';
  private readonly questionBank = '/question-bank';
  private readonly http = inject(KonquestClient);

  // ── Quiz management (super_admin | admin | content only) ───────────────────

  /**
   * Creates a quiz. Exactly one context must be provided:
   * - `stage`: links to a mission stage (a MissionStageContent is created automatically).
   * - `channel_id`: creates a new pulse inside the channel (pulse name derived from quiz title).
   */
  createQuiz(payload: QuizInput): Observable<QuizOutput> {
    return this.http.post<QuizOutput>(this.quizzes, payload);
  }

  /**
   * Full quiz representation for content managers: all questions with text, options,
   * and `correct_answer` flags. Never call this for student-facing screens — use
   * `getQuizAsConsumer` instead.
   */
  getQuiz(id: string): Observable<QuizOutput> {
    return this.http.get<QuizOutput>(`${this.quizzes}/${id}`);
  }

  /**
   * Full replacement (PUT) of a quiz. Context fields (`stage`, `channel_id`, `pulse`)
   * are immutable after creation — passing a different value raises a 422.
   * Passing the same value or null is accepted and treated as a no-op.
   */
  updateQuiz(id: string, payload: QuizInput): Observable<QuizOutput> {
    return this.http.put<QuizOutput>(`${this.quizzes}/${id}`, payload);
  }

  deleteQuiz(id: string): Observable<void> {
    return this.http.delete<void>(`${this.quizzes}/${id}`);
  }

  // ── Quiz consumption (all authenticated users) ─────────────────────────────
  //
  // Consumer flow:
  //   1. getQuizAsConsumer(id)            → ordered list of question IDs
  //   2. getQuestion(quizId, questionId)  → question text + options (no correct_answer)
  //   3. submitAnswer(quizId, questionId) → submit selected options
  //   4. getScore(quizId)                 → score scoped to the authenticated user

  /**
   * Returns the consumer-facing quiz payload: `id`, `title`, and the ordered list of
   * question IDs that will be shown to this user.
   */
  getQuizAsConsumer(id: string): Observable<QuizConsumerOutput> {
    return this.http.get<QuizConsumerOutput>(`${this.quizzes}/${id}/consume`);
  }

  /**
   * Returns a single question for consumer navigation: question text and options
   * without the `correct_answer` flag.
   *
   * `enrollmentId` is required for mission quizzes. Must be omitted for pulse quizzes.
   */
  getQuestion(quizId: string, questionId: string, enrollmentId?: string): Observable<QuestionConsumerOutput> {
    const params = enrollmentId ? { enrollment_id: enrollmentId } : undefined;
    return this.http.get<QuestionConsumerOutput>(`${this.quizzes}/${quizId}/questions/${questionId}`, params);
  }

  submitAnswer(quizId: string, questionId: string, payload: AnswerInput): Observable<AnswerOutput> {
    return this.http.post<AnswerOutput>(`${this.quizzes}/${quizId}/questions/${questionId}/answer`, payload);
  }

  /**
   * Returns the authenticated user's score for a quiz.
   *
   * `enrollmentId` is required for mission quizzes. Must be omitted for pulse quizzes.
   */
  getScore(quizId: string, enrollmentId?: string): Observable<QuizScoreOutput> {
    const params = enrollmentId ? { enrollment_id: enrollmentId } : undefined;
    return this.http.get<QuizScoreOutput>(`${this.quizzes}/${quizId}/score`, params);
  }

  // ── Question Bank (super_admin | admin | content only) ─────────────────────

  getQuestionBank(filters?: QuestionBankFilters): Observable<QuestionBankOutput[]> {
    const params: Record<string, string> = {};
    if (filters?.title) {
      params['title'] = filters.title;
    }
    if (filters?.tag) {
      params['tag'] = filters.tag;
    }
    return this.http.get<QuestionBankOutput[]>(this.questionBank, Object.keys(params).length ? params : undefined);
  }

  deleteQuestionFromBank(id: string): Observable<void> {
    return this.http.delete<void>(`${this.questionBank}/${id}`);
  }

  addTagToQuestion(id: string, payload: { tag: string }): Observable<{ id: string; tag: string }> {
    return this.http.post<{ id: string; tag: string }>(`${this.questionBank}/${id}/tags`, payload);
  }

  removeTagFromQuestion(id: string, tagId: string): Observable<void> {
    return this.http.delete<void>(`${this.questionBank}/${id}/tags/${tagId}`);
  }
}
