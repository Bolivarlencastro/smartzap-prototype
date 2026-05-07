import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterGroupConfig } from '../model/filter-group-config';
import { FilterGroupConnector } from '../model/filter-group-connector';
import { FilterGroupDefaultOperators, FilterGroupOperator } from '../model/filter-group-operator';
import { FilterGroupType } from '../model/filter-group-type';
import { DialogForm, FilterFormGroup, FilterGroupValue, FilterValue } from '../model/forms-models';

@Injectable()
export class ReportFilterDialogService {
  private readonly _filterForm: BehaviorSubject<FormGroup<DialogForm>>;
  private readonly _selectorsMap: Map<string, { selector: FilterGroupConfig; index: number }> = new Map();
  private readonly _selectors: BehaviorSubject<FilterGroupConfig[]> = new BehaviorSubject<FilterGroupConfig[]>([]);

  constructor(private _fb: FormBuilder) {
    this._filterForm = new BehaviorSubject(this.getInitialFilter());
  }

  get filterForm$() {
    return this._filterForm.asObservable();
  }

  get selectors$() {
    return this._selectors.asObservable().pipe(map((selectors) => selectors.filter((selector) => !selector.inUse)));
  }

  get canAddFilter$(): Observable<boolean> {
    return this.selectors$.pipe(map((selectors) => selectors.some((selector) => !selector.inUse)));
  }

  setOptions(options: FilterGroupConfig[]): void {
    this.createSelectOptionsMap(options);
  }

  addFilterGroup(): void {
    const currentFilter = this._filterForm.getValue();
    const currentFilterGroups = currentFilter.get('filters') as FormArray;
    currentFilterGroups.push(this.createNewFilterGroup());
    this._filterForm.next(currentFilter);
  }

  /**
   * Removes a filter group from the form
   * @param index The filterGroup index, the same as the one in the formArray
   * @param currentSelectorValue The selector in use by the filterGroup, if provided, will update it's inUse property to false
   * allowing it to be selected again.
   */
  removeFilterGroup(index: number, currentSelectorValue?: string): void {
    const currentFilter = this._filterForm.getValue();
    const currentFilterGroups = currentFilter.get('filters') as FormArray;
    currentFilterGroups.removeAt(index);
    this._filterForm.next(currentFilter);
    this.updateSelectorInUse(currentSelectorValue, false);
  }

  getFilterValue(): FilterValue | undefined | null {
    const filter = this._filterForm.getValue();

    if (filter.invalid) {
      return null;
    }

    return filter.getRawValue().filters;
  }

  clearFilters() {
    const originalSelectors = Array.from(this._selectorsMap.values()).map((mapSelector) => {
      return { ...mapSelector.selector, inUse: false };
    });
    this._selectors.next(originalSelectors);
    this._filterForm.next(this.getInitialFilter());
  }

  /**
   * Set's the initial value for the filter group operator, updates the value formControl if needed, set the selectors in use
   * and returns the FilterGroupConfig based on its selector value.
   * @param groupIndex
   * @param newSelectorValue
   * @param previousSelector
   */
  groupSelectorChanged(
    groupIndex: number,
    newSelectorValue: string,
    previousSelector: FilterGroupConfig | null,
  ): FilterGroupConfig {
    const { index: nextSelectorIndex, selector: nextSelector } = this._selectorsMap.get(newSelectorValue);
    const previousSelectorIndex: number = this._selectorsMap.get(previousSelector?.value)?.index ?? -1;

    const currentFilter = this._filterForm.getValue();
    const currentFilterGroups = currentFilter.get('filters') as FormArray<FormGroup<FilterFormGroup>>;
    const groupForm = currentFilterGroups.controls[groupIndex];

    groupForm
      .get('operator')
      .setValue(nextSelector.operators ? nextSelector.operators[0] : FilterGroupDefaultOperators[0]);

    this.setValueFormControl(groupForm, previousSelector?.type, nextSelector.type);

    currentFilterGroups.setControl(groupIndex, groupForm);
    this._filterForm.next(currentFilter);

    this.updateSelectorsUse(previousSelectorIndex, nextSelectorIndex);

    return nextSelector;
  }

  getSelectorByValue(selectorValue: string): FilterGroupConfig {
    const selector = this._selectorsMap.get(selectorValue).selector;
    this.updateSelectorInUse(selector.value, true);
    return selector;
  }

  private updateSelectorsUse(previousSelectorIndex: number, nextSelectorIndex: number): void {
    const currentSelectors = this._selectors.getValue();
    if (previousSelectorIndex > -1) {
      currentSelectors[previousSelectorIndex].inUse = false;
    }
    currentSelectors[nextSelectorIndex].inUse = true;
    this._selectors.next(currentSelectors);
  }

  private updateSelectorInUse(selectorValue: string, inUse: boolean): void {
    if (!selectorValue) {
      return;
    }
    const currentSelectors = this._selectors.getValue();
    const { index: selectorIndex } = this._selectorsMap.get(selectorValue);
    currentSelectors[selectorIndex].inUse = inUse;
    this._selectors.next(currentSelectors);
  }

  private setValueFormControl(
    formGroup: FormGroup,
    currentSelectorType: FilterGroupType,
    nexSelectorType: FilterGroupType,
  ): void {
    if (nexSelectorType === currentSelectorType) {
      formGroup.get('value').reset();
      return;
    }

    if (nexSelectorType === FilterGroupType.DATE_RANGE) {
      formGroup.setControl(
        'value',
        new FormGroup(
          {
            start: new FormControl(),
            end: new FormControl(),
          },
          [Validators.required],
        ),
      );
      return;
    }

    formGroup.setControl('value', new UntypedFormControl('', [Validators.required]));
  }

  private createSelectOptionsMap(options: FilterGroupConfig[]): void {
    this._selectors.next(options);
    options.forEach((selector, index) => {
      this._selectorsMap.set(selector.value, { selector, index });
    });
  }

  private createNewFilterGroup(firstFilterGroup = false, initialValue?: FilterGroupValue): FormGroup<FilterFormGroup> {
    const formGroup = new FormGroup<FilterFormGroup>({
      connector: new FormControl<FilterGroupConnector>({
        value: firstFilterGroup ? FilterGroupConnector.WHERE : FilterGroupConnector.AND,
        disabled: true,
      }),
      selector: new FormControl<string | null>(null),
      operator: new FormControl<FilterGroupOperator>({ value: FilterGroupOperator.IT_IS, disabled: true }),
      value: new UntypedFormControl(null),
    });

    if (initialValue) {
      this.checkAndUpdateValueControl(formGroup, initialValue.value);
      formGroup.setValue(initialValue);
    }

    return formGroup;
  }

  private checkAndUpdateValueControl(formGroup: FormGroup<FilterFormGroup>, value: any): void {
    const isDateControl = (typeof value === 'object' && value['start']) || value['end'];

    if (!isDateControl) {
      return;
    }

    formGroup.setControl(
      'value',
      new FormGroup(
        {
          start: new FormControl(),
          end: new FormControl(),
        },
        [Validators.required],
      ),
    );
  }

  private getInitialFilter(): FormGroup<DialogForm> {
    return new FormGroup({ filters: this._fb.array([this.createNewFilterGroup(true)]) });
  }

  restoreFilter(filterToRestore: FilterValue): void {
    if (!filterToRestore) {
      return;
    }
    const currentFilter = this._filterForm.getValue();
    const currentFilterGroups = currentFilter.get('filters') as FormArray;
    currentFilterGroups.clear();

    filterToRestore.forEach((groupToRestore, index) => {
      currentFilterGroups.push(this.createNewFilterGroup(index === 0, groupToRestore));
    });
    this._filterForm.next(currentFilter);
  }
}
