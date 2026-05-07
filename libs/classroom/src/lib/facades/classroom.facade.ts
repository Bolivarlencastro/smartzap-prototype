import { Injectable, Signal } from '@angular/core';
import { CMI, Enrollment, QuestionRequest } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ActivityTrackerEvent } from '@keeps-platform-frontend-workspace/ui/kp-player-activity-tracker-wrapper';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile } from 'rxjs';
import {
  ActivityActions,
  ClassroomThemeActions,
  CourseActions,
  CourseExamActions,
  ScormCMIActions,
  StepNavigationActions,
} from '../store/actions';
import {
  classroomContentFeature,
  classroomCourseFeature,
  classroomExamFeature,
  classroomScormFeature,
  classroomStepsFeature,
  classroomThemeFeature,
} from '../store/features';
import { BaseFacade } from './base.facade';
import { ClassroomStep, ProgressPanelViewModel } from '../models';
import { KpCountdown } from '@keeps-platform-frontend-workspace/ui/kp-countdown';
import { toSignal } from '@angular/core/rxjs-interop';

export interface ClassroomViewModel {
  themeIcon: string;
  courseName: any;
  steps: ClassroomStep[];
  currentStep: ClassroomStep;
  disabledNext: boolean;
  currentStepIndex: number;
  showNavigationControls: boolean;
  totalSteps: number;
  progressPanel: ProgressPanelViewModel;
  certificateAvailable: boolean;
  countdown: KpCountdown;
  certificateLink: string | null;
  enrollment: Enrollment;
}

@Injectable({
  providedIn: 'root',
})
export class ClassroomFacade extends BaseFacade {
  readonly themeIcon$ = this.select(classroomThemeFeature.selectThemeIcon);
  readonly course$ = this.select(classroomCourseFeature.selectCourse);
  readonly courseName$ = this.select(classroomCourseFeature.selectCourseName);
  readonly enrollment$ = this.select(classroomCourseFeature.selectEnrollment);
  readonly courseSteps$ = this.select(classroomStepsFeature.selectParsedSteps);
  readonly currentStep$ = this.select(classroomStepsFeature.selectCurrentStep);
  readonly disabledNext$ = this.select(classroomStepsFeature.selectDisabledNext);
  readonly currentStepIndex$ = this.select(classroomStepsFeature.currentStepIndex);
  readonly showNavigationControls$ = this.select(classroomStepsFeature.selectShowNavigationControls);
  readonly totalSteps$ = this.select(classroomStepsFeature.selectTotalSteps);
  readonly content$ = this.select(classroomContentFeature.selectContent);
  readonly scormCMI$ = this.select(classroomScormFeature.selectCmi);
  readonly examLoading$ = this.select(classroomExamFeature.selectLoading);
  readonly examQuestions$ = this.select(classroomExamFeature.selectQuestions);
  readonly examAnswers$ = this.select(classroomExamFeature.selectAnswers);
  readonly answeringQuiz$ = this.select(classroomExamFeature.selectAnsweringQuestion);
  readonly examScore$ = this.select(classroomExamFeature.selectScore);
  readonly examLoadingScore$ = this.select(classroomExamFeature.selectLoadingScore);
  readonly examRandomizeQuestions$ = this.select(classroomExamFeature.selectRandomizeQuestions);
  readonly examRandomizeOptions$ = this.select(classroomExamFeature.selectRandomizeOptions);
  readonly progressPanel$ = this.select(classroomCourseFeature.selectProgressPanel);
  readonly certificateAvailable$ = this.select(classroomCourseFeature.selectCertificateAvailable);
  readonly certificateUrl$ = this.select(classroomCourseFeature.selectCertificateUrl);
  readonly countdown$ = this.select(classroomStepsFeature.selectContentMinDuration);
  readonly isViewingAsUser: Signal<boolean>;

  readonly view$: Observable<ClassroomViewModel>;
  private lastLoadedCourseId: string = undefined;

  constructor(store: Store) {
    super(store);
    this.view$ = this.createViewObject();
    this.isViewingAsUser = toSignal(this.select(classroomCourseFeature.selectIsViewingAsUser));
  }

  private createViewObject(): Observable<ClassroomViewModel> {
    return combineLatest({
      themeIcon: this.themeIcon$,
      courseName: this.courseName$,
      steps: this.courseSteps$,
      currentStep: this.currentStep$,
      disabledNext: this.disabledNext$,
      currentStepIndex: this.currentStepIndex$,
      showNavigationControls: this.showNavigationControls$,
      totalSteps: this.totalSteps$,
      progressPanel: this.progressPanel$,
      certificateAvailable: this.certificateAvailable$,
      countdown: this.countdown$,
      certificateLink: this.certificateAvailable$.pipe(
        map((certificateAvailable) => (certificateAvailable ? 'certificate' : null)),
      ),
      enrollment: this.enrollment$,
    });
  }

  loadCourse(courseId: string, rollbackPath: string, isViewingAsUser = false) {
    this.assertLoadedCourse(courseId);
    this.store.dispatch(CourseActions.loadCourse({ courseId, rollbackPath, isViewingAsUser }));
  }

  clearCourse() {
    this.store.dispatch(CourseActions.reset());
    this.lastLoadedCourseId = undefined;
  }

  answerQuestion(answer: QuestionRequest) {
    this.store.dispatch(CourseExamActions.answerQuestion({ answer }));
  }

  toggleTheme() {
    this.store.dispatch(ClassroomThemeActions.toggleClassroomTheme());
  }

  loadClassroomTheme() {
    this.store.dispatch(ClassroomThemeActions.loadTheme());
  }

  restoreWorkspaceTheme() {
    this.store.dispatch(ClassroomThemeActions.resetConfig());
  }

  goToStep(stepId: string, countdownFinished: boolean) {
    this.store.dispatch(StepNavigationActions.goToStep({ stepId, countdownFinished }));
  }

  nextStep() {
    this.store.dispatch(StepNavigationActions.next());
  }

  previousStep(countdownFinished: boolean) {
    this.store.dispatch(StepNavigationActions.previous({ countdownFinished }));
  }

  onActivityEvent(event: ActivityTrackerEvent) {
    if (this.isViewingAsUser()) {
      return;
    }

    this.store.dispatch(ActivityActions.onActivityEvent({ event }));
  }

  loadScormCMI() {
    this.store.dispatch(ScormCMIActions.loadScormCMI());
  }

  saveScormCMI(cmi: CMI) {
    if (this.isViewingAsUser()) {
      return;
    }

    this.store.dispatch(ScormCMIActions.saveScormCMI({ cmi }));
  }

  storeLastEmittedScormCMI(cmi: CMI) {
    if (this.isViewingAsUser()) {
      return;
    }

    this.store.dispatch(ScormCMIActions.storeLastEmittedScormCMI({ cmi }));
  }

  saveLastEmittedScormCMI() {
    if (this.isViewingAsUser()) {
      return;
    }

    this.store.dispatch(ScormCMIActions.saveLastEmittedScormCMI());
  }

  leaveCourse() {
    this.store.dispatch(CourseActions.openLeaveConfirmationDialog());
  }

  changeGoalDate(date: Date) {
    this.store.dispatch(CourseActions.updateGoalDate({ date }));
  }

  toggleGoalDateMenu(value: boolean) {
    this.store.dispatch(CourseActions.toggleGoalDateMenu({ value }));
  }

  finishCourse() {
    this.store.dispatch(CourseActions.openFinishCourseConfirmationDialog());
  }

  loadCertificate() {
    this.store.dispatch(CourseActions.loadCertificate());
  }

  shareCertificate() {
    this.store.dispatch(CourseActions.shareCertificate());
  }

  getScormCMIStream() {
    return combineLatest([this.content$, this.course$, this.currentStep$]).pipe(
      skipWhile(([content, course, currentStep]) => !content || !course || !currentStep),
      map(([content, course, currentStep]) => ({ content, course, currentStep })),
    );
  }

  private assertLoadedCourse(newCourseId: string) {
    if (this.lastLoadedCourseId && this.lastLoadedCourseId !== newCourseId) {
      this.clearCourse();
    }
  }
}
