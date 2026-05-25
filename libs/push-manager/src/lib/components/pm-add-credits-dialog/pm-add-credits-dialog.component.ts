import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PushManagerApi } from '@keeps-platform-frontend-workspace/kp-keeps';

export interface AddCreditsDialogData {
  currentBalance: string;
}

@Component({
  selector: 'pm-add-credits-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Adicionar créditos</h2>

    <mat-dialog-content class="flex flex-col gap-4 pt-2">
      <div
        class="flex items-center justify-between px-4 py-3 rounded-lg"
        style="background: var(--mat-sys-surface-variant)"
      >
        <span class="text-sm" style="color: var(--mat-sys-on-surface-variant)">Saldo atual</span>
        <span class="text-base font-bold" style="color: var(--mat-sys-primary)">R$ {{ data.currentBalance }}</span>
      </div>

      <mat-form-field appearance="outline" floatLabel="always" class="w-full">
        <mat-label>Valor do crédito</mat-label>
        <span matTextPrefix>R$&nbsp;</span>
        <input matInput type="number" min="0.01" step="0.01" placeholder="0,00" [formControl]="amountControl" />
        <mat-hint>Informe o valor que será adicionado ao saldo desta workspace.</mat-hint>
        @if (amountControl.touched && amountControl.hasError('required')) {
          <mat-error>Informe um valor de crédito.</mat-error>
        }
        @if (amountControl.touched && amountControl.hasError('min')) {
          <mat-error>O valor deve ser maior que zero.</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Observação interna (opcional)</mat-label>
        <textarea
          matInput
          rows="3"
          placeholder="Ex: Ajuste manual para campanha X"
          [formControl]="noteControl"
        ></textarea>
        <mat-hint>Texto de contexto exibido no extrato financeiro.</mat-hint>
      </mat-form-field>

      @if (error()) {
        <div
          class="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
          style="background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container)"
        >
          <mat-icon class="text-sm">error_outline</mat-icon>
          Não foi possível adicionar créditos agora. Tente novamente ou contate o suporte.
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button [disabled]="loading()" (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="loading()" (click)="submit()">
        {{ loading() ? 'Adicionando créditos…' : 'Confirmar recarga' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content {
      min-width: 420px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmAddCreditsDialogComponent {
  protected readonly data = inject<AddCreditsDialogData>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<PmAddCreditsDialogComponent>);
  private readonly api = inject(PushManagerApi);

  protected readonly loading = signal(false);
  protected readonly error = signal(false);

  protected readonly amountControl = new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]);

  protected readonly noteControl = new FormControl<string>('');

  protected submit() {
    if (this.amountControl.invalid) {
      this.amountControl.markAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    this.api.addCredits(this.amountControl.value!, this.noteControl.value ?? undefined).subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }
}
