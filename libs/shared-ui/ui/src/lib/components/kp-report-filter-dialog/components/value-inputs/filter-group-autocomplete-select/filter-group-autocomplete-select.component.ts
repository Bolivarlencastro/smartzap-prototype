import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { FilterGroupConfig } from '../../../model/filter-group-config';
import { FilterGroupSelectOption } from '../../../model/filter-group-select-option';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatFormField } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'kp-filter-group-autocomplete-select',
  templateUrl: './filter-group-autocomplete-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [
    MatFormField,
    MatSelect,
    FormsModule,
    ReactiveFormsModule,
    MatSelectTrigger,
    MatOption,
    NgxMatSelectSearchModule,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class FilterGroupAutoCompleteSelectComponent implements OnInit, OnDestroy {
  @Input() currentSelector: FilterGroupConfig;
  @Input() placeholder: string;
  @Input() currentValue: FilterGroupSelectOption[] | FilterGroupSelectOption | undefined;
  inputFc = new FormControl<string>('');

  filteredOptions = new BehaviorSubject([]);
  isLoading$ = new BehaviorSubject(false);
  private readonly _unsub = new Subject<void>();

  get triggerValue(): string {
    if (!this.currentValue) {
      return '';
    }
    if (Array.isArray(this.currentValue)) {
      return this.currentValue.map((value) => value.label).join('; ');
    } else {
      return this.currentValue.label;
    }
  }

  ngOnInit() {
    this.inputFc.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((value) => typeof value === 'string'),
        takeUntil(this._unsub),
      )
      .subscribe((value: string) => {
        if (this.currentSelector.autocompleteCallback) {
          this.filterWithCallBack(value);
        }
      });
    if (this.currentValue) {
      if (Array.isArray(this.currentValue)) {
        this.filteredOptions.next(this.currentValue);
      }
      this.filteredOptions.next([this.currentValue]);
    }
    this.filterWithCallBack('');
  }

  ngOnDestroy() {
    this._unsub.next();
    this._unsub.complete();
  }

  setValues(values: FilterGroupSelectOption[]): void {
    this.isLoading$.next(false);

    const noCurrentValue = (Array.isArray(this.currentValue) && !this.currentValue.length) || !this.currentValue;

    if (this.inputFc.value.length || noCurrentValue) {
      this.filteredOptions.next(values);
      return;
    }

    if (Array.isArray(this.currentValue)) {
      this.filteredOptions.next(this.filterSelecteResults(this.currentValue, values));
    } else {
      this.filteredOptions.next(this.filterSelecteResults([this.currentValue], values));
    }
  }

  comparisionFn(option1: FilterGroupSelectOption, option2: FilterGroupSelectOption): boolean {
    return option1?.value === option2?.value;
  }

  private filterSelecteResults(
    currentSelection: FilterGroupSelectOption[],
    filteredOptions: FilterGroupSelectOption[],
  ): FilterGroupSelectOption[] {
    const selectedOptions = new Set(currentSelection.map((item) => item.value));
    const filteredArray = filteredOptions.filter((item) => !selectedOptions.has(item.value));
    return [...currentSelection, ...filteredArray];
  }

  private filterWithCallBack(value: string): void {
    this.currentSelector?.autocompleteCallback(value, this);
    this.isLoading$.next(true);
  }
}
