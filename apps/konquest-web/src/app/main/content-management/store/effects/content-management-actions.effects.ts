import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContentManagementListActions } from 'app/main/content-management/store/actions';
import { mergeMap } from 'rxjs/operators';
import { ContentManagementActionsService } from 'app/main/content-management/services/content-management-actions/content-management-actions.service';

@Injectable()
export class ContentManagementActionsEffects {
  executeAction$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContentManagementListActions.executeAction),
      mergeMap(({ event }) => this.contentManagementActionsService.executeAction(event)),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly contentManagementActionsService: ContentManagementActionsService,
  ) {}
}
