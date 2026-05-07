import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UIActions } from 'app/shared/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { CoursesService, LessonsService } from '../../services';
import { CourseActions, LessonsActions } from '../actions';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class LessonsEffects {
  loadLessons$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.loadLessons),
      concatMap(({ course_id }) =>
        this._coursesService.fetchLessons(course_id).pipe(
          map((lessons) => LessonsActions.loadLessonsSuccess({ lessons })),
          catchError((error) => of(LessonsActions.loadLessonsFailure(error))),
        ),
      ),
    );
  });

  createLesson$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.createLesson),
      concatMap(({ course, name, order }) =>
        this._lessonsService.create({ course, name, order }).pipe(
          map((payload) => LessonsActions.createLessonSuccess({ payload })),
          catchError((error) => {
            const errorMessage = error.i18n
              ? `COURSE.FORM.ERROR.BY_FIELD.${error.i18n}`
              : 'COURSE.MESSAGE.LESSON_CREATE_ERROR';
            return of(
              LessonsActions.createLessonFailure({
                error: errorMessage,
              }),
            );
          }),
        ),
      ),
    );
  });

  editLesson$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.editLesson),
      concatMap(({ id, data }) => {
        const { name, description } = data;
        return this._lessonsService.edit({ id, name, description }).pipe(
          map(() =>
            LessonsActions.editLessonSuccess({
              lesson: { id, changes: { name, description: description } },
            }),
          ),
          catchError((error) => {
            const errorMessage = error.i18n
              ? `COURSE.FORM.ERROR.BY_FIELD.${error.i18n}`
              : 'COURSE.MESSAGE.LESSON_EDIT_ERROR';
            return of(
              LessonsActions.editLessonFailure({
                error: errorMessage,
              }),
            );
          }),
        );
      }),
    );
  });

  deleteLesson$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.deteleLesson),
      concatMap((action) =>
        this._lessonsService.delete(action).pipe(
          map(() => LessonsActions.deteleLessonSuccess({ id: action.id })),
          catchError(() =>
            of(
              LessonsActions.deteleLessonFailure({
                error: 'COURSE.MESSAGE.LESSON_DELETE_ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  createContent$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.createContent),
      concatMap(({ lesson_id, contentFormData, messagesContentEmbed }) =>
        this._lessonsService.createContent(lesson_id, contentFormData, messagesContentEmbed).pipe(
          switchMap(() => this._lessonsService.fetchLessonContents(lesson_id)),
          map((contents) =>
            LessonsActions.updateLessonContents({
              payload: { id: lesson_id, changes: { contents } },
            }),
          ),
          catchError((error) => {
            const defaultErrorMessage = error.i18n
              ? `COURSE.FORM.ERROR.BY_FIELD.${error.i18n}`
              : 'COURSE.MESSAGE.LESSON_CONTENT_CREATE_ERROR';
            const statusCode = error.status;
            const errorMessageByStatusCodeMap: Record<number, string> = {
              500: 'COURSE.MESSAGE.LESSON_CONTENT_INVALID_FILE_ERROR',
              504: 'COURSE.MESSAGE.LESSON_CONTENT_TIMEOUT_ERROR',
            };
            const errorMessage = errorMessageByStatusCodeMap[statusCode] || defaultErrorMessage;
            return of(
              LessonsActions.createContentFailure({
                error: errorMessage,
              }),
            );
          }),
        ),
      ),
    );
  });

  deleteContent$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.deleteContent),
      concatMap(({ lesson_id, content_id }) =>
        this._lessonsService.deleteContent(content_id).pipe(
          switchMap(() => this._lessonsService.fetchLessonContents(lesson_id)),
          map((contents) =>
            LessonsActions.updateLessonContents({
              payload: { id: lesson_id, changes: { contents } },
            }),
          ),
          catchError(() =>
            of(
              LessonsActions.createContentFailure({
                error: 'COURSE.MESSAGE.LESSON_CONTENT_DELETE_ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  editContent$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.editContent),
      concatMap(({ lesson_id, content_id, data }) =>
        this._lessonsService.editContent(content_id, data).pipe(
          switchMap(() => this._lessonsService.fetchLessonContents(lesson_id)),
          map((contents) =>
            LessonsActions.updateLessonContents({
              payload: { id: lesson_id, changes: { contents } },
            }),
          ),
          catchError((error) => {
            const errorMessage = error.i18n
              ? `COURSE.FORM.ERROR.BY_FIELD.${error.i18n}`
              : 'COURSE.MESSAGE.LESSON_CONTENT_EDIT_ERROR';
            return of(
              LessonsActions.editContentFailure({
                error: errorMessage,
              }),
            );
          }),
        ),
      ),
    );
  });

  editContentDispatchIn$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.editDispatchIn),
      concatMap((action) =>
        this._lessonsService.updateContentDispatchIn(action).pipe(
          switchMap(() => this._lessonsService.fetchLessonContents(action.lesson_id)),
          map((contents) =>
            LessonsActions.updateLessonContents({
              payload: { id: action.lesson_id, changes: { contents } },
            }),
          ),
          catchError(() =>
            of(
              LessonsActions.editContentFailure({
                error: 'COURSE.MESSAGE.LESSON_CONTENT_EDIT_ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  editContentDispatchPeriod$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.editDispatchPeriod),
      concatMap((action) =>
        this._lessonsService.updateContentDispatchPeriod(action).pipe(
          switchMap(() => this._lessonsService.fetchLessonContents(action.lesson_id)),
          map((contents) =>
            LessonsActions.updateLessonContents({
              payload: { id: action.lesson_id, changes: { contents } },
            }),
          ),
          catchError(() =>
            of(
              LessonsActions.editContentFailure({
                error: 'COURSE.MESSAGE.LESSON_CONTENT_EDIT_ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  reorderContents$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.reorderContents),
      concatMap(({ lesson_id, contents }) =>
        this._lessonsService.reorderContents(contents).pipe(
          switchMap(() => this._lessonsService.fetchLessonContents(lesson_id)),
          map((updatedContents) =>
            LessonsActions.updateLessonContents({
              payload: { id: lesson_id, changes: { contents: updatedContents } },
            }),
          ),
          catchError(() =>
            of(
              LessonsActions.reorderContentsFailure({
                error: 'COURSE.MESSAGE.LESSON_CONTENT_REORDER_ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  createExam$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(LessonsActions.createExam),
      concatMap(({ lesson_id, data }) =>
        this._lessonsService.createExam(lesson_id, data).pipe(
          switchMap(() => this._lessonsService.fetchLessonContents(lesson_id)),
          map((contents) =>
            LessonsActions.updateLessonContents({
              payload: { id: lesson_id, changes: { contents } },
            }),
          ),
          catchError(() =>
            of(
              LessonsActions.createContentFailure({
                error: 'COURSE.MESSAGE.EXAM_CREATE_ERROR',
              }),
            ),
          ),
        ),
      ),
    );
  });

  showProcessing$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        LessonsActions.deteleLesson,
        LessonsActions.createLesson,
        LessonsActions.editLesson,
        LessonsActions.createContent,
        LessonsActions.createExam,
        LessonsActions.editContent,
        LessonsActions.deleteContent,
        LessonsActions.editDispatchIn,
        LessonsActions.editDispatchPeriod,
      ),
      map(() => UIActions.showProcessing()),
    );
  });

  hideProcessing$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        LessonsActions.deteleLessonSuccess,
        LessonsActions.createLessonSuccess,
        LessonsActions.editLessonSuccess,
        LessonsActions.updateLessonContents,
      ),
      map(() => UIActions.hideProcessing()),
    );
  });

  showFailureMessage$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(
        LessonsActions.deteleLessonFailure,
        LessonsActions.editLessonFailure,
        LessonsActions.createLessonFailure,
        LessonsActions.createContentFailure,
        LessonsActions.editContentFailure,
        LessonsActions.deleteContentFailure,
      ),
      tap(({ error }) => {
        this._messageService.error(error);
      }),
      map(() => UIActions.hideProcessing()),
    );
  });

  clearLessons$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CourseActions.clearSelectedCourse),
      map(() => LessonsActions.clear()),
    );
  });

  constructor(
    private _lessonsService: LessonsService,
    private _coursesService: CoursesService,
    private readonly _messageService: KpMessageService,
    private _actions$: Actions,
  ) {}
}
