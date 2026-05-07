import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { GroupDetailActions } from '.';
import { GroupDetailService } from '../services/group-detail.service';

@Injectable()
export class GroupDetailEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly groupDetailService: GroupDetailService,
  ) {}

  getGroupDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupDetailActions.getGroupDetail),
      switchMap(({ id }) =>
        this.groupDetailService
          .getGroupDetail(id)
          .pipe(map((group) => GroupDetailActions.getGroupDetailSuccess({ group }))),
      ),
    );
  });
}
