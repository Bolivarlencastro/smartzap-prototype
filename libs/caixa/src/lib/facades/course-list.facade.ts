import { Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { CourseEnrollmentActions, CourseListActions, courseListFeature } from '../store';
import { CardAction, CoursesListViewModel } from '../models';
import {
  CaixaCourse,
  CaixaSmartZapCourseEnrollmentDto,
  CourseListFilter,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearnContentCardData } from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import {
  selectCoursesWithEnrollments,
  selectCurrentOpenCourseEnrollment,
} from '../store/features/courses-with-enrollments.selector';
import { LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';

@Injectable({
  providedIn: 'root',
})
export class CourseListFacade {
  readonly viewModel: Signal<CoursesListViewModel>;
  readonly courses: Signal<LearnContentCardData[]>;
  readonly currentOpenCourse: Signal<CaixaCourse>;
  readonly currentCourseEnrollment: Signal<{ enrollment: CaixaSmartZapCourseEnrollmentDto; tag: LearnContentCardTag }>;

  constructor(private readonly store: Store) {
    this.viewModel = toSignal(this.store.select(courseListFeature.selectVM));
    this.courses = toSignal(this.store.select(selectCoursesWithEnrollments));
    this.currentOpenCourse = toSignal(this.store.select(courseListFeature.selectCurrentOpenCourse));
    this.currentCourseEnrollment = toSignal(this.store.select(selectCurrentOpenCourseEnrollment));
  }

  init(route: ActivatedRoute) {
    this.store.dispatch(CourseListActions.init());
    this.configureRouteParams(route);
  }

  filterCourses(filter: CourseListFilter) {
    this.store.dispatch(CourseListActions.filterCourses({ filter }));
  }

  dispatchAction(action: CardAction) {
    this.store.dispatch(CourseListActions.dispatchAction({ action }));
  }

  openEnrollmentCancelConfirmationDialog() {
    this.store.dispatch(CourseEnrollmentActions.openEnrollmentCancelConfirmationDialog());
  }

  detailsDialogClosed() {
    this.store.dispatch(CourseListActions.detailsDialogClosed());
  }

  private configureRouteParams(route: ActivatedRoute) {
    route.queryParams
      .pipe(
        map((params) => params?.['id']),
        distinctUntilChanged(),
        filter((id) => !!id),
        takeUntilDestroyed(),
      )
      .subscribe((courseId) => this.store.dispatch(CourseListActions.getCourseToOpenDetails({ courseId })));
  }
}
