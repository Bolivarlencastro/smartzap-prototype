import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { CoursesService } from '../../services';
import { CourseActions, UploadActions } from '../actions';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class UploadEffects {
  uploadImage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UploadActions.uploadImage),
      concatMap(({ file, imageType }) => {
        return this._coursesService.uploadImage(file, imageType).pipe(
          map((image) => UploadActions.uploadImageSuccess({ image, imageType })),
          catchError((error) => of(UploadActions.uploadImageFailure({ error }))),
        );
      }),
    );
  });

  refreshEnrollment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(UploadActions.uploadImageSuccess),
      map(({ image, imageType }) => CourseActions.changeCourseImage({ image, imageType })),
    );
  });

  uploadImageerror$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(UploadActions.uploadImageFailure),
        tap(() => this._messageServie.error('API.ERROR.UPLOAD_IMAGE')),
      );
    },
    { dispatch: false },
  );

  constructor(
    private _coursesService: CoursesService,
    private readonly _messageServie: KpMessageService,
    private _actions$: Actions,
  ) {}
}
