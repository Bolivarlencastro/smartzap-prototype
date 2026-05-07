import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  KpFilterContainerComponent,
  KpFilterController,
  KpFilterDefDirective,
  KpFilterOption,
  KpFilterSelectOption,
} from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { Store } from '@ngrx/store';
import { format, isDate } from 'date-fns';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { debounceTime, distinctUntilChanged, Observable, startWith } from 'rxjs';
import {
  EnrollmentFilterResult,
  EnrollmentFiltersSearch,
  EnrollmentFiltersSearchType,
  EnrollmentType,
} from '../../model/enrollment-filter';
import { EnrollmentsFilterActions, enrollmentsFilterFeature, EnrollmentsFilterState } from '../../store';

@Component({
  selector: 'app-enrollments-filter-modal',
  templateUrl: './enrollments-filter-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    KpFilterContainerComponent,
    KpFilterDefDirective,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
    MatFormField,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    NgxMatSelectSearchModule,
  ],
})
export class EnrollmentsFilterModalComponent implements OnInit {
  protected filterOptions: KpFilterOption[];
  protected type: EnrollmentType;
  protected readonly viewModel$: Observable<EnrollmentsFilterState>;

  filterFormGroup = new UntypedFormGroup({});

  readonly categoriesAcFormControl = new FormControl();
  readonly instructorsAcFormControl = new FormControl();

  @ViewChild(KpFilterController) private filterController: KpFilterController;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private _dialogRef: MatDialogRef<EnrollmentsFilterModalComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.viewModel$ = this.store.select(enrollmentsFilterFeature.selectViewModel);
    this.filterOptions = data.filterOptions;
    this.type = data.type;
  }

  ngOnInit() {
    if (this.type === 'EVENT') {
      this.registerAutocompletes();
    }
  }

  onFilter() {
    const formValue = this.filterFormGroup.getRawValue();
    const dateFields = new Set([
      'start_date',
      'start_date__gte',
      'start_date__lte',
      'end_date',
      'end_date__gte',
      'end_date__lte',
      'created_date',
      'created_date__gte',
      'created_date__lte',
      'event_date',
      'event_date__gte',
      'event_date__lte',
    ]);

    const filter = Object.entries(formValue).reduce((acc, [key, value]) => {
      if (!value) {
        return acc;
      }

      const formattedValue = dateFields.has(key) ? this.formatDate(value as Date | string) : value;

      return { ...acc, [key]: formattedValue };
    }, {});

    const result: EnrollmentFilterResult = {
      filter,
      controllerState: this.filterController.getControllerState(),
    };

    this._dialogRef.close(result);
  }

  getSelectTriggerLabel(value: KpFilterSelectOption[]) {
    if (!value?.length) {
      return '';
    }

    return value.map((option) => option.label).join(', ');
  }

  optionsCompare(o1: KpFilterSelectOption, o2: KpFilterSelectOption) {
    return o1?.value === o2?.value;
  }

  optionsTrackBy(_index: number, option: KpFilterSelectOption) {
    return option?.value as string;
  }

  shouldDisplayOption(optionValue: string, currentOptions: KpFilterSelectOption[]) {
    return !currentOptions.some((option) => option.value === optionValue);
  }

  clearFilter() {
    this.filterController.resetSelection();
  }

  private formatDate(date: Date | string): string {
    if (!isDate(date)) {
      return date as string;
    }
    return format(date as Date, 'yyyy-MM-dd');
  }

  private registerAutocompletes() {
    this.registerAutocomplete(this.categoriesAcFormControl, 'categories');
    this.registerAutocomplete(this.instructorsAcFormControl, 'instructors');
  }

  private registerAutocomplete(formControl: FormControl, searchType: EnrollmentFiltersSearchType) {
    formControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), startWith(''), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onSearch(value, searchType));
  }

  private onSearch(filter: string, searchType: EnrollmentFiltersSearchType) {
    const search: EnrollmentFiltersSearch = { search: filter, searchType };
    this.store.dispatch(EnrollmentsFilterActions.filterSelectOptions({ search }));
  }
}
