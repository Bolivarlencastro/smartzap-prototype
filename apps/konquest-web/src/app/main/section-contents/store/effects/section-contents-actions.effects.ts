import { Injectable } from '@angular/core';
import { SectionContentItemActions } from 'app/main/section-contents/store/actions';
import { SectionContentActionsService } from '../../services/section-content-actions/section-content-actions.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class SectionContentsActionsEffects {
  executeAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectionContentItemActions.executeAction),
      mergeMap(({ event }) => this.sectionContentActionsService.executeAction(event)),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly sectionContentActionsService: SectionContentActionsService,
  ) {}
}
