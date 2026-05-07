import { ExternalMission, Mission, MissionProvider } from 'app/main/mission/mission.model';
import { LearningTrail } from 'app/main/learning-trail/model/learning-trail';
import { CourseEnrollment, CoursesResponse, TrailEnrollment, TrailsResponse } from '@core/model/search-api';
import { CourseContentCardDto } from 'app/shared/utils/card-helpers/mission/course-content-card-dto';
import { differenceInDays, endOfToday, format, formatDistanceToNowStrict } from 'date-fns';
import { ENROLLMENT_STATUS_TAG_MAP } from 'app/shared/utils/card-helpers/base/card-maps';
import { TrailContentCardDto } from 'app/shared/utils/card-helpers/trail/trail-content-card-dto';
import { Pulse } from '@core/model/pulse.model';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { LearnContentCardActionId, LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';
import { KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

export function mapMissionToLearnContentCard(
  missions: Mission[],
  isBanner?: boolean,
  isSuperAdmin?: boolean,
  isAdmin?: boolean,
): LearnContentCardData[] {
  return missions
    .map((mission) => mapMissionToCourseResponse(mission))
    .map((missionAsCourse) => new CourseContentCardDto(missionAsCourse, isBanner, isSuperAdmin, isAdmin).getData());
}

export function mapCoursesToLearnContentCard(
  courses: CoursesResponse[],
  isSuperAdmin?: boolean,
  isAdmin?: boolean,
): LearnContentCardData[] {
  return courses.map((course) => new CourseContentCardDto(course, false, isSuperAdmin, isAdmin).getData());
}

export function mapPulsesToPulseCard(pulse: Pulse[]): PulseCardDto[] {
  return pulse.map((pulse) => ({
    id: pulse.id,
    name: pulse.name,
    channel_name: pulse.channels.at(0).name,
    pulse_type: { name: pulse.pulse_type.name, id: pulse.pulse_type.id },
    cover_image: pulse.holder_image,
    bookmark_id: pulse.bookmark_id,
    stats: { duration: pulse.duration_time },
    creator_name: pulse.user_creator?.name,
    is_active: pulse.is_active,
    published_date: pulse.created_date,
    rating: pulse.rating_avg,
  }));
}

export function mapTrailsToLearnContentCard(
  trails: LearningTrail[],
  isBanner?: boolean,
  isSuperAdmin?: boolean,
): LearnContentCardData[] {
  return trails
    .map((trail) => mapTrailToTrailResponse(trail))
    .map((trailResponse) => new TrailContentCardDto(trailResponse, isBanner, isSuperAdmin).getData());
}

export function mapTrailsToContentCard(trails: TrailsResponse[], isSuperAdmin?: boolean): LearnContentCardData[] {
  return trails.map((trail) => new TrailContentCardDto(trail, false, isSuperAdmin).getData());
}

function mapMissionToCourseResponse(mission: Mission): CoursesResponse {
  const externalMission = mission.external as ExternalMission;
  const provider = externalMission?.provider as MissionProvider;
  const enrollment = mission.enrollment;

  return {
    id: mission.id,
    name: mission.name,
    vertical_holder_image: mission.vertical_holder_image,
    holder_image: mission.holder_image,
    duration_time: mission.duration_time,
    external_course: {
      provider_name: provider?.name,
      course_url: externalMission?.course_url,
    },
    language: mission.language,
    stats: {
      user_enrollment: {
        id: enrollment?.id,
        goal_date: enrollment?.goal_date,
        progress: enrollment?.progress,
        status: enrollment?.status,
        required: enrollment?.required,
      },
      favorite: mission.bookmark_id,
      user_is_owner: mission.is_owner,
      user_is_contributor: mission.is_contributor,
    },
    course_model: mission.mission_model,
    development_status: mission.development_status,
    expiration_date: mission.expiration_date as string,
  } as unknown as CoursesResponse;
}

function mapTrailToTrailResponse(trail: LearningTrail): TrailsResponse {
  const enrollment = trail.enrollment;

  return {
    id: trail.id,
    name: trail.name,
    thumb_image: trail.thumb_image,
    holder_image: trail.holder_image,
    duration_time: trail.duration_time,
    missions_count: trail.count_missions,
    pulses_count: trail.count_pulses,
    is_active: trail.is_active,
    stats: {
      user_enrollment: {
        id: enrollment?.id,
        goal_date: enrollment?.goal_date,
        progress: enrollment?.progress,
        status: enrollment?.status,
        required: enrollment?.required as unknown as boolean,
      },
      user_is_owner: trail.is_owner,
    },
  } as unknown as TrailsResponse;
}

export function getEnrollmentGoalTag(enrollment: CourseEnrollment | TrailEnrollment): LearnContentCardTag | undefined {
  if (!enrollment) {
    return undefined;
  }

  const shouldDisplayEnrollmentGoalTag =
    enrollment.status !== EnrollmentStatuses.INACTIVATED &&
    enrollment.status !== EnrollmentStatuses.REPROVED &&
    enrollment.status !== EnrollmentStatuses.COMPLETED &&
    enrollment.status !== EnrollmentStatuses.PENDING_VALIDATION;

  const goalDate = enrollment.goal_date;

  if (!goalDate || !shouldDisplayEnrollmentGoalTag) {
    return undefined;
  }

  const expirationDate = new Date(`${goalDate}T00:00:00`);
  const daysUntilExpiration = differenceInDays(expirationDate, endOfToday());
  const isExpired = daysUntilExpiration < 0;
  const expiresThisWeek = daysUntilExpiration > 6;

  if (isExpired) {
    return { type: 'goal-due-by', label: formatDistanceToNowStrict(expirationDate) };
  }

  if (expiresThisWeek) {
    return { type: 'goal-to', label: format(expirationDate, 'P') };
  }

  return { type: 'goal-expires-in', label: formatDistanceToNowStrict(expirationDate) };
}

export function getEnrollmentTags(enrollment: CourseEnrollment | TrailEnrollment) {
  const enrollmentTags: LearnContentCardTag[] = [];

  if (!enrollment) {
    return [];
  }

  const enrollmentStatusTag = ENROLLMENT_STATUS_TAG_MAP[enrollment.status];
  if (enrollmentStatusTag) {
    enrollmentTags.push(enrollmentStatusTag);
  }

  const enrollmentGoalTag = getEnrollmentGoalTag(enrollment);
  if (enrollmentGoalTag) {
    enrollmentTags.push(enrollmentGoalTag);
  }

  return enrollmentTags;
}

export function getModifierTags(
  enrollment: CourseEnrollment | TrailEnrollment,
  expirationDate: string,
): LearnContentCardTag[] {
  const modifierTags: LearnContentCardTag[] = [];

  if (enrollment?.required) {
    modifierTags.push({ type: 'modifier-required' });
  }

  if (expirationDate) {
    modifierTags.push({ type: 'modifier-temporary' });
  }

  return modifierTags;
}

export function toggleBookmarkAction(
  actions: LearnContentCardActionId[],
  oldAction: LearnContentCardActionId,
  newAction: LearnContentCardActionId,
) {
  return actions.map((action) => {
    if (action === oldAction) {
      return newAction;
    }

    return action;
  });
}

export function updateLearnContentBookmarkInGroup(
  group: LearnContentCardData[],
  updatedLearnContent: LearnContentCardData,
): LearnContentCardData[] {
  return group?.map((item) => {
    if (item.contentId === updatedLearnContent.contentId) {
      return updatedLearnContent;
    }

    return item;
  });
}

export function updatePulseBookmark(group: PulseCardDto[], updatedPulseCard: PulseCardDto): PulseCardDto[] {
  return group.map((item) => {
    if (item.id === updatedPulseCard.id) {
      return updatedPulseCard;
    }
    return item;
  });
}

export function updateChannelSubscription(
  group: KpChannelCardModel[],
  updatedChannelCard: KpChannelCardModel,
): KpChannelCardModel[] {
  return group.map((item) => {
    if (item.id === updatedChannelCard.id) {
      return updatedChannelCard;
    }
    return item;
  });
}
