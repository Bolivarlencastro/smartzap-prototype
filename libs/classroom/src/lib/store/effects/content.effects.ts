import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { ContentService } from '../../services';
import { ContentActions, CourseActions, StepNavigationActions } from '../actions';
import { concatLatestFrom } from '@ngrx/operators';
import { classroomStepsFeature } from '../features';
import { Store } from '@ngrx/store';

@Injectable()
export class ContentEffects {
  loadContentOnNavigation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StepNavigationActions.navigate),
      concatLatestFrom(({ stepId }) => [this.store.select(classroomStepsFeature.selectStepById(stepId))]),
      filter(([, step]) => !!step?.learn_content_id && step.stepType !== 'QUESTION'),
      map(([_action, step]) => ContentActions.loadContent({ contentId: step.learn_content_id })),
    );
  });

  loadContent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContentActions.loadContent),
      switchMap(({ contentId }) =>
        this.contentService.loadContent(contentId).pipe(
          map((content) => ContentActions.loadContentSuccess({ content })),
          catchError((error) => of(ContentActions.loadContentFailure({ error }))),
        ),
      ),
    );
  });

  showErrorDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContentActions.loadContentFailure),
      switchMap(() => this.contentService.openContentErrorDialog().pipe(map(() => CourseActions.leaveCourse()))),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly contentService: ContentService,
    private readonly store: Store,
  ) {}
}
