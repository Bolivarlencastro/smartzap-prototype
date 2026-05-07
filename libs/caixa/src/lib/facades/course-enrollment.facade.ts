import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CourseEnrollmentActions, courseEnrollmentFeature, PartnerSelectionActions } from '../store';
import { CourseEnrollmentData, CourseEnrollmentViewModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CourseEnrollmentFacade {
  readonly viewModel$: Observable<CourseEnrollmentViewModel>;

  constructor(private readonly store: Store) {
    this.viewModel$ = this.store.select(courseEnrollmentFeature.selectViewModel);
  }

  enrollOnCourse(courseEnrollmentData: CourseEnrollmentData) {
    this.store.dispatch(CourseEnrollmentActions.enroll({ courseEnrollmentData }));
  }

  reset() {
    this.store.dispatch(CourseEnrollmentActions.reset());
  }

  openPartnerSelection() {
    this.store.dispatch(PartnerSelectionActions.openDialog());
  }
}
