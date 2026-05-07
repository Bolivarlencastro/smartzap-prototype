import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnChanges,
  output,
  SimpleChanges,
  viewChild,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CAIXA_APPLICATION_TYPE, CaixaSmartZapUser } from '@keeps-platform-frontend-workspace/kp-keeps';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CourseEnrollmentData } from '../../models';
import { equalityValidator } from '../../common/helpers';
import { RouterLink } from '@angular/router';
import { KpBlockCopyPasteDirective } from '@keeps-platform-frontend-workspace/ui/kp-block-copy-paste';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';

const CPF_MASK_PATTERN = '000.000.000-00';
const EIN_MASK_PATTERN = '0*';

@Component({
  selector: 'cx-course-enrollment-form',
  imports: [
    MatIcon,
    MatDialogModule,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    MatFormFieldModule,
    MatSuffix,
    MatCheckbox,
    MatButtonModule,
    FormsModule,
    NgxMaskDirective,
    RouterLink,
    KpBlockCopyPasteDirective,
    MatProgressSpinner,
    MatTooltip,
  ],
  template: `
    <form class="flex flex-col gap-2" [formGroup]="form" (ngSubmit)="formSubmit()" #formDirective="ngForm">
      <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
        <mat-label> {{ userCpfEinFieldLabel() }}</mat-label>
        <input
          matInput
          #searchInput
          inputmode="search"
          formControlName="cpf"
          [specialCharacters]="['*', '.', '-']"
          [mask]="getSearchInputMask(searchInput.value, searchInput.disabled)"
        />

        @if (hasUser()) {
          <button matSuffix mat-icon-button class="mr-1" type="button" (click)="resetForm()">
            <mat-icon>delete</mat-icon>
          </button>
        } @else {
          <button matSuffix mat-icon-button class="mr-1" [disabled]="disabledSuffixButton">
            <mat-icon>search</mat-icon>
          </button>
        }
      </mat-form-field>

      <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
        <mat-label> Nome</mat-label>
        <input matInput formControlName="name" readonly />
      </mat-form-field>

      @if (!isAgencies()) {
        <mat-form-field
          class="w-full"
          appearance="outline"
          subscriptSizing="dynamic"
          (click)="partnerInputClick($event)"
        >
          <mat-label> {{ partnerFieldLabel() }}</mat-label>
          <input matInput #partnerInput formControlName="partner" readonly />
          @if (showPartnerSelectionButton()) {
            <button matSuffix matIconButton class="mr-1" [matTooltip]="'Editar CCA/Lotérica'">
              <mat-icon>edit</mat-icon>
            </button>
          }
          @if (form.hasError('required', 'partner')) {
            <mat-error>Selecione uma Lotérica/CCA</mat-error>
          }
        </mat-form-field>
      }

      <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
        <mat-label> WhatsApp</mat-label>
        <input matInput type="tel" #phoneInput formControlName="phone" mask="(00) 00000-0000" kpBlockCopyPaste />
      </mat-form-field>

      <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
        <mat-label> Confirme seu WhatsApp</mat-label>
        <input matInput type="tel" formControlName="phoneConfirmation" mask="(00) 00000-0000" kpBlockCopyPaste />
        @if (form.hasError('fieldsMismatch')) {
          <mat-error>Os números não são iguais. Tente novamente.</mat-error>
        }
      </mat-form-field>

      <mat-checkbox color="primary" class="mt-3" formControlName="termsAgreement" required
        ><span class="text-sm font-bold"
          >Concordo com os
          <a class="color-primary underline" routerLink="/termos-de-uso" target="_blank">termos de uso</a></span
        ></mat-checkbox
      >
      <div class="flex justify-end gap-1">
        <button type="button" mat-button mat-dialog-close class="color-primary">Cancelar</button>
        <button matButton="tonal" [disabled]="invalidForm">
          @if (isSaving()) {
            <mat-progress-spinner diameter="25" mode="indeterminate"></mat-progress-spinner>
          } @else {
            Inscrever-me
          }
        </button>
      </div>
    </form>
  `,
  providers: [provideNgxMask()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseEnrollmentFormComponent implements OnChanges, AfterViewInit {
  user = input<CaixaSmartZapUser>();
  applicationType = input<CAIXA_APPLICATION_TYPE>();
  isAgencies = computed(() => this.applicationType() === CAIXA_APPLICATION_TYPE.AGENCIES);
  userCpfEinFieldLabel = computed(() => (this.isAgencies() ? 'Matrícula ou CPF' : 'CPF'));
  partnerFieldLabel = computed(() => (this.isAgencies() ? 'Agência' : 'Lotérica/CCA'));
  hasUser = computed(() => !!this.user()?.id);
  isSaving = input<boolean>(false);
  showPartnerSelectionButton = computed(() => {
    const isAgencies = this.isAgencies();
    const user = this.user();

    if (isAgencies) {
      return false;
    }

    return !!user;
  });

  enrollChange = output<CourseEnrollmentData>();
  searchUser = output<string>();
  clearUser = output<void>();
  openPartnerSelection = output<void>();

  @ViewChild('phoneInput') phoneInput: ElementRef<HTMLInputElement>;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  partnerInput = viewChild<ElementRef<HTMLInputElement>>('partnerInput');

  form: UntypedFormGroup;

  get invalidForm(): boolean {
    return !this.hasUser() || this.form.invalid;
  }

  get disabledSuffixButton(): boolean {
    return !this.form.get('cpf').value;
  }

  constructor(private readonly fb: FormBuilder) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && !changes['user'].isFirstChange()) {
      this.patchAndEnableForm(this.user());
    }
  }

  ngAfterViewInit() {
    if (this.user()) {
      this.patchAndEnableForm(this.user());
    }
  }

  getSearchInputMask(inputValue: string, disabled: boolean) {
    if (disabled) {
      return '***.***.***-00';
    }

    if (this.isAgencies()) {
      return inputValue?.length > 7 ? CPF_MASK_PATTERN : EIN_MASK_PATTERN;
    }

    return CPF_MASK_PATTERN;
  }

  resetForm() {
    this.form.reset();
    this.clearUser.emit();
  }

  formSubmit() {
    if (!this.hasUser()) {
      this.onSearchUser();
      return;
    }

    if (this.form.invalid) {
      return;
    }

    this.enrollToCourse();
  }

  editPartner() {
    this.openPartnerSelection.emit();
  }

  private buildForm() {
    this.form = this.fb.group(
      {
        cpf: ['', Validators.required],
        name: [{ value: '', disabled: true }],
        partner: [{ value: '', disabled: true }],
        phone: [{ value: '', disabled: true }, Validators.required],
        phoneConfirmation: [{ value: '', disabled: true }, Validators.required],
        termsAgreement: [false],
      },
      { validators: equalityValidator('phone', 'phoneConfirmation') },
    );
  }

  private patchAndEnableForm(user: CaixaSmartZapUser) {
    this.formDirective.resetForm();
    this.form.patchValue({ ...user, partner: user?.related_partner?.name });

    const isPartnerRequired = !this.isAgencies();
    if (isPartnerRequired) {
      this.form.get('partner').setValidators([Validators.required]);
      this.form.updateValueAndValidity();
    }

    setTimeout(() => this.toggleFormEnabledState(!!user), 1);
  }

  private toggleFormEnabledState(enabled: boolean) {
    const cpfControl = this.form.get('cpf');
    const phone = this.form.get('phone');
    const phoneConfirmation = this.form.get('phoneConfirmation');
    const partner = this.form.get('partner');
    const enablePartnerInput = !this.isAgencies();

    if (enabled) {
      cpfControl.disable();
      phoneConfirmation.enable();
      phone.enable();

      if (enablePartnerInput) {
        partner.enable();
      }

      setTimeout(() => {
        this.focusFieldAfterEnablingForm();
      }, 25);
    } else {
      cpfControl.enable();
      phone.disable();
      phoneConfirmation.disable();
      partner.disable();
    }
  }

  private focusFieldAfterEnablingForm() {
    const canEditPartner = !this.isAgencies();
    const hasPartner = !!this.user()?.related_partner;
    const shouldFocusPartner = canEditPartner && !hasPartner;

    if (shouldFocusPartner) {
      this.partnerInput().nativeElement.focus();
      this.editPartner();
      return;
    }

    this.phoneInput.nativeElement.focus();
  }

  private enrollToCourse() {
    if (this.isSaving()) {
      return;
    }

    const terms_accept = this.form.get('termsAgreement').value;
    const phone = this.form.get('phone').value;
    const enrollmentData: CourseEnrollmentData = {
      user_id: this.user().id,
      phone,
      terms_accept,
    };
    this.enrollChange.emit(enrollmentData);
  }

  private onSearchUser() {
    const cpf = this.form.get('cpf').value;
    this.searchUser.emit(cpf);
  }

  protected partnerInputClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    const isPartnerRequired = !this.isAgencies();
    if (!isPartnerRequired) {
      return;
    }

    this.editPartner();
  }
}
