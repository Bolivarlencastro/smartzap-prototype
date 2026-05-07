import { Injectable } from '@angular/core';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { CustomSectionsService } from '../../services/custom-sections.service';
import { CustomSectionsActions, SectionContentsActions } from '../actions';
import { customSectionsFeature } from '../features';

@Injectable()
export class CustomSectionsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly customSectionsService: CustomSectionsService,
    private readonly messageService: KpMessageService,
    private readonly store: Store,
  ) {}

  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomSectionsActions.init),
      map(() => {
        const activeFeatures = this.customSectionsService.getActiveFeatures();
        return CustomSectionsActions.setActiveFeatures({ activeFeatures });
      }),
    );
  });

  fetchSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        CustomSectionsActions.setActiveFeatures,
        CustomSectionsActions.changePage,
        CustomSectionsActions.deleteSectionSuccess,
        CustomSectionsActions.createSectionSuccess,
        CustomSectionsActions.editSectionSuccess,
        SectionContentsActions.saveSuccess,
        CustomSectionsActions.deleteContentSuccess,
      ),
      concatLatestFrom(() => this.store.select(customSectionsFeature.selectPageType)),
      switchMap(([_, pageType]) =>
        this.customSectionsService
          .fetchSections(pageType)
          .pipe(map((sections) => CustomSectionsActions.setSections({ sections }))),
      ),
    );
  });

  openSectionCreationDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomSectionsActions.openSectionCreationDialog),
      switchMap(({ id }) =>
        this.customSectionsService
          .openSectionFormDialog()
          .afterClosed()
          .pipe(
            filter((res) => !!res),
            map((data) => CustomSectionsActions.createSection({ id, data })),
          ),
      ),
    );
  });

  createSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomSectionsActions.createSection),
      switchMap(({ id, data }) =>
        this.customSectionsService.createSection(id, data).pipe(
          map(() => CustomSectionsActions.createSectionSuccess({ message: 'CUSTOM_SECTIONS.ACTIONS.CREATE_SUCCESS' })),
          catchError(() =>
            of(CustomSectionsActions.createSectionFailure({ message: 'CUSTOM_SECTIONS.ACTIONS.CREATE_FAILURE' })),
          ),
        ),
      ),
    );
  });

  openSectionEditionDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomSectionsActions.openSectionEditionDialog),
      switchMap(({ data }) =>
        this.customSectionsService
          .openSectionFormDialog(data)
          .afterClosed()
          .pipe(
            filter((res) => !!res),
            map((data) => CustomSectionsActions.editSection({ data })),
          ),
      ),
    );
  });

  editSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomSectionsActions.editSection),
      switchMap(({ data }) =>
        this.customSectionsService.editSection(data).pipe(
          map(() => CustomSectionsActions.editSectionSuccess({ message: 'CUSTOM_SECTIONS.ACTIONS.EDIT_SUCCESS' })),
          catchError(() =>
            of(CustomSectionsActions.editSectionFailure({ message: 'CUSTOM_SECTIONS.ACTIONS.EDIT_FAILURE' })),
          ),
        ),
      ),
    );
  });

  openDeleteSectionDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomSectionsActions.openDeleteSectionDialog),
      switchMap(({ id }) =>
        this.customSectionsService.openDeleteSectionDialog().pipe(
          filter((value) => value === true),
          map(() => CustomSectionsActions.deleteSection({ id })),
        ),
      ),
    );
  });

  deleteSection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomSectionsActions.deleteSection),
      switchMap(({ id }) =>
        this.customSectionsService.deleteSection(id).pipe(
          map(() => CustomSectionsActions.deleteSectionSuccess({ message: 'CUSTOM_SECTIONS.ACTIONS.DELETE_SUCCESS' })),
          catchError(() =>
            of(CustomSectionsActions.deleteSectionFailure({ message: 'CUSTOM_SECTIONS.ACTIONS.DELETE_FAILURE' })),
          ),
        ),
      ),
    );
  });

  deleteContent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomSectionsActions.deleteContent),
      switchMap(({ data }) =>
        this.customSectionsService.deleteContent(data).pipe(
          map(() =>
            CustomSectionsActions.deleteContentSuccess({ message: 'CUSTOM_SECTIONS.ACTIONS.DELETE_CONTENT_SUCCESS' }),
          ),
          catchError(() =>
            of(
              CustomSectionsActions.deleteContentFailure({ message: 'CUSTOM_SECTIONS.ACTIONS.DELETE_CONTENT_FAILURE' }),
            ),
          ),
        ),
      ),
    );
  });

  reorderSections$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CustomSectionsActions.reorderSections),
        switchMap(({ ids }) => this.customSectionsService.reorderSections(ids)),
      );
    },
    { dispatch: false },
  );

  showSucessMessage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          CustomSectionsActions.deleteSectionSuccess,
          CustomSectionsActions.editSectionSuccess,
          CustomSectionsActions.createSectionSuccess,
          SectionContentsActions.saveSuccess,
          CustomSectionsActions.editSectionSuccess,
        ),
        map(({ message }) => this.messageService.success(message)),
      );
    },
    { dispatch: false },
  );

  showFailureMessage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          CustomSectionsActions.deleteSectionFailure,
          CustomSectionsActions.editSectionFailure,
          CustomSectionsActions.createSectionFailure,
          SectionContentsActions.saveFailure,
          CustomSectionsActions.deleteContentFailure,
        ),
        map(({ message }) => this.messageService.error(message)),
      );
    },
    { dispatch: false },
  );
}
