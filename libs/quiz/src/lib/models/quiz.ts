// ── Input types ───────────────────────────────────────────────────────────────

export interface QuestionOptionInput {
  id?: string;
  option: string;
  correct_answer: boolean;
}

export interface QuestionInput {
  id?: string;
  question_text: string;
  options: QuestionOptionInput[];
  save_to_bank?: boolean;
}

export interface QuizInput {
  title: string;
  /** Link to a mission stage. Mutually exclusive with `channel_id`. */
  stage?: string | null;
  /**
   * Create a new pulse inside this channel. The pulse name is derived from the quiz title.
   * Mutually exclusive with `stage`.
   */
  channel_id?: string | null;
  randomize_questions?: boolean;
  randomize_options?: boolean;
  questions_to_show?: number | null;
  questions: QuestionInput[];
}

export interface AnswerInput {
  options: string[];
  enrollment_id?: string | null;
}

export interface QuestionBankFilters {
  title?: string;
  tag?: string;
}

// ── Output types ──────────────────────────────────────────────────────────────

export interface QuestionOptionOutput {
  id: string;
  option: string;
  correct_answer: boolean;
}

export interface QuestionOutput {
  id: string;
  question_text: string;
  options: QuestionOptionOutput[];
}

/** Full quiz representation returned to admin/manager roles. */
export interface QuizOutput {
  id: string;
  title: string;
  /** Set for stage quizzes; null for pulse quizzes. */
  stage: string | null;
  /** Set for pulse quizzes; null for stage quizzes. */
  pulse: string | null;
  /** Set for pulse quizzes alongside `pulse`; null for stage quizzes. */
  channel_id: string | null;
  randomize_questions: boolean;
  randomize_options: boolean;
  questions_to_show: number | null;
  questions: QuestionOutput[];
}

/**
 * Quiz representation returned to consumer/student roles via GET /quizzes/:id/consume.
 * Contains only question IDs — text and options are intentionally omitted to avoid
 * exposing any answer-related data.
 */
export interface QuizConsumerOutput {
  id: string;
  title: string;
  randomize_questions: boolean;
  randomize_options: boolean;
  questions: string[];
}

/** Option as seen by a consumer — `correct_answer` is intentionally absent. */
export interface QuestionOptionConsumerOutput {
  id: string;
  option: string;
}

/**
 * Answer state restored when the user revisits a question they already answered.
 * `correct_options` is safe to expose here because the result was already revealed at submission time.
 */
export interface QuestionAnswerState {
  chosen_options: string[];
  is_ok: boolean;
  correct_options: string[];
}

/**
 * Single-question payload for consumer navigation.
 * `answer` is `null` when the question has not been answered yet.
 */
export interface QuestionConsumerOutput {
  id: string;
  question_text: string;
  options: QuestionOptionConsumerOutput[];
  answer: QuestionAnswerState | null;
}

export interface AnswerOutput {
  id: string;
  options: string[];
  is_ok: boolean;
  correct_options: string[];
  enrollment_id: string | null;
  created_date: string;
}

export interface QuizScoreOutput {
  total_questions: number;
  total_correct_answers: number;
  quiz_awarded_score: number;
  quiz_available_score: number;
}

export interface QuestionBankOutput {
  id: string;
  question: string;
  options: Array<{ id: string; option: string; correct_answer: boolean }>;
  tags: Array<{ id: string; tag: string }>;
  created_date: string;
}

// ── Store / form layer ────────────────────────────────────────────────────────

/**
 * Internal type used by the NgRx store and quiz form service.
 * Covers both new quizzes (no `id`/`pulse` yet) and loaded quizzes (fields populated from `QuizOutput`).
 * `QuizOutput` is structurally assignable to this type, so API responses can be stored directly.
 */
export type QuizFormModel = QuizInput & { id?: string | null; pulse?: string | null };
