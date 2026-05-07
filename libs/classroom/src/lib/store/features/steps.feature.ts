import { ClassroomStep } from '../../models';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CourseActions, CourseStepActions, StepNavigationActions } from '../actions';
import { EnrollmentStatuses, LearnContent } from '@keeps-platform-frontend-workspace/kp-keeps';
import { classroomCourseFeature } from './course.feature';
import { classroomContentFeature } from './content.feature';
import { KpCountdown } from '@keeps-platform-frontend-workspace/ui/kp-countdown';

export const classroomStepsFeatureKey = 'classroomCourseSteps';

export interface StepsFeatureState extends EntityState<ClassroomStep> {
  loading: boolean;
  currentStepId: string | null;
}

const adapter = createEntityAdapter<ClassroomStep>();

export const stepsInitialState: StepsFeatureState = adapter.getInitialState({ loading: false, currentStepId: null });

const reducer = createReducer(
  stepsInitialState,

  on(CourseActions.loadCourse, (state): StepsFeatureState => ({ ...state, loading: true })),

  on(CourseStepActions.loadStepsSuccess, (state, { steps }): StepsFeatureState => {
    return adapter.setAll(steps, { ...state, loading: false });
  }),

  on(CourseStepActions.loadStepsFailure, (state): StepsFeatureState => ({ ...state, loading: false })),

  on(StepNavigationActions.navigate, (state, { stepId }): StepsFeatureState => ({ ...state, currentStepId: stepId })),

  on(StepNavigationActions.completeStepOnNavigation, (state, { countdownFinished, currentStep }): StepsFeatureState => {
    if (canComplete(countdownFinished, currentStep)) {
      return adapter.updateOne({ id: currentStep?.id, changes: { completed: true } }, state);
    }

    return state;
  }),

  on(CourseStepActions.completeStep, (state, { step }): StepsFeatureState => {
    return adapter.updateOne({ id: step.id, changes: { completed: true } }, state);
  }),

  on(CourseActions.loadCertificate, (state): StepsFeatureState => ({ ...state, currentStepId: null })),

  on(
    CourseActions.navigateToCertificate,
    (state): StepsFeatureState => adapter.removeMany(['EVALUATION', 'FINISH'], state),
  ),

  on(CourseActions.reset, (): StepsFeatureState => stepsInitialState),
);

export const classroomStepsFeature = createFeature({
  name: classroomStepsFeatureKey,
  reducer,
  extraSelectors: ({ selectClassroomCourseStepsState, selectCurrentStepId }) => ({
    selectStepById: (id: string) =>
      createSelector(adapter.getSelectors(selectClassroomCourseStepsState).selectAll, (steps) =>
        steps.find((step) => step.id === id),
      ),
    selectSteps: createSelector(adapter.getSelectors(selectClassroomCourseStepsState).selectAll, (steps) => steps),
    selectParsedSteps: createSelector(
      adapter.getSelectors(selectClassroomCourseStepsState).selectAll,
      classroomCourseFeature.selectIsViewingAsUser,
      (steps, isViewingAsUser) => groupStepsBySubjectId(steps, isViewingAsUser),
    ),
    selectCurrentStep: createSelector(
      adapter.getSelectors(selectClassroomCourseStepsState).selectAll,
      selectCurrentStepId,
      (steps, currentStepId) => getCurrentStep(steps, currentStepId),
    ),
    selectTotalSteps: createSelector(
      adapter.getSelectors(selectClassroomCourseStepsState).selectTotal,
      (total) => total,
    ),
    currentStepIndex: createSelector(
      adapter.getSelectors(selectClassroomCourseStepsState).selectAll,
      selectCurrentStepId,
      (steps, currentStepId) => steps.findIndex((step) => step.id === currentStepId) + 1,
    ),
    selectDisabledNext: createSelector(
      adapter.getSelectors(selectClassroomCourseStepsState).selectAll,
      selectCurrentStepId,
      (steps, currentStepId) => {
        const currentStep = steps.find((step) => step.id === currentStepId);
        return currentStep?.stepType === 'QUESTION' || (currentStep?.id === 'EVALUATION' && !currentStep.completed);
      },
    ),
    selectShowNavigationControls: createSelector(selectClassroomCourseStepsState, ({ currentStepId }) => {
      return currentStepId !== null;
    }),
    selectContentMinDuration: createSelector(
      adapter.getSelectors(selectClassroomCourseStepsState).selectAll,
      classroomCourseFeature.selectMinTimePercentage,
      classroomContentFeature.selectContent,
      selectCurrentStepId,
      classroomCourseFeature.selectCourse,
      classroomCourseFeature.selectIsViewingAsUser,
      (steps, minTimePercentage, content, currentStepId, course, isViewingAsUser): KpCountdown => {
        if (isViewingAsUser) {
          return { timer: 0 };
        }

        const currentStep = getCurrentStep(steps, currentStepId);
        const courseFinished = course?.enrollment?.status === EnrollmentStatuses.COMPLETED;

        if (!isContent(currentStep) || currentStep.completed || currentStep.stepType === 'QUESTION' || courseFinished) {
          return { timer: 0 };
        }

        const manualStart = shouldStartCounterOnPlay(content, currentStep);
        return { timer: Math.max((content?.duration || 0) * minTimePercentage, 5), manualStart };
      },
    ),
  }),
});

function groupStepsBySubjectId(steps: ClassroomStep[], isViewingAsUser: boolean) {
  const stages = new Map<string, ClassroomStep>();
  for (const immutableStep of steps) {
    const step = { ...immutableStep };
    if (step.stepType === 'SUBJECT') {
      stages.set(step.id, step);
      continue;
    }
    const parentStep: ClassroomStep = stages.get(step.parentStageId);
    if (!parentStep.childrenSteps) {
      parentStep.childrenSteps = [];
    }
    parentStep.childrenSteps.push(step);
  }

  const stagesArray = Array.from(stages.values());
  return isViewingAsUser ? stagesArray : calculateProgress(stagesArray);
}

function isContent(step: ClassroomStep) {
  return !!step?.id && step?.stepType !== 'SUBJECT';
}

function getCurrentStep(steps: ClassroomStep[], id: string): ClassroomStep {
  return steps?.find((step) => step?.id === id);
}

function shouldStartCounterOnPlay(content: LearnContent, step: ClassroomStep) {
  const isMedia = step?.stepType === 'VIDEO' || step?.stepType === 'PODCAST';
  if (!isMedia) {
    return false;
  }

  const isSoundCloud = step.stepType === 'PODCAST' && content?.url?.includes('soundcloud');
  return !isSoundCloud;
}

function calculateProgress(stages: ClassroomStep[]) {
  return stages.map((stage) => {
    const children = stage.childrenSteps;

    if (children) {
      let completedCounter = 0;
      let sizeCounter = 0;

      for (const child of children) {
        if (child.completed) {
          completedCounter++;
        }
        sizeCounter++;
      }

      return { ...stage, progress: completedCounter / sizeCounter };
    }

    return { ...stage, progress: stage.completed ? 1 : 0 };
  });
}

function canComplete(countdownFinished: boolean, currentStep: ClassroomStep) {
  return (
    countdownFinished &&
    currentStep?.stepType !== 'QUESTION' &&
    currentStep?.id !== 'EVALUATION' &&
    currentStep?.id !== 'FINISH'
  );
}
