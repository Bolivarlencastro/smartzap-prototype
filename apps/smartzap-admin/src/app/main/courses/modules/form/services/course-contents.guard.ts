import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { CourseSelectors } from 'app/main/courses/store/selectors';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class CourseContentsGuard {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store.select(CourseSelectors.selectIsInformationFormCompleted).pipe(take(1));
  }
}
