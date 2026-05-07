import { Injectable, signal } from '@angular/core';
import { CaixaApi, CaixaSmartZapUser } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginDialogComponent } from '../containers/login-dialog/login-dialog.component';
import { filter, tap } from 'rxjs';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { RegistrationNotFoundDialogComponent } from '../components/registration-not-found-dialog/registration-not-found-dialog.component';
import { maskCpf } from '../common/helpers';

const USER_STORAGE_KEY = 'logged-user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  readonly currentUser = signal<CaixaSmartZapUser | null>(null);
  private dialogRef: MatDialogRef<LoginDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private http: CaixaApi,
    private messageService: KpMessageService,
  ) {
    this.currentUser.set(this.loadUser());
  }

  storeUser(user: CaixaSmartZapUser) {
    if (!user) {
      return;
    }

    const userToStore = { ...user, cpf: maskCpf(user.cpf) };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToStore));
    this.currentUser.set(userToStore);
  }

  openLoginDialog() {
    this.dialogRef = this.dialog.open(LoginDialogComponent, {
      autoFocus: 'first-tabbable',
      panelClass: 'enroll-dialog-container',
      backdropClass: 'cx-dialog-overlay',
    });
  }

  openRegistrationNotFoundDialog() {
    return this.dialog
      .open(RegistrationNotFoundDialogComponent, {
        autoFocus: 'dialog',
        panelClass: 'enroll-dialog-container',
        backdropClass: 'cx-dialog-overlay',
        disableClose: true,
      })
      .afterClosed()
      .pipe(filter((action) => !!action));
  }

  clearUser() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.currentUser.set(null);
  }

  closeDialog() {
    this.dialogRef?.close();
  }

  searchUserForLogin(search: string) {
    return this.http.searchUser(search).pipe(
      tap({
        next: (user) => {
          this.storeUser(user);
          this.messageService.success('Bem vindo(a), ' + user.name + '!');
        },
      }),
    );
  }

  private loadUser() {
    try {
      const storedUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

      if (this.isValidUser(storedUser)) {
        return storedUser;
      }
    } catch (_error) {
      return null;
    }

    return null;
  }

  private isValidUser(user: any): user is CaixaSmartZapUser {
    return typeof user === 'object' && user !== null && 'id' in user && 'name' in user;
  }
}
