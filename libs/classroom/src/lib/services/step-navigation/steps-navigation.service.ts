import { Injectable, Injector } from '@angular/core';
import { ClassroomStep } from '../../models';
import { Course, Enrollment, EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatDialog } from '@angular/material/dialog';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { DefaultNavigationStrategy } from './strategies/default-navigation.strategy';
import { StepNavigationStrategy } from './step-navigation-strategy';

@Injectable()
export class StepsNavigationService {
  constructor(
    private readonly injector: Injector,
    private readonly dialog: MatDialog,
    private readonly defaultNavigationStrategy: DefaultNavigationStrategy,
  ) {}

  goToStep(step: ClassroomStep | undefined, course: Course, viewingAsUser: boolean) {
    if (!step) {
      return;
    }

    const stepType = step.stepType;
    const strategy: StepNavigationStrategy = this.injector.get<StepNavigationStrategy>(
      stepType as any,
      this.defaultNavigationStrategy,
    );

    strategy.navigate(step, course, viewingAsUser);
  }

  getInitialStepId(steps: ClassroomStep[], enrollment: Enrollment, isViewingAsUser: boolean) {
    if (isViewingAsUser || enrollment?.status === EnrollmentStatuses.COMPLETED) {
      return steps[0].id;
    }

    return this.getLastCompletedStepId(steps);
  }

  getLastCompletedStepId(steps: ClassroomStep[]): string | undefined {
    const lastCompletedStep = this.getLastCompletedStep(steps);
    return lastCompletedStep?.id;
  }

  canAccessStep(
    courseSteps: ClassroomStep[],
    targetStep: ClassroomStep,
    course: Course,
    countdownFinished: boolean,
    isViewingAsUser: boolean,
  ): boolean {
    if (isViewingAsUser || course.enrollment?.status === EnrollmentStatuses.COMPLETED) {
      return true;
    }

    if (targetStep.completed || targetStep.skippedByUser) {
      return true;
    }

    const lastCompletedStep = this.getLastCompletedStep(courseSteps);

    if (lastCompletedStep) {
      const lastCompletedIndex = courseSteps.indexOf(lastCompletedStep);
      const targetIndex = courseSteps.indexOf(targetStep);
      if (targetIndex !== -1 && targetIndex < lastCompletedIndex) {
        return true;
      }
    }

    return lastCompletedStep?.nextStepId === targetStep.id && countdownFinished;
  }

  displayBlockedContentDialog() {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, {
      autoFocus: 'dialog',
      width: '280px',
    });

    const instance = dialogRef.componentInstance;
    instance.confirmTitle = marker('CLASSROOM.BLOCKED_CONTENT.TITLE');
    instance.confirmMessage = marker('CLASSROOM.BLOCKED_CONTENT.MESSAGE');
    instance.hideCancelButton = true;
    instance.positiveButtonLabel = marker('GENERAL.CLOSE');
  }

  private getLastCompletedStep(steps: ClassroomStep[]): ClassroomStep | undefined {
    if (!steps?.length) {
      return undefined;
    }

    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].completed) {
        return steps[i];
      }
    }

    return steps[0];
  }
}
