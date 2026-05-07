import { MissionModel } from 'app/main/mission/mission.model';
import { MISSION_MODEL_TAG_MAP, MISSION_STATUS_TAG_MAP } from '../base/card-maps';
import { LearnContentCardBaseDto } from '../base/learn-content-card-base-dto';
import { CoursesResponse } from '@core/model/search-api';

import { getEnrollmentTags, getModifierTags } from '../helper-functions';
import { DefaultCourseActionsStrategy, EventsActionsStrategy } from './course-actions-strategy';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { LearnContentCardActionId, LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';

export class CourseContentCardDto extends LearnContentCardBaseDto<CoursesResponse> {
  constructor(course: CoursesResponse, isBanner?: boolean, isSuperAdmin?: boolean, isAdmin?: boolean) {
    super(course, isBanner, isSuperAdmin, isAdmin);
  }

  override buildData(course: CoursesResponse, isBanner?: boolean): LearnContentCardData {
    return {
      contentId: course.id,
      title: course.name,
      backgroundImage: isBanner ? course.holder_image : course.vertical_holder_image,
      duration: course.duration_time,
      externalProvider: course.external_course?.provider_name,
      externalCourseUrl: course.external_course?.course_url,
      language: course.language,
      missionModel: course.course_model,
      enrollmentId: course.stats?.user_enrollment?.id,
      progress: course.stats?.user_enrollment?.progress * 100,
      eventDate: this.isEvent(course) ? course.event_date : undefined,
      bookmarkId: course?.stats?.favorite,
      isIntegration: course?.stats?.is_integration,
    };
  }

  override buildTags(course: CoursesResponse): LearnContentCardTag[] {
    const tags: LearnContentCardTag[] = [];
    const canEdit = this.canEdit(course);
    const isEvent = this.isEvent(course);

    if (canEdit) {
      tags.push(...this.getDevelopmentStatusTag(course));
    }

    if (isEvent) {
      tags.push(...this.getEventTags(course));
    }

    tags.push(...getModifierTags(course.stats?.user_enrollment, course.expiration_date));
    tags.push(...getEnrollmentTags(course.stats?.user_enrollment));

    return tags;
  }

  override setActions(course: CoursesResponse): LearnContentCardActionId[] {
    const courseModel = course.course_model;
    if (courseModel === MissionModel.LIVE || courseModel === MissionModel.PRESENTIAL) {
      return new EventsActionsStrategy(course, this.isSuperAdmin, this.isAdmin).getActions();
    }

    return new DefaultCourseActionsStrategy(course, this.isSuperAdmin, this.isAdmin).getActions();
  }

  private getDevelopmentStatusTag(course: CoursesResponse): LearnContentCardTag[] {
    const developmentStatusTag = MISSION_STATUS_TAG_MAP[course.development_status];
    return developmentStatusTag ? [developmentStatusTag] : [];
  }

  private getEventTags(course: CoursesResponse): LearnContentCardTag[] {
    const eventTags: LearnContentCardTag[] = [];
    const isEventFinished = this.isEventFinished(course);
    const eventModelTag = MISSION_MODEL_TAG_MAP[course.course_model];

    eventTags.push(eventModelTag);

    if (isEventFinished) {
      eventTags.push({ type: 'development-finished-event' });
    }

    return eventTags;
  }

  private canEdit(course: CoursesResponse) {
    const isOwner = course.stats?.user_is_owner;
    const isContributor = course.stats?.user_is_contributor;
    return isOwner || isContributor || this.isSuperAdmin || this.isAdmin;
  }

  private isEvent(course: CoursesResponse) {
    const model = course.course_model;
    return model === MissionModel.LIVE || model === MissionModel.PRESENTIAL;
  }

  private isEventFinished(_course: CoursesResponse) {
    // const missionModelInfo = course[course.mission_model?.toLowerCase()] as MissionModelInformation;
    // TODO: The search api doesn't return whether an event is finished or not, when fixing,
    //  update the mapMissionToCourseResponse function in helper-functions/index.ts
    return false;
  }
}
