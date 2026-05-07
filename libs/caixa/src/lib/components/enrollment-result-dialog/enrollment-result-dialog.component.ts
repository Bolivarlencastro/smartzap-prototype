import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EnrollmentResult } from '../../models';
import { SUPPORT_WHATSAPP_URL } from '../../common';
import { KeepsUtils } from '@keeps-platform-frontend-workspace/kp-keeps';

export type EnrollmentResultDialogAction = 'go-to-whatsapp' | 'cancel-enrollment';

@Component({
  selector: 'cx-enrollment-result-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div mat-dialog-title class="text-xl">{{ title }}</div>

    <div mat-dialog-content class="text-sm">
      @switch (result) {
        @case ('already-enrolled') {
          <p class="mb-2 font-bold">Você já possui uma matrícula em andamento na nossa Escola de Negócios.</p>
          <p class="mb-2">Deseja cancelar e realizar uma nova matrícula ou continuar o curso atual?</p>
          <p>
            Em caso de dúvida,
            <a class="color-primary underline cursor-pointer" (click)="onRedirectToSupport()">clique aqui</a> para
            entrar em contato com nosso suporte.
          </p>
        }
        @case ('enrolled') {
          <p class="mb-2 font-bold">Em breve você receberá o conteúdo do curso via WhatsApp.</p>
          <p>
            Enquanto espera, por favor, <span class="font-bold">salve nosso número em seus contatos</span> para garantir
            o recebimento das nossas mensagens.
          </p>
        }
        @case ('registered') {
          <p class="mb-2 font-bold">Seu cadastro na escola de negócios foi realizado com sucesso!</p>
          <p>Comece seu primeiro curso agora mesmo!</p>
        }
      }
    </div>

    <div mat-dialog-actions class="p-4 pt-5 flex flex-row justify-end">
      @if (isAlreadyEnrolled) {
        <button mat-button class="color-primary" (click)="cancelCurrentEnrollment()">Cancelar matrícula</button>
      } @else {
        <button mat-button class="color-primary" (click)="onCancel()">Cancelar</button>
      }
      <button mat-flat-button color="primary" (click)="goToWhatsApp()">Ir para o WhatsApp</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentResultDialogComponent {
  get isAlreadyEnrolled(): boolean {
    return this.result === 'already-enrolled';
  }

  get title(): string {
    return this.isAlreadyEnrolled ? 'Você já está matriculado!' : 'Inscrição realizada com sucesso!';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) protected result: EnrollmentResult,
    private readonly dialogRef: MatDialogRef<EnrollmentResultDialogComponent, EnrollmentResultDialogAction>,
  ) {}

  goToWhatsApp() {
    this.dialogRef.close('go-to-whatsapp');
  }

  onCancel() {
    this.dialogRef.close();
  }

  cancelCurrentEnrollment() {
    this.dialogRef.close('cancel-enrollment');
  }

  onRedirectToSupport() {
    KeepsUtils.openUrlInNewTab(SUPPORT_WHATSAPP_URL);
  }
}
