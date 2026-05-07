import { FormControl } from '@angular/forms';

interface SmartzapConfigurationModel<B, N, S> {
  messagesContentEmbed: B;
  sendCoursesRecommendationMessage: B;
  sendCourseReminderMessage: B;
  interactWithRandomMessages: B;
  enrollmentIdleDaysLimit: N;
  coursesPortalUrl: S;
}

export type SmartzapConfiguration = SmartzapConfigurationModel<boolean, number, string>;
export type SmartzapConfigurationForm = SmartzapConfigurationModel<
  FormControl<boolean>,
  FormControl<number>,
  FormControl<string>
>;

export interface SmartzapConfigurationResponse {
  messages_content_embed: boolean;
  send_courses_recommendation_message: boolean;
  send_course_reminder_message: boolean;
  interact_with_random_messages: boolean;
  enrollment_idle_days_limit: number;
  courses_portal_url: string;
}
