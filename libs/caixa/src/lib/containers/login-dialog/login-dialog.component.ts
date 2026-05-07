import { Component, Inject, OnDestroy, Signal } from '@angular/core';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { UserLoginFormComponent } from '../../components/user-login-form/user-login-form.component';
import { APPLICATION_TYPE, CAIXA_APPLICATION_TYPE } from '@keeps-platform-frontend-workspace/kp-keeps';
import { UserLoginFacade } from '../../facades/user-login.facade';

@Component({
  selector: 'cx-login-dialog',
  imports: [MatDialogContent, UserLoginFormComponent, MatDialogTitle],
  template: ` <h1 mat-dialog-title class="text-xl">Acessar</h1>
    <div mat-dialog-content class="text-sm flex flex-col gap-5">
      <p>Acesse sua conta para acompanhar suas matrículas em progresso.</p>
      <cx-user-login-form
        [applicationType]="caixaAppType"
        [isInLoginProcess]="isInLoginProcess()"
        (login)="onLogin($event)"
      ></cx-user-login-form>
    </div>`,
})
export class LoginDialogComponent implements OnDestroy {
  protected readonly isInLoginProcess: Signal<boolean>;

  constructor(
    @Inject(APPLICATION_TYPE) protected caixaAppType: CAIXA_APPLICATION_TYPE,
    private loginFacade: UserLoginFacade,
  ) {
    this.isInLoginProcess = this.loginFacade.isInLoginProcess;
  }

  onLogin(search: string) {
    this.loginFacade.searchUser(search);
  }

  ngOnDestroy() {
    this.loginFacade.reset();
  }
}
