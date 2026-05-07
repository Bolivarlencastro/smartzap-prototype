import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  CaixaPartner,
  CaixaSmartZapUserSignUpDto,
  KeepsUtils,
  PartnerType,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { filter } from 'rxjs';
import { CnpjPipe } from '../../pipes/cnpj.pipe';
import { ZipCodePipe } from '../../pipes/zip-code.pipe';
import { UserRegistrationViewMode } from '../../models';
import { equalityValidator } from '../../common/helpers';
import { SUPPORT_WHATSAPP_URL } from '../../common';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'cx-user-registration-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioModule,
    NgxMaskDirective,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    CnpjPipe,
    ZipCodePipe,
    RouterLink,
    MatProgressSpinner,
  ],
  template: `
    <form class="flex flex-col gap-2 overflow-hidden pt-1" [formGroup]="form">
      @if (isSelectingPartnerType()) {
        <span class="text-sm">Você atua em uma:</span>
        <mat-radio-group formControlName="partner_type" color="primary">
          <mat-radio-button class="mr-2" [value]="partnerType.CORRESPONDENTE">CCA</mat-radio-button>
          <mat-radio-button [value]="partnerType.LOTERICO">Lotérica</mat-radio-button>
        </mat-radio-group>
      } @else {
        <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic" floatLabel="always">
          <mat-label>Nome, Endereço, CEP, CNPJ da sua CCA/Lotérica</mat-label>
          <input matInput formControlName="partner_convention_number" [matAutocomplete]="partnersAutocomplete" />
          <mat-icon matSuffix>search</mat-icon>
          <mat-autocomplete
            #partnersAutocomplete="matAutocomplete"
            [displayWith]="partnerDisplayWith"
            [hideSingleSelectionIndicator]="true"
          >
            @for (partner of partners(); track partner.convention_number) {
              <mat-option [value]="partner">
                <div class="flex flex-col">
                  <p>{{ partner.name }}</p>
                  <span class="text-secondary text-xs"
                    >{{ partner.city }} ({{ partner.state }}) - {{ partner.zip_code | zipCode }} |
                    {{ partner.cnpj | cnpj }}</span
                  >
                </div>
              </mat-option>
            }
          </mat-autocomplete>
          <mat-hint>
            Se não encontrou sua CCA/Lotérica, entre em
            <a class="color-primary underline cursor-pointer py-2 pr-2" (click)="onRedirectToSupport()"
              >contato conosco</a
            >
          </mat-hint>
        </mat-form-field>

        <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
          <mat-label>CPF</mat-label>
          <input matInput formControlName="cpf" mask="000.000.000-00" />
        </mat-form-field>

        <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="name" mask="F*" [patterns]="customPatterns" />
        </mat-form-field>

        <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>

        <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
          <mat-label>WhatsApp</mat-label>
          <input matInput formControlName="phone" mask="(00) 00000-0000" />
        </mat-form-field>

        <mat-form-field class="w-full" appearance="outline" subscriptSizing="dynamic">
          <mat-label>Confirme seu WhatsApp</mat-label>
          <input matInput formControlName="phoneConfirmation" mask="(00) 00000-0000" />
          @if (form.hasError('fieldsMismatch')) {
            <mat-error>Os números não são iguais. Tente novamente.</mat-error>
          }
        </mat-form-field>

        <mat-checkbox color="primary" class="mt-3" formControlName="terms_accept"
          ><span class="text-sm font-bold">
            Concordo com os
            <a class="color-primary underline" routerLink="/termos-de-uso" target="_blank">termos de uso</a></span
          ></mat-checkbox
        >
      }
    </form>
    <div class="flex justify-end gap-1 pt-5">
      <button mat-button mat-dialog-close class="color-primary">Cancelar</button>
      <button matButton="tonal" [disabled]="isFormInvalid" (click)="onSubmit()">
        @if (isSaving()) {
          <mat-progress-spinner diameter="25" mode="indeterminate"></mat-progress-spinner>
        } @else {
          {{ submitButtonLabel() }}
        }
      </button>
    </div>
  `,
  providers: [provideNgxMask()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegistrationFormComponent implements OnInit {
  viewMode = input<UserRegistrationViewMode>();
  isSaving = input<boolean>(false);
  partners = input<CaixaPartner[]>();
  isSelectingPartnerType = computed(() => this.viewMode() === 'select-partner-type');
  submitButtonLabel = computed(() => (this.viewMode() === 'select-partner-type' ? 'Avançar' : 'Cadastrar-me'));

  customPatterns = {
    F: { pattern: new RegExp('[a-zA-ZÀ-ÿ ]') },
  };

  userSignUp = output<CaixaSmartZapUserSignUpDto>();
  setPartnerType = output<PartnerType>();
  partnerSearchChange = output<string>();
  form: UntypedFormGroup;

  protected readonly partnerType: typeof PartnerType = PartnerType;
  private readonly destroyRef = inject(DestroyRef);

  get isFormInvalid() {
    return this.isSelectingPartnerType() ? this.form.get('partner_type').invalid : this.form.invalid;
  }

  constructor(private readonly fb: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
    this.registerAutocomplete();
  }

  onSubmit() {
    if (this.isSaving()) {
      return;
    }

    if (this.isSelectingPartnerType()) {
      this.onSetPartnerType();
      return;
    }
    this.signupUser();
  }

  partnerDisplayWith(partner: CaixaPartner) {
    return partner?.name || '';
  }

  onRedirectToSupport() {
    KeepsUtils.openUrlInNewTab(SUPPORT_WHATSAPP_URL);
  }

  private buildForm() {
    this.form = this.fb.group(
      {
        partner_type: [undefined, Validators.required],
        partner_convention_number: [null, KeepsUtils.objectKeyValidator<CaixaPartner>('convention_number', true)],
        cpf: [null, Validators.required],
        name: [null, Validators.required],
        email: [null, Validators.email],
        phone: [null, Validators.required],
        phoneConfirmation: [null, Validators.required],
        terms_accept: [false, Validators.requiredTrue],
      },
      { validators: equalityValidator('phone', 'phoneConfirmation') },
    );
  }

  private registerAutocomplete() {
    this.form
      .get('partner_convention_number')
      .valueChanges.pipe(
        debounceTime(250),
        distinctUntilChanged(),
        filter((value) => typeof value === 'string' && value.length > 1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => this.partnerSearchChange.emit(value));
  }

  private onSetPartnerType() {
    const partnerType = this.form.get('partner_type').value as PartnerType;
    this.setPartnerType.emit(partnerType);
  }

  private signupUser() {
    const formValue = this.form.value;
    const { email, cpf, name, phone, terms_accept, partner_type } = formValue;
    const partner: CaixaPartner = formValue.partner_convention_number;
    const partner_convention_number = partner?.convention_number || null;

    const userSignup: CaixaSmartZapUserSignUpDto = {
      email,
      cpf,
      name,
      phone,
      terms_accept,
      partner_type,
      partner_convention_number,
    };
    this.userSignUp.emit(userSignup);
  }
}
