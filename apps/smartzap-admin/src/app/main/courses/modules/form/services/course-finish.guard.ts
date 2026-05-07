import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { LessonsSelectors } from 'app/main/courses/store/selectors';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class CourseFinishGuard {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store.select(LessonsSelectors.selectIsContentsFormCompleted).pipe(take(1));
  }
}
