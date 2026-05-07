import { Injectable } from '@angular/core';
import { EvaluationsFilterService } from '@app/main/mission/services/evaluations-filter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap } from 'rxjs';
import { EvaluationsFilterActions, MissionDetailActions } from '../actions';

@Injectable()
export class EvaluationsFilterEffects {
  $openFilters = createEffect(() => {
    return this.actions$.pipe(
      ofType(EvaluationsFilterActions.openFilterDialog),
      switchMap(({ id }) =>
        this.evaluationsFilterService.openFiltersDialog(id).pipe(
          filter((result) => !!result),
          map((result) => EvaluationsFilterActions.storeFilterControllerState({ filterState: result })),
        ),
      ),
    );
  });

  $storeFilterControllerState = createEffect(() => {
    return this.actions$.pipe(
      ofType(EvaluationsFilterActions.storeFilterControllerState),
      map(({ filterState }) => MissionDetailActions.loadEvaluations({ filters: { ...filterState.filter } })),
    );
  });

  constructor(
    private actions$: Actions,
    private evaluationsFilterService: EvaluationsFilterService,
  ) {}
}
