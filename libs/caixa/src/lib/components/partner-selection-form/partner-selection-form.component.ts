import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { PartnerSelectionViewMode } from '../../models';
import { CaixaPartner, KeepsUtils, PartnerType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { CnpjPipe } from '../../pipes/cnpj.pipe';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatFormField, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { ZipCodePipe } from '../../pipes/zip-code.pipe';
import { SUPPORT_WHATSAPP_URL } from '../../common';

@Component({
  selector: 'cx-partner-selection-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatRadioButton,
    MatRadioGroup,
    MatButton,
    MatDialogClose,
    CnpjPipe,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatHint,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSuffix,
    ZipCodePipe,
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
          <input matInput formControlName="selectedPartner" [matAutocomplete]="partnersAutocomplete" />
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
      }
    </form>
    <div class="flex justify-end gap-1 pt-5">
      <button mat-button mat-dialog-close class="color-primary">Cancelar</button>
      <button matButton="tonal" [disabled]="isFormInvalid" (click)="onSubmit()">
        {{ submitButtonLabel() }}
      </button>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerSelectionFormComponent implements OnInit {
  viewMode = input<PartnerSelectionViewMode>();
  partners = input<CaixaPartner[]>();
  isSelectingPartnerType = computed(() => this.viewMode() === 'select-partner-type');
  submitButtonLabel = computed(() => (this.viewMode() === 'select-partner-type' ? 'Avançar' : 'Selecionar'));
  setPartnerType = output<PartnerType>();
  partnerSearchChange = output<string>();
  partnerSelected = output<CaixaPartner>();
  form: UntypedFormGroup;

  protected readonly partnerType: typeof PartnerType = PartnerType;
  private readonly destroyRef = inject(DestroyRef);

  get isFormInvalid() {
    return this.isSelectingPartnerType() ? this.form.get('partner_type').invalid : this.form.invalid;
  }

  constructor(private readonly fb: FormBuilder) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      partner_type: [undefined, Validators.required],
      selectedPartner: [null, KeepsUtils.objectKeyValidator<CaixaPartner>('convention_number', true)],
    });
  }

  ngOnInit() {
    this.registerAutocomplete();
  }

  partnerDisplayWith(partner: CaixaPartner) {
    return partner?.name || '';
  }

  onSubmit() {
    if (this.isSelectingPartnerType()) {
      this.onSetPartnerType();
      return;
    }

    const partner = this.form.get('selectedPartner').value;
    if (!partner) {
      return;
    }

    this.partnerSelected.emit(partner);
  }

  onRedirectToSupport() {
    KeepsUtils.openUrlInNewTab(SUPPORT_WHATSAPP_URL);
  }

  private onSetPartnerType() {
    const partnerType = this.form.get('partner_type').value as PartnerType;
    this.setPartnerType.emit(partnerType);
  }

  private registerAutocomplete() {
    this.form
      .get('selectedPartner')
      .valueChanges.pipe(
        debounceTime(250),
        distinctUntilChanged(),
        filter((value) => typeof value === 'string' && value.length > 1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => this.partnerSearchChange.emit(value));
  }
}
