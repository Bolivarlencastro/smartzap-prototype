import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { UserRegistrationService } from '../../services/user-registration.service';
import { CourseEnrollmentActions, UserRegistrationActions } from '../actions';
import { courseListFeature, userRegistrationFeature } from '../features';
import { EnrollmentResult } from '../../models';

@Injectable()
export class UserRegistrationEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly userRegistrationService: UserRegistrationService,
  ) {}

  openDialog = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserRegistrationActions.openDialog),
        tap(() => this.userRegistrationService.openDialog()),
      );
    },
    { dispatch: false },
  );

  searchPartner$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserRegistrationActions.searchPartner),
      concatLatestFrom(() => this.store.select(userRegistrationFeature.selectPartnerType)),
      switchMap(([{ search }, partnerType]) =>
        this.userRegistrationService.searchPartner(search, partnerType).pipe(
          map((result) => UserRegistrationActions.searchPartnerSuccess({ result })),
          catchError((error) => of(UserRegistrationActions.searchPartnerFailure({ error }))),
        ),
      ),
    );
  });

  signUpUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserRegistrationActions.signUpUser),
      concatLatestFrom(() => this.store.select(courseListFeature.selectCurrentOpenCourse)),
      switchMap(([{ userSignUpDto }, currentOpenCourse]) =>
        this.userRegistrationService.signUpUser(userSignUpDto, currentOpenCourse?.id).pipe(
          map((response) =>
            UserRegistrationActions.signUpUserSuccess({ response, isEnrolledInCourse: !!currentOpenCourse?.id }),
          ),
          catchError((error) => of(UserRegistrationActions.signUpUserFailure({ error }))),
        ),
      ),
    );
  });

  showEnrollmentSuccessDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserRegistrationActions.signUpUserSuccess),
      map(({ isEnrolledInCourse }) => {
        const result: EnrollmentResult = isEnrolledInCourse ? 'enrolled' : 'registered';
        return CourseEnrollmentActions.openEnrollmentResultDialog({ result });
      }),
    );
  });

  closeDialogAfterSignup$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserRegistrationActions.signUpUserSuccess),
        map(() => this.userRegistrationService.closeDialog()),
      );
    },
    { dispatch: false },
  );
}
