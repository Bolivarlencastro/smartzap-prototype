import { UserCreator } from '@core/model/user.model';
import { Exam, Question } from '@core/model/exam';
import { Enrollment } from '@core/model/enrollment.model';
import { QuizQuestion } from '@keeps-platform-frontend-workspace/ui/kp-quiz-form';

export interface Pulse {
  id?: string;
  rating_avg?: number;
  rating_count?: number;
  channels?: PulseChannel[];
  name: string;
  description?: string;
  holder_image?: string;
  learn_content_uuid: string;
  created_date: string;
  updated_date: string;
  user_creator: UserCreator;
  pulse_type: PulseType;
  duration_time: number;
  points?: number;
  bookmark_id?: string;
  favorite?: PulseFavorite;
  exam?: Exam;
  channel?: PulseChannel;
  isOwner?: boolean;
  consume_time_in?: number;
  consumed: boolean;
  enrollment?: Enrollment;
  views?: number;
  is_active?: boolean;
}

export interface PulseFavorite {
  id: string;
}

export interface PulseChannel {
  id: string;
  name: string;
  category: string;
}

export interface PulseBookmark {
  id?: string;
  created_date?: string;
  updated_date?: string;
  pulse?: Pulse | string;
  user: string;
}

export interface PulseType {
  id?: string;
  name: string;
  description?: string;
  image: string;
  image_cover: string;
  created_date?: string;
  updated_date?: string;
  checked?: boolean;
}

export interface PulseComment {
  comment: string;
  created_date?: string;
  id?: string;
  pulse: string;
  updated_date?: string;
  user: string;
}

export interface PulseRating {
  created_date?: string;
  id?: string;
  pulse: string;
  rating: number;
  updated_date?: string;
  user: string;
}

export interface PulsesFilter {
  name?: string;
  channel_category?: string | string[];
  language?: string | string[];
  bookmarked?: string;
  pulse_type?: string | string[];
  subscribed?: string;
  search?: string;
  ordering?: string;
  page?: number;
  per_page?: number;
  is_active?: boolean;
}

export class PulsesTypesFilters {
  search?: string;
  ordering?: string;
  page?: number;
  per_page?: number;
}

export class PulsesBookmarksFilters {
  user?: string;
  pulse?: string;
  search?: string;
  ordering?: string;
  page?: number;
  per_page?: number;
  pulse_type?: string | Array<string>;
}

export class PulseCommentsFilters {
  pulse_id?: string;
  search?: string;
  ordering?: string;
  page?: number;
  per_page?: number;
}

export interface PulseQuizAnswer {
  is_ok: boolean;
  correct_options: string[];
  /** The option IDs chosen by the user — named `options` to match the KpQuizFormComponent template. */
  options: string[];
}

export interface ActivePulseQuestion {
  index: number;
  question: QuizQuestion;
  answer: PulseQuizAnswer | null;
  answered: boolean;
  isInvalid?: boolean;
}

export interface PulseRequest {
  name: string;
  exam: ExamRequest;
}

export interface ExamRequest {
  title: string;
  questions: Question[];
}
