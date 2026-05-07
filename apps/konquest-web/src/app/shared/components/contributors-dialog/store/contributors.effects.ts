import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { ContributorsDialogService } from '../services/contributors-dialog.service';
import { ContributorDialogActions } from './contributors.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { contributorsFeature } from './contributors.feature';
import { of } from 'rxjs';
import { UserService } from '@core/api';
import { KpSnackLoadingComponent } from '@keeps-platform-frontend-workspace/ui/kp-snack-loading';
import { MatSnackBar } from '@angular/material/snack-bar';

const DISPLAY_ACTIONS = [
  ContributorDialogActions.addContributor,
  ContributorDialogActions.removeContributor,
  ContributorDialogActions.loadContributors,
  ContributorDialogActions.filterContributors,
];

const DISMISS_ACTIONS = [
  ContributorDialogActions.addContributorSuccess,
  ContributorDialogActions.addContributorFailure,
  ContributorDialogActions.removeContributorSuccess,
  ContributorDialogActions.removeContributorFailure,
  ContributorDialogActions.loadContributorsSuccess,
  ContributorDialogActions.loadContributorsFailure,
  ContributorDialogActions.filterContributorsSuccess,
  ContributorDialogActions.filterContributorsFailure,
];

@Injectable()
export class ContributorsEffects {
  openDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContributorDialogActions.openDialog),
      switchMap(() => this._contributorsDialogService.openDialog().pipe(map(() => ContributorDialogActions.reset()))),
    );
  });

  loadContributorsOnOpen$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContributorDialogActions.openDialog),
      map(() => ContributorDialogActions.loadContributors()),
    );
  });

  loadContributors$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContributorDialogActions.loadContributors),
      concatLatestFrom(() => [
        this.store.select(contributorsFeature.selectContentType),
        this.store.select(contributorsFeature.selectRelatedContentId),
      ]),
      switchMap(([_, contentType, contentId]) =>
        this._contributorsDialogService.loadContributors(contentType, contentId).pipe(
          map((contributors) => ContributorDialogActions.loadContributorsSuccess({ contributors })),
          catchError(() => of(ContributorDialogActions.loadContributorsFailure())),
        ),
      ),
    );
  });

  filterContributorUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContributorDialogActions.filterContributors),
      switchMap(({ search }) =>
        this._usersService.fetchByQuery({ limit: 10, search }).pipe(
          map((response) => ContributorDialogActions.filterContributorsSuccess({ users: response.data })),
          catchError(() => of(ContributorDialogActions.filterContributorsFailure())),
        ),
      ),
    );
  });

  addContributor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContributorDialogActions.addContributor),
      concatLatestFrom(() => [
        this.store.select(contributorsFeature.selectContentType),
        this.store.select(contributorsFeature.selectRelatedContentId),
      ]),
      switchMap(([{ userId }, contentType, contentId]) =>
        this._contributorsDialogService.addContributors(contentType, contentId, userId).pipe(
          map((contributor) => ContributorDialogActions.addContributorSuccess({ contributor })),
          catchError(() => of(ContributorDialogActions.addContributorFailure())),
        ),
      ),
    );
  });

  removeContributor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ContributorDialogActions.removeContributor),
      concatLatestFrom(() => [
        this.store.select(contributorsFeature.selectContentType),
        this.store.select(contributorsFeature.selectRelatedContentId),
      ]),
      switchMap(([{ userId }, contentType, contentId]) =>
        this._contributorsDialogService.deleteContributor(contentType, contentId, userId).pipe(
          map(() => ContributorDialogActions.removeContributorSuccess({ userId })),
          catchError(() => of(ContributorDialogActions.removeContributorFailure())),
        ),
      ),
    );
  });

  displayLoading$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...DISPLAY_ACTIONS),
        tap(() => this._snackBar.openFromComponent(KpSnackLoadingComponent, { horizontalPosition: 'center' })),
      );
    },
    { dispatch: false },
  );

  dismissLoading$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...DISMISS_ACTIONS),
        tap(() => this._snackBar.dismiss()),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private _contributorsDialogService: ContributorsDialogService,
    private _usersService: UserService,
    private _snackBar: MatSnackBar,
  ) {}
}
