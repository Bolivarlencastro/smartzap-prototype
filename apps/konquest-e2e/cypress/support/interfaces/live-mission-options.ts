export interface LiveMissionCreate {
  name?: string;
  mission_category?: string;
  language?: string;
  mission_type?: {
    name?: string;
    id: string;
  };
  description?: string;
  inner_code?: string;
  assessment_type?: string;
  id?: string;

  user_creator?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
  is_active?: boolean;
  created_date?: string;
  updated_date?: string;
  deleted_date?: string;
  deleted?: boolean;
  holder_image?: string;
  vertical_holder_image?: string;
  thumb_image?: string;
  summary?: string;
  duration_time?: string;
  points?: string;
  internal_code?: string;
  _is_active?: boolean;
  development_status?: string;
  expiration_date?: string;
  mission_model?: string;
  required_evaluation?: boolean;
  allow_self_enrollment_renewal?: boolean;
  allow_self_reproved_enrollment_renewal?: boolean;
  minimum_performance?: number;
  learning_trail_linked?: boolean;
  live?: {
    id?: string;
    dates?: [
      {
        id?: string;
        date?: string;
        start_at?: string;
        end_at?: string;
        allow_self_attendance?: boolean;
        live?: number;
      },
    ];
    instructors?: [];
    notify_users_enrolled?: boolean;
    allow_any_enrollment?: boolean;
    seats?: number;
    url?: string;
  };

  presential?: {
    id?: string;
    dates?: [
      {
        date?: string;
        id?: string;
        count_users_attending?: number;
        start_at?: string;
        end_at?: string;
        allow_self_attendance?: boolean;
        presential?: number;
      },
    ];
    instructors?: any[];
    is_finished?: boolean;
    notify_users_enrolled?: boolean;
    address?: string;
  };
}
