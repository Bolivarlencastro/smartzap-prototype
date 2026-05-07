import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginActions, loginFeature } from '../store';
import { CaixaSmartZapUser } from '@keeps-platform-frontend-workspace/kp-keeps';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserLoginFacade {
  readonly currentUser: Signal<CaixaSmartZapUser>;
  readonly isInLoginProcess: Signal<boolean>;

  constructor(private readonly store: Store) {
    this.currentUser = toSignal(this.store.select(loginFeature.selectCurrentUser));
    this.isInLoginProcess = toSignal(this.store.select(loginFeature.selectIsInLoginProcess));
  }

  checkUserLogin() {
    this.store.dispatch(LoginActions.checkUserLogin());
  }

  openLoginDialog() {
    this.store.dispatch(LoginActions.openDialog());
  }

  searchUser(search: string) {
    this.store.dispatch(LoginActions.searchUserForLogin({ search }));
  }

  reset() {
    this.store.dispatch(LoginActions.resetDialogState());
  }

  clearCurrentUser() {
    this.store.dispatch(LoginActions.clearCurrentUser());
  }
}
