import { Injectable } from '@angular/core';
import { KonquestFeaturesService } from '@app/shared/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { COURSES_SERVICE_ID, EVENTS_SERVICE_ID, HIGHLIGHTS_SERVICE_ID, TRAILS_SERVICE_ID } from '../../models/home';
import { HomeService } from '../../services/home.service';
import { HomeActions } from '../actions';

@Injectable()
export class HomeEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly konquestFeatureServices: KonquestFeaturesService,
    private readonly homeService: HomeService,
  ) {}

  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.init),
      map(() => {
        const highlights = this.konquestFeatureServices.isServiceActive(HIGHLIGHTS_SERVICE_ID);
        const trails = this.konquestFeatureServices.isServiceActive(TRAILS_SERVICE_ID);
        const courses = this.konquestFeatureServices.isServiceActive(COURSES_SERVICE_ID);
        const events = this.konquestFeatureServices.isServiceActive(EVENTS_SERVICE_ID);
        return HomeActions.setActiveFeatures({
          highlights,
          trails,
          courses,
          events,
        });
      }),
    );
  });

  loadSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.loadSections),
      filter(({ id }) => id !== 'events'),
      switchMap(({ id }) =>
        this.homeService.loadSections(id).pipe(
          map((sections) => HomeActions.loadSectionsSuccess({ sections })),
          catchError(() => of(HomeActions.loadSectionsFailure())),
        ),
      ),
    );
  });
}
