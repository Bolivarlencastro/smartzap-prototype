export interface ScormParams {
  viewingAsUser: boolean;
  missionStageContentId: string;
  enrollmentId: string;
}

export interface ScormResult {
  cmi: CMI;
  content: string; // "4b02d795-32b3-4bad-9b09-66aa4f01bfda"
  created_date: string; // "2023-05-02T20:18:18.385509Z"
  deleted: boolean; // false
  deleted_date: string; // null
  enrollment: string; // "baf2615a-ed0d-41dc-b805-05c010cd0a8d"
  id: string; // "bbef95d1-fb79-48ab-afb0-5dfd1a7dead3"
  updated_date: string; // "2023-05-02T20:38:12.245238Z"
  user: string; // "57b61d0e-1f36-4427-b98c-c45ef1019c06"
}

export interface CMI {
  suspend_data: string;
  launch_data: string;
  comments: string;
  comments_from_lms: string;
  core: {
    student_id: string; // keeps@keeps.com
    student_name: string; // keeps, keeps
    lesson_location: string; // '0:0'
    credit: string;
    lesson_status: string; // 'complete' | 'incomplete',
    entry: string;
    lesson_mode: string; // 'normal'
    exit: string;
    session_time: string; // '00:00:00'
    score: {
      raw: string;
      min: string;
      max: string; // '100'
    };
  };
  objectives: {
    [key: string]: any;
  };
  student_data: {
    mastery_score: string;
    max_time_allowed: string;
    time_limit_action: string;
  };
  student_preference: {
    audio: string;
    language: string;
    speed: string;
    text: string;
  };
  interactions: {
    [key: string]: any;
  };

  [key: string]: any;
}
