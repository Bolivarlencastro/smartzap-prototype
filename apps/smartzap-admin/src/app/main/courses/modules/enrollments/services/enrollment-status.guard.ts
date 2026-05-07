import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CourseSelectors } from 'app/main/courses/store/selectors';

@Injectable()
export class EnrollmentStatusGuard {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store.select(CourseSelectors.selectCourseFinished).pipe(take(1));
  }
}
