import { AnalyticsApiPageFilter, AnalyticsResponse, BaseElasticData, modelTypes } from '.';

export type CourseApiResponse = AnalyticsResponse<BaseElasticData<CourseSource>>;

export type CourseDataResponse = AnalyticsResponse<BaseElasticData<CourseSource>, CourseDataStats>;

export type CourseListResponse = AnalyticsResponse<BaseElasticData<CourseSource, CourseListStats>>;

export type CourseContentListResponse = AnalyticsResponse<BaseElasticData<CourseContentSource, CourseContentStats>>;

export interface CourseContentFilter extends AnalyticsApiPageFilter {
  type?: string;
}

export interface CourseSource {
  id: string;
  name: string;
  description: string;
  duration_time: number;
  points: number;
  development_status: string;

  is_active: boolean;
  origin: string;
  created_date: string;
  updated_date: string;

  workspaces: {
    id: string;
    workspace_id: string;
    created_date: string;
    updated_date: string;
    relationship_type: string;
  }[];

  user_creator: {
    id: string;
    name: string;
    status: boolean;
    email: string;
    avatar: string;
    last_access_date: string;
  };

  course_type: {
    id: string;
    name: string;
  };

  course_category: {
    id: string;
    name: string;
    name_translated?: string; // post-calculated
  };

  course_contents: {
    stage_id: string;
    stage_order: number;
    stage_name: string;

    content_id: string;
    content_order: number;
    content_name: string;

    kontent_id: string;
    content_type_id: string;
    content_type_name: string;
  }[];

  contributors: {
    relation_id: string;
    user_id: string;
    created_date: string;
    updated_date: string;
  };
}

export interface CourseDataStats {
  enrollments: {
    total: number;
    started: number;
    completed: number;
    give_up: number;
    completed_ratio: number;
  };
  ratings: {
    total: number;
    average: number;
  };
  answers: {
    total_exams: number;
    total_questions: number;
    total_answers: number;
    correct_answers: number;
    correct_ratio: number;
  };
  activities: {
    total_activity_seconds: number;
  };
  nps: {
    total: number;
    cons: number;
    neutrals: number;
    pros: number;
  };
}

export interface CourseListStats {
  enrollments: {
    total: number;
    started: number;
    completed: number;
    give_up: number;
    completed_ratio: number;
  };
  ratings: {
    total: number;
    average: number;
  };
}

/**
 * @deprecated v1 endpoints deprecated
 */
export interface CourseSourceV1 extends SharedSourceDataV1 {
  model_type: 'course';

  name: string;
  description: string;
  is_active: boolean;
  development_status: string;
  points: number;
  duration_time: number;
  duration_time_hours?: number;

  course_category: {
    id: string;
    name: string;
    name_translated?: string;
  };

  course_type: {
    id: string;
    name: string;
  };

  course_stats: {
    updated_date: string;
    answers: {
      total_exams: number;
      total_questions: number;
      total_answers: number;
      correct_answers: number;
      correct_ratio: number;
    };
    content_types: {
      id: string;
      name: string;
      total: number;
    }[];
    enrollment: {
      total: number;
      started: number;
      completed: number;
      completed_ratio: number;
      give_up: boolean;
    };
    general: {
      total_activity_seconds: number;
      total_comments: number;
      total_evaluations: number;
      total_feedbacks: number;
      total_ratings: number;
    };
    rating: {
      average: number;
      totl: number;
    };
    nps: {
      total: number;
      pros: number;
      neutrals: number;
      cons: number;
    };
  };

  course_contents: CourseContentSource[];

  user: {
    id: string;
    email: string;
    user_name: string;
    status: boolean;
    avatar: string;
    last_access_date: string;
  };
}

/**
 * @deprecated v1 endpoints deprecated
 */
export interface EnrollmentSourceV1 extends SharedSourceDataV1 {
  model_type: 'enrollment';

  enrollment: {
    id: string;
    status: string | 'STARTED' | 'COMPLETED';
    performance: number;
    points: number;
    start_date: string;
    end_date: string;
    goal_date: string;
    give_up: boolean;
    give_up_comment: string | null;
  };

  rating: {
    id: string | null;
    rating: number | null;
  };
}

/**
 * @deprecated v1 endpoints deprecated
 */
export interface SharedSourceDataV1 {
  course_id: string;

  origin: string;
  model_type: modelTypes;
  created_date: string;
  updated_date: string;

  owner_workspaces: {
    id: string;
    workspace_id: string;
    relationship_type: string | 'OWNER' | 'SHARED';
    created_date: string;
    updated_date: string;
  }[];

  user: {
    id: string;
    user_name: string;
    avatar: string | null;
  };
}

export interface CourseContentSource {
  stage_id: string;
  stage_order: number;
  stage_name: string;

  content_id: string;
  content_order: number;
  content_name: string;

  stage_content_type: string;

  kontent_id: string;
  content_type_id: string;
  content_type_name: string;
}

/**
 * @deprecated v1 endpoints deprecated
 */
export interface CourseContentSourceV1 {
  stage_id: string;
  stage_order: number;
  stage_name: string;

  content_id: string;
  content_order: number;
  content_name: string;

  kontent_id: string;
  content_type_id: string;
  content_type_name: string;
  content_type_icon?: string; // post-calculated

  activity_stats: {
    updated_date: string;
    total_seconds: number;
    total_users: number;
    total_views: number;
  };
}

export interface CourseContentStats {
  activities: {
    total_seconds: {
      value: number;
    };
    total_users: {
      value: number;
    };
    total_views: {
      value: number;
    };
  };
}
