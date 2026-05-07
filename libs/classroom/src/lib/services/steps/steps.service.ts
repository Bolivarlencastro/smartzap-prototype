import { Injectable } from '@angular/core';
import {
  AuthService,
  Course,
  CoursesApi,
  CourseStage,
  CourseStageContent,
  EnrollmentStatuses,
  STEP_CONTENT_TYPE,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { map } from 'rxjs/operators';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { ClassroomStep } from '../../models';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StepsService {
  constructor(
    private coursesApi: CoursesApi,
    private authService: AuthService,
  ) {}
  loadCourseSteps(course: Course, isViewingAsUser = false) {
    return this.coursesApi
      .getCourseStages(course.id)
      .pipe(map((stages) => this.normalizeStagesToSteps(stages, course, isViewingAsUser)));
  }

  completeStep(step: ClassroomStep, course: Course): Observable<boolean> {
    const userCanCompleteStep = !course?.is_owner && !course?.is_contributor;
    const stepCanBeCompleted = this.isUUID(step.id);
    if (!userCanCompleteStep || !stepCanBeCompleted) {
      return of(false);
    }

    if (step.learn_content_id) {
      return this.completeCourseContent(step.id);
    }

    return this.completeCourseStage(step.id);
  }

  private normalizeStagesToSteps(stages: CourseStage[], course: Course, isViewingAsUser: boolean): ClassroomStep[] {
    const classroomSteps = stages.map((stage) => this.courseStageToClassroomStep(stage));
    const flattenedSteps = this.flattenSteps(classroomSteps);
    const shouldAddFinalSteps = this.shouldAddEvaluationAndFinishSteps(course);
    if (isViewingAsUser || !shouldAddFinalSteps) {
      this.defineStepsOrder(flattenedSteps);
      return flattenedSteps;
    }

    const stepsWithEvaluationAndFinish = this.addFinalSteps(course, flattenedSteps);
    this.defineStepsOrder(stepsWithEvaluationAndFinish);
    return stepsWithEvaluationAndFinish;
  }

  private courseStageToClassroomStep(stage: CourseStage): ClassroomStep {
    const { id, name, description, user_completed, order, contents } = stage;
    let childrenSteps: ClassroomStep[] = [];
    if (contents?.length) {
      childrenSteps = stage.contents.map((stateContent) =>
        this.stageContentToClassroomStep(stateContent, stage.id, `${stage.order}`),
      );
    }
    return {
      id,
      name,
      description,
      completed: user_completed,
      order,
      childrenSteps,
      stepType: 'SUBJECT',
    };
  }

  private stageContentToClassroomStep(
    content: CourseStageContent,
    parentStageId: string,
    stageOrder: string,
  ): ClassroomStep {
    const { learn_content_id, id, name, learn_content_type, order, user_completed, description } = content;
    return {
      id,
      learn_content_id,
      name,
      stepType: learn_content_type.name.toUpperCase() as STEP_CONTENT_TYPE,
      completed: user_completed,
      order: `${stageOrder}.${order}`,
      description,
      parentStageId,
      skippedByUser: false,
    };
  }

  private flattenSteps(steps: ClassroomStep[]): ClassroomStep[] {
    const result: ClassroomStep[] = [];
    steps.forEach((step) => {
      const { childrenSteps, ...stepWithoutChildren } = step;
      result.push(stepWithoutChildren, ...childrenSteps);
    });
    return result;
  }

  private addFinalSteps(course: Course, steps: ClassroomStep[]) {
    let totalStages = steps.filter((step) => step.stepType === 'SUBJECT').length;
    const evaluationStep = this.createEvaluationStep(course, totalStages + 1);
    if (evaluationStep) {
      totalStages++;
      steps.push(evaluationStep);
    }
    const finishStep = this.createFinishStep(course, ++totalStages);
    return [...steps, finishStep];
  }

  private createEvaluationStep(course: Course, order: number): ClassroomStep | undefined {
    const requiredEvaluation = course.required_evaluation;
    const isOwnerOrContributor = course.is_owner || course.is_contributor;

    if (isOwnerOrContributor || !requiredEvaluation) {
      return undefined;
    }

    return {
      id: 'EVALUATION',
      order,
      name: marker('CLASSROOM.COURSE_EVALUATION'),
      stepType: 'SUBJECT',
      completed: !!course.enrollment?.evaluated,
      description: '',
    };
  }

  private createFinishStep(course: Course, order: number): ClassroomStep {
    return {
      description: '',
      order,
      id: 'FINISH',
      name: marker('CLASSROOM.FINISH.TITLE'),
      stepType: 'SUBJECT',
      completed: !!course.enrollment?.evaluated,
    };
  }

  private defineStepsOrder(steps: ClassroomStep[]) {
    let lastCompletedStepIndex = -1;

    for (let i = steps.length - 1; i >= 0; i--) {
      const currentStep = steps[i];
      const previousStep = steps[i - 1];
      const nextStep = steps[i + 1];
      const stepCompleted = currentStep.stepType !== 'SUBJECT' && currentStep.completed;
      currentStep.skippedByUser = i < lastCompletedStepIndex && !currentStep.completed;
      currentStep.prevStepId = previousStep?.id;
      currentStep.nextStepId = nextStep?.id;

      if (stepCompleted) {
        lastCompletedStepIndex = i;
      }
    }
  }

  private isUUID(value: string): boolean {
    const uuidRegex = /^[a-z,0-9-]{36}$/;
    return uuidRegex.test(value);
  }

  private completeCourseStage(stageId: string): Observable<boolean> {
    const userId = this.authService.userId;
    return this.coursesApi.userStageDone(stageId, userId).pipe(map(() => true));
  }

  private completeCourseContent(contentId: string): Observable<boolean> {
    const userId = this.authService.userId;
    return this.coursesApi.userContentDone(contentId, userId).pipe(map(() => true));
  }

  private shouldAddEvaluationAndFinishSteps(course: Course): boolean {
    const enrollmentStatus = course.enrollment?.status;
    if (!enrollmentStatus) {
      return true;
    }
    const inProgressEnrollmentStatuses: EnrollmentStatuses[] = [
      EnrollmentStatuses.ENROLLED,
      EnrollmentStatuses.STARTED,
    ];
    return inProgressEnrollmentStatuses.includes(enrollmentStatus);
  }
}
