import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MessageActions } from 'app/shared/store';
import { map } from 'rxjs/operators';

@Injectable()
export class MessagesEffects {
  success$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MessageActions.success),
        map(({ message, interpolateParams }) => this.messageService.success(message, interpolateParams)),
      );
    },
    { dispatch: false },
  );

  info$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MessageActions.info),
        map(({ message, interpolateParams }) => this.messageService.info(message, interpolateParams)),
      );
    },
    { dispatch: false },
  );

  error$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MessageActions.error),
        map(({ message, interpolateParams }) => this.messageService.error(message, interpolateParams)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private messageService: KpMessageService,
  ) {}
}
