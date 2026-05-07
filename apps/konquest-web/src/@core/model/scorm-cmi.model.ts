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
