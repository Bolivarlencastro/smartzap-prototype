import { Mission } from 'app/main/mission/mission.model';

export interface EvaluationQuestion {
  id: number;
  title: string;
  i18n: string;
}

export interface Evaluation {
  id: string;
  question_1_rating: string;
  question_2_rating: string;
  question_3_rating: string;
  question_4_rating: string;
  question_5_rating: string;
  question_6_rating: string;
  nps: string;
  comment?: string;
  sentiment_analysis: string;
  created_date: Date;
  updated_date: Date;
  version: string;
  mission: string | Mission;
  user: { email?: string; name?: string };
  rating_avg?: number;
  questions_rating_avg?: number;
}

export interface RawEvaluation {
  nps: number;
  comment?: string;
  enrollment?: string | null;
  mission?: string | null;
  isOnCourse?: boolean;
  version?: number;
  rating?: number;
  user?: string;
  question_1_rating?: string;
  question_2_rating?: string;
  question_3_rating?: string;
  question_4_rating?: string;
  question_5_rating?: string;
  question_6_rating?: string;
}

export interface EvaluationQuestions {
  version: number;
  questions: EvaluationQuestion[];
}

export interface EvaluationSummary {
  nps: EvaluationSummaryNps;
  count_evaluation: number;
  avg_questions_rating: number;
  [key: string]: any;
}

export interface EvaluationSummaryNps {
  value: number;
  count_by_point: Record<string, number>;
  promoters: EvaluationSummaryProfile;
  neutrals: EvaluationSummaryProfile;
  detractors: EvaluationSummaryProfile;
}

export interface EvaluationSummaryProfile {
  percentage: number;
  count: number;
}

export interface EvaluationFilter {
  period?: 'month' | 'year';
  positives?: boolean;
  neutrals?: boolean;
  negatives?: boolean;
  range?: { start: Date; end: Date };
  search?: string;
}

export interface EvaluationQuestion {
  id: number;
  title: string;
  i18n: string;
}
