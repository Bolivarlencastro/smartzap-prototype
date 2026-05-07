export interface LabelValue {
  label: string;
  value: number;
  data?: {
    percent: number;
    [key: string]: any;
  };
}

export interface LazyResponse<R = any, E = any> {
  response?: R;
  error?: E;
  isLoading: boolean;
}

export interface AnalyticsApiFilter extends AnalyticsApiPeriod {
  model_type?: modelTypes;
  data_size?: number;
  interval?: Intervals;
}

export interface AnalyticsApiPageFilter extends AnalyticsApiPeriod {
  search_term?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}

export interface AnalyticsApiUsersFilter extends AnalyticsApiPageFilter {
  completion_rate_min?: number;
  completion_rate_max?: number;
  leader?: string[];
}

export interface AnalyticsApiUserEnrollmentsFilter extends AnalyticsApiPageFilter {
  end_date_max?: string;
  start_date_max?: string;
  start_date_min?: string;
  end_date_min?: string;
  performance_min?: number;
  performance_max?: number;
  course_category?: string[];
}

export interface AnalyticsApiPeriod {
  end_date?: string;
  start_date?: string;
}

export type Intervals = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';
export type modelTypes = 'course' | 'enrollment' | 'rating' | 'bookmark' | 'goal';

export interface AnalyticsResponse<T = any, GENERAL_STATS = any> {
  aggs?: AnalyticsResponseAggs;
  data?: T[];
  total?: number;
  stats?: GENERAL_STATS;

  [key: string]: any;
}

export interface AnalyticsResponseAggs {
  [key: string]: { value: number } & {
    buckets?: AnalyticsResponseBucket[];
  } & {
    ranges: AnalyticsResponseRange[];
  } & AnalyticsResponseAggs;
}

export interface AnalyticsResponseBucket {
  doc_count: number;
  key: number;
  key_as_string?: string;
  [key: string]: any;
}

export interface AnalyticsResponseRange {
  doc_count: number;
  key: string;
  from?: number;
  to?: number;
  [key: string]: any;
}

export interface BaseElasticData<
  SOURCE,
  STATS = {
    [key: string]: any;
  },
> {
  _id: string;
  _index: string;
  _score: number;
  _type: string;
  _source: SOURCE;
  _nested?: {
    field: string;
    offset: number;
  };
  sort?: string[];
  stats?: STATS;
}

export interface UserActivitiesStats {
  missions: {
    total: number;
    previous: number;
    variation: StatsVariation;
  };
  pulses: {
    total: number;
    previous: number;
    variation: StatsVariation;
  };
}

export interface StatsVariation {
  rate: number;
  dir: 'inc' | 'dec' | 'eq';
  icon: 'trending_up' | 'trending_down' | 'trending_flat';
  class: 'text-green-500' | 'text-red-500' | 'text-gray-500';
}
