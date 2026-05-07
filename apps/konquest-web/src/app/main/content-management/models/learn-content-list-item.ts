import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ChannelsResponse, CoursesResponse, TrailsResponse } from '@core/model/search-api';
import { MissionModel } from 'app/main/mission/mission.model';
import { LEARN_CONTENT_LIST_ITEM_ACTION } from 'app/main/content-management/models/learn-content-list-item-action';

export class LearnContentListItem {
  static fromCourseItem(course: CoursesResponse): LearnContentListItem {
    return {
      id: course.id,
      name: course.name,
      creationDate: course.created_date,
      creatorName: course.user_creator.name,
      isCreator: course.stats.user_is_owner,
      icon: getCourseIcon(course.course_model),
      meta: {
        status: course.development_status as DevelopmentStatus,
        category: course.course_category?.name,
        open: course.course_type.name === 'Open For Workspace',
        externalCourse: course.course_model === MissionModel.EXTERNAL_PROVIDER,
        enrolledCount: course.stats.enrollments_count,
        duration: course.duration_time,
        minimumPerformance: course.stats.workspace_minimum_performance,
        shared: !!course.stats.shared,
        isIntegration: !!course.stats.is_integration,
      },
    };
  }

  static fromEventItem(event: CoursesResponse): LearnContentListItem {
    const prop = event.course_model === MissionModel.LIVE ? 'live_course' : 'presential_course';

    return {
      id: event.id,
      name: event.name,
      creationDate: event.created_date,
      creatorName: event.user_creator.name,
      isCreator: event.stats.user_is_owner,
      icon: getCourseIcon(event.course_model),
      meta: {
        eventType: event.course_model,
        status: event.development_status as DevelopmentStatus,
        enrolledCount: event.stats.enrollments_count ?? 0,
        duration: event.duration_time,
        eventDate: event.event_date,
        seats: event?.[prop]?.['seats'],
        remaining_seats: event?.[prop]?.['remaining_seats'],
      },
    };
  }

  static fromChannelItem(channel: ChannelsResponse): LearnContentListItem {
    return {
      id: channel.id,
      name: channel.name,
      creationDate: undefined,
      creatorName: channel.creator,
      isCreator: channel.is_owner,
      icon: 'hub',
      meta: {
        category: channel.category,
        isContributor: channel.is_contributor,
        subscribersCount: channel.stats?.subscribers_count ?? 0,
        pulsesCount: channel.stats?.pulses_count ?? 0,
        isActive: channel.is_active,
      },
    };
  }

  static fromTrailItem(trail: TrailsResponse): LearnContentListItem {
    return {
      id: trail.id,
      name: trail.name,
      creationDate: trail.created_date,
      creatorName: trail.user_creator.name,
      isCreator: trail.stats.user_is_owner,
      icon: 'conversion_path',
      meta: {
        open: trail.trail_type.name === 'Open For Workspace',
        enrolledCount: trail.stats.enrollment,
        duration: trail.duration_time,
        coursesCount: trail.stats.total_courses ?? 0,
        pulsesCount: trail.stats.total_pulses ?? 0,
        isActive: trail.is_active,
      },
    };
  }

  id: string;
  name: string;
  creatorName: string;
  isCreator: boolean;
  creationDate: string;
  icon: string;
  meta: Record<string, any>;
  actions?: LEARN_CONTENT_LIST_ITEM_ACTION[];
}

function getCourseIcon(missionModel: MissionModel): string {
  switch (missionModel) {
    case MissionModel.LIVE:
      return 'videocam';
    case MissionModel.PRESENTIAL:
      return 'location_on';
    default:
      return 'rocket_launch';
  }
}
