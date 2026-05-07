import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { CourseSelectors } from 'app/main/courses/store/selectors';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class CourseStatusGuard {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store.select(CourseSelectors.selectIsNotProcessing).pipe(take(1));
  }
}
