import { Injectable } from '@angular/core';
import { ClassroomStep } from '../../../models';
import { Course, STEP_CONTENT_TYPE } from '@keeps-platform-frontend-workspace/kp-keeps';
import { AbstractStepNavigationStrategy } from '../step-navigation-strategy';
import { Router } from '@angular/router';

@Injectable()
export class DefaultNavigationStrategy extends AbstractStepNavigationStrategy {
  constructor(protected readonly router: Router) {
    super();
  }

  navigate(step: ClassroomStep, course: Course, viewingAsUser: boolean) {
    const learnContentTypeUrl = this.resolveLearnContentTypeUrl(step.stepType);
    const courseId = course.id;
    const stepId = step.id;
    const baseRoute = viewingAsUser ? this.getViewingAsUserRoute() : this.getCourseRoute();
    this.router.navigate([baseRoute, courseId, learnContentTypeUrl, stepId]);
  }

  private resolveLearnContentTypeUrl(stepContentType: STEP_CONTENT_TYPE): string {
    const contentTypeMap: Record<STEP_CONTENT_TYPE, string> = {
      HTML: 'html',
      'HTML FILE': 'html',
      IMAGE: 'image',
      PDF: 'pdf',
      PODCAST: 'podcast',
      PRESENTATION: 'doc',
      SPREADSHEET: 'doc',
      TEXT: 'doc',
      QUESTION: 'quiz',
      SCORM: 'scorm',
      VIDEO: 'video',
      SUBJECT: 'unknown',
    };

    return contentTypeMap[stepContentType] || 'unknown';
  }
}
