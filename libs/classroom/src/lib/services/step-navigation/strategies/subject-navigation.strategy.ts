import { Injectable } from '@angular/core';
import { ClassroomStep } from '../../../models';
import { Course } from '@keeps-platform-frontend-workspace/kp-keeps';
import { AbstractStepNavigationStrategy } from '../step-navigation-strategy';
import { Router } from '@angular/router';

@Injectable()
export class SubjectNavigationStrategy extends AbstractStepNavigationStrategy {
  constructor(protected readonly router: Router) {
    super();
  }

  navigate(step: ClassroomStep, course: Course, viewingAsUser: boolean) {
    const courseId = course.id;
    const baseRoute = viewingAsUser ? this.getViewingAsUserRoute() : this.getCourseRoute();
    const routeSegments = this.getRouteSegments(step);
    this.router.navigate([baseRoute, courseId, ...routeSegments]).then();
  }

  private getRouteSegments(step: ClassroomStep): string[] {
    switch (step.id) {
      case 'FINISH':
        return ['finish'];
      case 'EVALUATION':
        return ['evaluation'];
      default:
        return ['subject', step.id];
    }
  }
}
