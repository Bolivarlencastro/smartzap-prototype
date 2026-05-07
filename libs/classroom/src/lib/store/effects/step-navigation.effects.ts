import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';
import { StepsNavigationService } from '../../services';
import { CourseStepActions, StepNavigationActions } from '../actions';
import { classroomCourseFeature, classroomStepsFeature } from '../features';

@Injectable()
export class StepNavigationEffects {
  navigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(StepNavigationActions.navigate),
        concatLatestFrom(({ stepId }) => [
          this.store.select(classroomStepsFeature.selectStepById(stepId)),
          this.store.select(classroomCourseFeature.selectCourse),
          this.store.select(classroomCourseFeature.selectIsViewingAsUser),
        ]),
        tap(([_, step, course, viewingAsUser]) => this.stepsService.goToStep(step, course, viewingAsUser)),
      );
    },
    { dispatch: false },
  );

  goToStep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StepNavigationActions.goToStep),
      concatLatestFrom(() => this.store.select(classroomStepsFeature.selectCurrentStep)),
      filter(([{ stepId }, currentStep]) => stepId !== currentStep?.id),
      map(([{ stepId, countdownFinished }, currentStep]) =>
        StepNavigationActions.completeStepOnNavigation({ countdownFinished, currentStep, targetStepId: stepId }),
      ),
    );
  });

  nextStep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StepNavigationActions.next),
      concatLatestFrom(() => this.store.select(classroomStepsFeature.selectCurrentStep)),
      map(([_, currentStep]) => StepNavigationActions.navigate({ stepId: currentStep.nextStepId })),
    );
  });

  previousStep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StepNavigationActions.previous),
      concatLatestFrom(() => this.store.select(classroomStepsFeature.selectCurrentStep)),
      map(([{ countdownFinished }, currentStep]) =>
        StepNavigationActions.completeStepOnNavigation({
          countdownFinished,
          currentStep,
          targetStepId: currentStep.prevStepId,
        }),
      ),
    );
  });

  navigateToLastCompletedStep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseStepActions.loadStepsSuccess),
      concatLatestFrom(() => [
        this.store.select(classroomCourseFeature.selectCourse),
        this.store.select(classroomCourseFeature.selectEnrollment),
        this.store.select(classroomCourseFeature.selectIsViewingAsUser),
      ]),
      filter(([_action, course]) => !!course?.id),
      map(([{ steps }, _course, enrollment, isViewingAsUser]) => {
        const lastCompletedStepId = this.stepsService.getInitialStepId(steps, enrollment, isViewingAsUser);
        return StepNavigationActions.navigate({ stepId: lastCompletedStepId });
      }),
    );
  });

  completeStepOnNextNavigation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StepNavigationActions.next),
      concatLatestFrom(() => this.store.select(classroomStepsFeature.selectCurrentStep)),
      map(([_, currentStep]) => CourseStepActions.completeStep({ step: currentStep })),
    );
  });

  showBlockedContentDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(StepNavigationActions.showBlockedContentDialog),
        tap(() => this.stepsService.displayBlockedContentDialog()),
      );
    },
    { dispatch: false },
  );

  completeStepOnNavigation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StepNavigationActions.completeStepOnNavigation),
      concatLatestFrom(({ targetStepId }) => [
        this.store.select(classroomStepsFeature.selectSteps),
        this.store.select(classroomStepsFeature.selectStepById(targetStepId)),
        this.store.select(classroomCourseFeature.selectCourse),
        this.store.select(classroomCourseFeature.selectIsViewingAsUser),
      ]),
      map(([{ countdownFinished }, steps, targetStep, course, isViewingAsUser]) => {
        const canAccess = this.stepsService.canAccessStep(
          steps,
          targetStep,
          course,
          countdownFinished,
          isViewingAsUser,
        );
        if (canAccess) {
          return StepNavigationActions.navigate({ stepId: targetStep.id });
        }
        return StepNavigationActions.showBlockedContentDialog();
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private stepsService: StepsNavigationService,
    private store: Store,
  ) {}
}
