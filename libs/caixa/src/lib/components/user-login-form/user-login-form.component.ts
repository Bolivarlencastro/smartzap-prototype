import { Component, computed, input, output } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CAIXA_APPLICATION_TYPE } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

const CPF_MASK_PATTERN = '000.000.000-00';
const EIN_MASK_PATTERN = '0*';

@Component({
  selector: 'cx-user-login-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    NgxMaskDirective,
    MatButton,
    MatDialogClose,
    MatProgressSpinner,
  ],
  template: `
    <form class="flex flex-col gap-2" [formGroup]="form" (ngSubmit)="onSubmit()" #formDirective="ngForm">
      <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
        <mat-label> {{ userCpfEinFieldLabel() }}</mat-label>
        <input
          matInput
          #searchInput
          inputmode="submit"
          formControlName="login"
          [mask]="getSerchInputMask(searchInput.value)"
        />
      </mat-form-field>

      <div class="flex justify-end gap-1">
        <button type="button" mat-button mat-dialog-close class="color-primary">Cancelar</button>
        <button matButton="tonal" [disabled]="form.invalid">
          @if (isInLoginProcess()) {
            <mat-progress-spinner diameter="25" mode="indeterminate"></mat-progress-spinner>
          } @else {
            Entrar
          }
        </button>
      </div>
    </form>
  `,
  providers: [provideNgxMask()],
})
export class UserLoginFormComponent {
  isInLoginProcess = input<boolean>(false);
  applicationType = input<CAIXA_APPLICATION_TYPE>();
  isAgencies = computed(() => this.applicationType() === CAIXA_APPLICATION_TYPE.AGENCIES);
  userCpfEinFieldLabel = computed(() => (this.isAgencies() ? 'Matrícula ou CPF' : 'CPF'));

  login = output<string>();
  form: FormGroup<{ login: FormControl<string> }> = new FormGroup({ login: new FormControl('', Validators.required) });

  onSubmit() {
    if (this.form.invalid || this.isInLoginProcess()) {
      return;
    }

    const login = this.form.get('login').value;
    this.login.emit(login);
  }

  getSerchInputMask(inputValue: string) {
    if (!this.isAgencies()) {
      return CPF_MASK_PATTERN;
    }

    return inputValue?.length > 7 ? CPF_MASK_PATTERN : EIN_MASK_PATTERN;
  }
}
