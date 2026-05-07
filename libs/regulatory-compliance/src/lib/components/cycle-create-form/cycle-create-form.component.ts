import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CycleCreateFilter, CycleCreateFilterType, CycleCreateForm, CycleCreateFormGroup } from '../../models';
import { KpAutocompleteComponent, KpAutocompleteOption } from '@keeps-platform-frontend-workspace/ui/kp-autocomplete';
import { debounceTime, filter, Subject, Subscription, takeUntil } from 'rxjs';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { CycleCreateDto, CycleDto, CyclePeriodType } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CycleCreateFormHelper } from './cycle-create-form-helper';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { CycleIconPipe } from '../../pipes/cycle-icon.pipe';

const PERIOD_TYPE_OPTIONS: { label: string; value: CyclePeriodType }[] = [
  {
    label: marker('REGULATORY_COMPLIANCE.DURATION.DAYS.NEUTRAL'),
    value: 'DAY',
  },
  {
    label: marker('REGULATORY_COMPLIANCE.DURATION.MONTHS.NEUTRAL'),
    value: 'MONTH',
  },
  {
    label: marker('REGULATORY_COMPLIANCE.DURATION.YEARS.NEUTRAL'),
    value: 'YEAR',
  },
];

@Component({
  selector: 'kp-cycle-create-form',
  templateUrl: './cycle-create-form.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatAutocompleteTrigger,
    MatIcon,
    MatSuffix,
    MatAutocomplete,
    MatOption,
    KpAutocompleteComponent,
    MatSelect,
    MatHint,
    MatIconButton,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
    CycleIconPipe,
  ],
})
export class CycleCreateFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input() cycle: CycleDto;
  @Input() editingCycle: boolean;
  @Input() compliances: KpAutocompleteOption[] = [];
  @Input() learningObjects: KpAutocompleteOption[] = [];
  @Input() jobs: KpAutocompleteOption[] = [];
  @Input() functions: KpAutocompleteOption[] = [];
  @Output() formSubmit = new EventEmitter<CycleCreateDto>();
  @Output() deleteCycle = new EventEmitter<string>();
  @Output() filterItem = new EventEmitter<CycleCreateFilter>();

  readonly form: FormGroup<CycleCreateFormGroup>;
  protected readonly dateOptions = PERIOD_TYPE_OPTIONS;
  protected readonly maxCharactersHint = `Max 250 `;
  protected readonly unsub = new Subject<void>();

  private descriptionSub: Subscription;

  constructor(
    formBuilder: FormBuilder,
    private translateService: TranslocoService,
  ) {
    this.form = CycleCreateFormHelper.buildForm(formBuilder);
    this.registerAutocompletes();
  }

  get disabledSubmitButton(): boolean {
    return this.form.pristine || this.form.invalid;
  }

  ngOnInit() {
    if (!this.editingCycle) {
      this.registerDescriptionBuilder();
      this.disableDescription();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['cycle']) {
      CycleCreateFormHelper.patchForm(this.cycle, this.form);
    }
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
    this.descriptionSub?.unsubscribe();
  }

  onSubmit(): void {
    const result = CycleCreateFormHelper.parseFormToCreateDTO(this.form.getRawValue());
    this.formSubmit.emit(result);
  }

  onDelete(): void {
    this.deleteCycle.emit(this.cycle?.id);
  }

  displayWithFn(option: KpAutocompleteOption) {
    return option?.label;
  }

  private registerAutocompletes() {
    this.registerAc('compliance', 'compliances');
    this.registerAc('learningObject', 'learningObjects');
  }

  private registerAc(
    formFieldName: Extract<keyof CycleCreateForm, 'compliance' | 'learningObject'>,
    type: CycleCreateFilterType,
  ) {
    this.form
      .get(formFieldName)
      .valueChanges.pipe(
        debounceTime(200),
        filter((value: any): value is string => typeof value === 'string'),
        takeUntil(this.unsub),
      )
      .subscribe((value) => this.onFilter(value, type));
  }

  private onFilter = (search: string, type: CycleCreateFilterType) => {
    this.filterItem.emit({ search, type });
  };

  private registerDescriptionBuilder() {
    this.descriptionSub = this.form.valueChanges.pipe(debounceTime(200), takeUntil(this.unsub)).subscribe(() => {
      const description = CycleCreateFormHelper.createDescription(this.form.getRawValue(), this.translateService);

      if (description) {
        this.updateDescription(description);
      }
    });
  }

  private updateDescription(description: string) {
    const descriptionControl = this.form.get('description');

    descriptionControl.enable({ emitEvent: false });
    descriptionControl.setValue(description, { emitEvent: false });

    this.descriptionSub?.unsubscribe();
  }

  private disableDescription() {
    this.form.get('description').disable({ emitEvent: false });
  }
}
