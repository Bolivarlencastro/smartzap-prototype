import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CreationService } from '../../services/creation.service';
import { CreationActions } from '../actions';
import { creationFeature } from '../features';

@Injectable()
export class CreationEffects {
  private readonly router = inject(Router);

  loadData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CreationActions.loadData),
      switchMap(() =>
        this.creationService.fetchTemplates().pipe(
          map((templates) => CreationActions.loadDataSuccess({ templates })),
          catchError(() => of(CreationActions.loadDataFailure())),
        ),
      ),
    );
  });

  loadCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CreationActions.loadCourses),
      concatLatestFrom(() => this.store.select(creationFeature.selectCoursesFilter)),
      switchMap(([_, filter]) =>
        this.creationService
          .fetchCourses(filter)
          .pipe(map((courses) => CreationActions.loadCoursesSuccess({ courses }))),
      ),
    );
  });

  validateCampaign$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CreationActions.validateCampaign),
      switchMap(({ template_id, file, template_variables }) =>
        this.creationService.validateCampaign({ template_id, file, template_variables }).pipe(
          map((validationResult) =>
            CreationActions.validateCampaignSuccess({
              validationResult,
              validatedWith: {
                templateId: template_id,
                templateVariables: template_variables ?? '',
                fileName: file.name,
              },
            }),
          ),
          catchError(() => of(CreationActions.validateCampaignFailure())),
        ),
      ),
    );
  });

  createCampaign$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CreationActions.createCampaign),
      switchMap(({ params }) =>
        this.creationService.createCampaign(params).pipe(
          map(() => CreationActions.createCampaignSuccess()),
          catchError(() => of(CreationActions.createCampaignFailure())),
        ),
      ),
    );
  });

  navigateOnSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CreationActions.createCampaignSuccess),
        tap(() => this.router.navigate(['/push-manager/panel'])),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly creationService: CreationService,
    private readonly store: Store,
  ) {}
}
