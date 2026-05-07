import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { APPLICATION_TYPE, CAIXA_APPLICATION_TYPE, KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';
import { RegistrationNotFoundAction } from '../../models';
import { SUPPORT_WHATSAPP_URL } from '../../common';

@Component({
  selector: 'cx-registration-not-found-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    @if (isAgenciesApp) {
      <h1 mat-dialog-title class="text-xl">Falha no acesso</h1>
      <div mat-dialog-content class="text-sm flex flex-col gap-2">
        <p class="font-bold">Não foi possível concluir a sua solicitação.</p>
        <p>Por favor, entre em contato com nosso suporte.</p>
      </div>
    } @else {
      <h1 mat-dialog-title class="text-xl">Olá Rede Parceira! Sejam bem-vindos!</h1>
      <div mat-dialog-content class="text-sm flex flex-col gap-2">
        <p class="font-bold">
          Para iniciar sua jornada de aprendizagem, vamos realizar seu cadastro clicando no botão abaixo.
        </p>
        <p>
          Em caso de dúvida,
          <a class="color-primary underline cursor-pointer" (click)="onRedirectToSupport()">clique aqui</a> para entrar
          em contato com nosso suporte.
        </p>
      </div>
    }
    <div mat-dialog-actions class="p-6 pt-5 flex justify-end">
      <button mat-button mat-dialog-close class="color-primary">Cancelar</button>
      <button mat-flat-button color="primary" (click)="onConfirm()">
        {{ confirmButton }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationNotFoundDialogComponent {
  get confirmButton(): string {
    return this.isAgenciesApp ? 'Falar com o suporte' : 'Cadastrar';
  }

  protected readonly isAgenciesApp: boolean;

  constructor(
    @Inject(APPLICATION_TYPE) protected caixaAppType: CAIXA_APPLICATION_TYPE,
    private readonly dialogRef: MatDialogRef<RegistrationNotFoundDialogComponent>,
  ) {
    this.isAgenciesApp = caixaAppType === CAIXA_APPLICATION_TYPE.AGENCIES;
  }

  onConfirm() {
    const action: RegistrationNotFoundAction = this.isAgenciesApp ? 'contact-support' : 'create-account';
    this.dialogRef.close(action);
  }

  onRedirectToSupport() {
    KeepsUtils.openUrlInNewTab(SUPPORT_WHATSAPP_URL);
  }
}
