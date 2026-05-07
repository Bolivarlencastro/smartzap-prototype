import { EnrollmentTracking } from '@core/model/enrollment.model';

export enum ActionType {
  GENERATE = 'GENERATE',
  DOWNLOAD = 'DOWNLOAD',
  APPROVE = 'APPROVE',
  RESTART = 'RESTART',
  DELETE = 'DELETE',
  EXTEND = 'EXTEND',
  REPROVE = 'REPROVE',
  HISTORIC = 'HISTORIC',
  EXTERNAL = 'EXTERNAL',
  APPROVE_CERTIFICATE = 'APPROVE_CERTIFICATE',
  REJECT_CERTIFICATE = 'REJECT_CERTIFICATE',
  DETAIL = 'DETAIL',
}

export enum LearningTrailDoneActionType {
  VIEW_TRAIL = 'viewTrail',
  RESTART = 'restart',
  RE_ENROLL = 'reEnroll',
  VIEW_ACTIVITIES = 'viewActivities',
  DELETE = 'delete',
  APPROVE_ENROLLMENT = 'approveEnrollment',
  LINK_CYCLE = 'linkCycle',
  EXTEND_DEADLINE = 'extendDeadline',
  GIVE_UP = 'giveUp',
}

export const GREEN = 'green';
export const ORANGE = 'orange';
export const GREY = 'grey';
export const CHECK = 'check';
export const MORE_HORIZ = 'more_horiz';

export const CalculateConsumptionStatus = (track: EnrollmentTracking): { color: string; icon: string } => {
  const progress = track.total_questions
    ? +((track.total_correct_answers * 100) / track.total_questions / 100).toFixed(2)
    : track.consume_duration / track.content_duration;

  if (progress >= 1) {
    return {
      color: GREEN,
      icon: CHECK,
    };
  }

  if (progress > 0 && progress < 1) {
    return {
      color: ORANGE,
      icon: MORE_HORIZ,
    };
  }

  return {
    color: GREY,
    icon: MORE_HORIZ,
  };
};
