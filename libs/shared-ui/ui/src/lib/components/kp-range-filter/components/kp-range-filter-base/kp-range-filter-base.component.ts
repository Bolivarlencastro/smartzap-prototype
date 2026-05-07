import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSelectChange } from '@angular/material/select';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { RangeFilterOptions, RangeFilterType } from '../../models';

@Component({
  template: '',
  standalone: true,
})
export class KpRangeFilterBaseComponent implements OnChanges {
  @Input() icon: string;
  @Input() label: string;
  @Input() parentFormGroup: FormGroup;
  @Input() lteFcName: string;
  @Input() gteFcName: string;

  @Output() setFilter = new EventEmitter<void>();

  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  selectedOption = signal(null);
  hasAppliedValue = signal(false);
  lteFC = new FormControl();
  gteFC = new FormControl();

  readonly rangeFilterType = RangeFilterType;
  readonly rangeFilterOptions: RangeFilterOptions[] = [
    {
      label: marker('UI.KP_FILTER.PLACEHOLDERS.RANGE_MORE'),
      value: RangeFilterType.GREATER_THAN,
    },
    {
      label: marker('UI.KP_FILTER.PLACEHOLDERS.RANGE_LESS'),
      value: RangeFilterType.LESS_THAN,
    },
    {
      label: marker('UI.KP_FILTER.PLACEHOLDERS.RANGE_BETWEEN'),
      value: RangeFilterType.BETWEEN,
    },
  ];

  get invalidForm(): boolean {
    return !(this.lteFC.valid && this.gteFC.valid);
  }

  get valuesNotChanged(): boolean {
    return (
      this.lteFC.value === this.parentFormGroup.get(this.lteFcName).value &&
      this.gteFC.value === this.parentFormGroup.get(this.gteFcName).value
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['label']) {
      this.initialize();
    }
  }

  initialize(): void {
    this.patchForm();
    this.buildButton();
  }

  menuOpened(): void {
    this.patchForm();
    this.initializeOptionSelect();
    this.configureValidators();
  }

  selectionChanged(event: MatSelectChange): void {
    this.selectedOption.set(event.value);
    this.resetForm();
    this.configureValidators();
  }

  apply(): void {
    this.menuTrigger?.closeMenu();

    if (this.valuesNotChanged) {
      return;
    }

    this.submitFilter();
    this.buildButton();
    this.setFilter.emit();
  }

  reset(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.cleanFilter();
    this.setFilter.emit();
  }

  clean(): void {
    this.menuTrigger.closeMenu();
    this.reset();
  }

  configureValidators(): void {
    const option = this.selectedOption();
    const validatorMap = new Map<RangeFilterType, () => void>([
      [
        RangeFilterType.BETWEEN,
        () => {
          this.setValidators(this.lteFC, true);
          this.setValidators(this.gteFC, true);
        },
      ],
      [
        RangeFilterType.LESS_THAN,
        () => {
          this.setValidators(this.lteFC, true);
          this.setValidators(this.gteFC, false);
        },
      ],
      [
        RangeFilterType.GREATER_THAN,
        () => {
          this.setValidators(this.lteFC, false);
          this.setValidators(this.gteFC, true);
        },
      ],
    ]);

    const configure = validatorMap.get(option);
    if (configure) {
      configure();
    }
  }

  cleanFilter(): void {
    this.resetForm();
    this.buildButton();
    this.submitFilter();
  }

  protected patchForm(): void {
    const parentFormValues = {
      lteValue: this.parentFormGroup.get(this.lteFcName).value,
      gteValue: this.parentFormGroup.get(this.gteFcName).value,
    };

    this.lteFC.setValue(parentFormValues.lteValue);
    this.gteFC.setValue(parentFormValues.gteValue);
  }

  protected buildButton(): void {
    this.hasAppliedValue.set(this.lteFC.value || this.gteFC.value);
  }

  protected initializeOptionSelect(): void {
    if (this.lteFC.value && this.gteFC.value) {
      this.selectedOption.set(RangeFilterType.BETWEEN);
      return;
    }

    if (this.lteFC.value) {
      this.selectedOption.set(RangeFilterType.LESS_THAN);
      return;
    }

    this.selectedOption.set(RangeFilterType.GREATER_THAN);
  }

  protected setValidators(formControl: FormControl, set: boolean) {
    if (set) {
      formControl.setValidators([Validators.required]);
    } else {
      formControl.clearValidators();
    }

    formControl.updateValueAndValidity();
  }

  protected submitFilter(): void {
    const partialValue = {
      [this.lteFcName]: this.lteFC.value,
      [this.gteFcName]: this.gteFC.value,
    };

    this.parentFormGroup.patchValue(partialValue);
  }

  protected resetForm(): void {
    this.lteFC.reset();
    this.gteFC.reset();
  }
}
