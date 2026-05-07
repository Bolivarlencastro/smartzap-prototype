import { ClassroomStep } from '../../models';
import { Course } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface StepNavigationStrategy {
  navigate(step: ClassroomStep, course: Course, viewingAsUser: boolean): void;
}

export abstract class AbstractStepNavigationStrategy implements StepNavigationStrategy {
  abstract navigate(step: ClassroomStep, course: Course, viewingAsUser: boolean): void;

  protected getViewingAsUserRoute(): string {
    return 'view-as-user';
  }

  protected getCourseRoute(): string {
    return 'course';
  }
}
