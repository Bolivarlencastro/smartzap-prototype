import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KonquestClient } from './konquest.client';

// ── Consumer output types ─────────────────────────────────────────────────────

export interface QuizConsumerOutput {
  id: string;
  title: string;
  randomize_questions: boolean;
  randomize_options: boolean;
  /** Ordered list of questions filtered and seeded for this user. */
  questions: QuestionConsumerOutput[];
}

export interface QuestionOptionConsumerOutput {
  id: string;
  option: string;
}

export interface QuestionAnswerState {
  chosen_options: string[];
  is_ok: boolean;
  correct_options: string[];
}

export interface QuestionConsumerOutput {
  id: string;
  question_text: string;
  options: QuestionOptionConsumerOutput[];
  /** Null when the question has not been answered yet. */
  answer: QuestionAnswerState | null;
}

export interface QuizAnswerInput {
  options: string[];
  enrollment_id?: string | null;
}

export interface QuizAnswerOutput {
  id: string;
  options: string[];
  is_ok: boolean;
  correct_options: string[];
  enrollment_id: string | null;
  created_date: string;
}

/**
 * Stateless evaluation result returned by `submitAnswer` when `preview=true`.
 * Nothing is persisted — reflects the correctness of the submitted options only.
 */
export interface AnswerPreviewOutput {
  is_preview: true;
  options: string[];
  is_ok: boolean;
  correct_options: string[];
}

export interface QuizScoreOutput {
  total_questions: number;
  total_correct_answers: number;
  quiz_awarded_score: number;
  quiz_available_score: number;
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class QuizApiService {
  private readonly basePath = '/quizzes';

  constructor(private readonly http: KonquestClient) {}

  /**
   * Returns the ordered list of question IDs for this user.
   * Already filtered by `questions_to_show` and seeded deterministically.
   * `enrollmentId` must be provided for classroom quizzes, omitted for pulse quizzes.
   */
  getQuizAsConsumer(quizId: string, enrollmentId?: string, preview?: boolean): Observable<QuizConsumerOutput> {
    const params: Record<string, string> = {};
    if (enrollmentId) params['enrollment_id'] = enrollmentId;
    if (preview) params['preview'] = 'true';
    return this.http.get<QuizConsumerOutput>(
      `${this.basePath}/${quizId}/consume`,
      Object.keys(params).length ? params : undefined,
    );
  }

  submitAnswer(
    quizId: string,
    questionId: string,
    payload: QuizAnswerInput,
    preview?: boolean,
  ): Observable<QuizAnswerOutput | AnswerPreviewOutput> {
    const params = preview ? { preview: 'true' } : undefined;
    return this.http.post<QuizAnswerOutput | AnswerPreviewOutput>(
      `${this.basePath}/${quizId}/questions/${questionId}/answer`,
      payload,
      params,
    );
  }

  /** `enrollmentId` must be omitted for pulse quizzes. */
  getScore(quizId: string, enrollmentId?: string): Observable<QuizScoreOutput> {
    const params = enrollmentId ? { enrollment_id: enrollmentId } : undefined;
    return this.http.get<QuizScoreOutput>(`${this.basePath}/${quizId}/score`, params);
  }
}
