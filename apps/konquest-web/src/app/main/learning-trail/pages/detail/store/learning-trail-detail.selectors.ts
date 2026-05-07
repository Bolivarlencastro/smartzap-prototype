import { LearningTrail, Step } from '@app/main/learning-trail/model/learning-trail';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, State } from './learning-trail-detail.reducer';
import { CardTagType, LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';
import { createEnrollmentInfoTag, ENROLLMENT_STATUS_TAG_TYPE_MAP } from '@keeps-platform-frontend-workspace/ui/helpers';

export const selectLearningTrailDetailAppState = createFeatureSelector<State>(featureKey);

export const selectLearningTrail = createSelector(
  selectLearningTrailDetailAppState,
  (state: State) => state.learningTrail,
);

export const selectLearningTrailTags = createSelector(selectLearningTrail, (learningTrail) =>
  buildLearningTrailTags(learningTrail),
);

export const selectLearningTrailSteps = createSelector(selectLearningTrail, (learningTrail) =>
  buildStepsWithTags(learningTrail?.steps),
);

export const selectEnrollment = createSelector(selectLearningTrailDetailAppState, (state: State) => state.enrollment);

export const selectEnrolled = createSelector(selectEnrollment, (enrollment) => {
  return (enrollment?.status === 'STARTED' || enrollment?.status === 'ENROLLED') && !enrollment?.give_up;
});

export const selectCanGiveUp = createSelector(selectEnrollment, (enrollment) => {
  return enrollment?.id && !enrollment?.give_up && enrollment?.status !== 'COMPLETED' && !enrollment?.required;
});

export const selectCanGenerateCertificate = createSelector(selectEnrollment, (enrollment) => {
  return !enrollment?.give_up && enrollment?.status === 'COMPLETED';
});

export const selectCanRetake = createSelector(selectEnrollment, (enrollment) => enrollment?.give_up);

export const selectEnrollButtonDisabled = createSelector(
  selectEnrollment,
  selectCanRetake,
  (enrollment, canRetake) => enrollment?.progress === 1 && !canRetake,
);

export const selectLastContentItem = createSelector(selectLearningTrailSteps, (steps): { type: string; step: Step } => {
  for (const step of steps) {
    const { pulse, mission } = step;
    const isAvailableMission = mission?.development_status === 'DONE';
    const canOpenMission = mission?.mission_model !== 'LIVE' && mission?.mission_model !== 'PRESENTIAL';
    const isEnrolledInMission = mission?.enrollment?.status === 'ENROLLED' || mission?.enrollment?.status === 'STARTED';
    const isPulseNotFinished = pulse && Number(pulse.consume_time_in ?? 0) <= pulse.duration_time;

    if (isAvailableMission && canOpenMission && isEnrolledInMission) {
      return { type: 'mission', step };
    }

    if (isPulseNotFinished) {
      return { type: 'pulse', step };
    }
  }

  return null;
});

function buildLearningTrailTags(learningTrail: LearningTrail): LearnContentCardTag[] {
  const enrollment = learningTrail?.enrollment;
  const tags: LearnContentCardTag[] = [];

  if (enrollment?.status) {
    tags.push({ type: ENROLLMENT_STATUS_TAG_TYPE_MAP.get(enrollment.status) });
    const infoTag = createEnrollmentInfoTag(enrollment.status, enrollment.goal_date);

    if (infoTag) {
      tags.push(infoTag);
    }
  }

  if (enrollment?.required) {
    tags.push({ type: 'modifier-required' });
  }

  return tags;
}

function buildStepsWithTags(steps: Step[]): Step[] {
  if (steps) {
    return steps.map((step) => {
      const enrollment = step.mission?.enrollment;
      if (!enrollment) {
        return step;
      }

      const tags: CardTagType[] = [];
      if (enrollment.status) {
        tags.push(ENROLLMENT_STATUS_TAG_TYPE_MAP.get(enrollment.status));
      }

      if (enrollment.required) {
        tags.push('modifier-required');
      }

      return { ...step, ...(tags.length && { tags }) };
    });
  }
  return [];
}
