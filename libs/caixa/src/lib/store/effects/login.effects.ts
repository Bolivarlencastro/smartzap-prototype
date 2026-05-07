import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginService } from '../../services/login.service';
import { CourseEnrollmentActions, LoginActions, UserRegistrationActions } from '../actions';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { maskCpf } from '../../common/helpers';
import { RegistrationNotFoundAction } from '../../models';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { loginFeature } from '../features';

@Injectable()
export class LoginEffects {
  verifyUserLoggedIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.checkUserLogin),
      map(() => this.loginService.currentUser()),
      filter((user) => !!user),
      map((user) => LoginActions.setUser({ user })),
    );
  });

  openLoginDialog$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LoginActions.openDialog),
        map(() => this.loginService.openLoginDialog()),
      );
    },
    { dispatch: false },
  );

  searchUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.searchUserForLogin),
      switchMap(({ search }) =>
        this.loginService.searchUserForLogin(search).pipe(
          map((user) => LoginActions.searchUserForLoginSuccess({ user })),
          catchError((err) => of(LoginActions.searchUserForLoginFailure({ error: err }))),
        ),
      ),
    );
  });

  loginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.searchUserForLoginSuccess),
      tap(() => this.loginService.closeDialog()),
      map(({ user }) => LoginActions.setUser({ user: { ...user, cpf: maskCpf(user.cpf) } })),
    );
  });

  clearCurrentUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LoginActions.clearCurrentUser),
        tap(() => this.loginService.clearUser()),
      );
    },
    { dispatch: false },
  );

  openRegistrationNotFoundDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.searchUserForLoginFailure),
      tap(() => this.loginService.closeDialog()),
      switchMap(() =>
        this.loginService.openRegistrationNotFoundDialog().pipe(
          map((action: RegistrationNotFoundAction) => {
            if (action === 'contact-support') {
              return CourseEnrollmentActions.redirectToSupportWhatsApp();
            }
            return UserRegistrationActions.openDialog();
          }),
        ),
      ),
    );
  });

  storeUserAfterSignUp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserRegistrationActions.signUpUserSuccess),
      map(({ response }) => ({ ...response, cpf: maskCpf(response.cpf) })),
      tap((user) => this.loginService.storeUser(user)),
      map((user) => LoginActions.setUser({ user })),
    );
  });

  storeUserAfterEnrollment$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseEnrollmentActions.enrollSuccess),
        concatLatestFrom(() => this.store.select(loginFeature.selectCurrentUser)),
        map(([_, user]) => this.loginService.storeUser(user)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly loginService: LoginService,
    private readonly store: Store,
  ) {}
}
