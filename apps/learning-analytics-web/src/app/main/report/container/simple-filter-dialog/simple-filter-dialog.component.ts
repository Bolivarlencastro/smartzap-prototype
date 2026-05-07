import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FilterSelectionListComponent } from '../../components';
import { ReportType } from '../../enums/report';
import { SimpleFilterListItem, SimpleFilterReportModel } from '../../interfaces';
import { ReportActions, SimpleFilterReportActions } from '../../store/actions';
import { SimpleFilterReportSelectors } from '../../store/selectors';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { format, isDate, isValid } from 'date-fns';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { FilterSelectionListComponent as FilterSelectionListComponent_1 } from '../../components/filter-selection-list/filter-selection-list.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslocoPipe } from '@jsverse/transloco';

export interface SimpleFilterDialogData {
  title: string;
  subtitle: string;
  reportType: ReportType;
}

@Component({
  selector: 'app-simple-filter-dialog',
  template: `
    <button
      mat-icon-button
      [matTooltip]="'GENERAL.CLOSE' | transloco"
      aria-label="close"
      class="leading-none w-11 h-11 absolute top-4 right-3 z-50"
      mat-dialog-close
    >
      <mat-icon class="s-6">close</mat-icon>
    </button>

    <h2 mat-dialog-title class="leading-none">
      <mat-icon svgIcon="filter_list" class="s-4 mr-3"></mat-icon>
      <span class="sm:text-xl">{{ this.data?.title || '' | transloco }}</span>
    </h2>

    <mat-dialog-content>
      @if (isUserAccessReport) {
        <mat-form-field class="w-full">
          <mat-label>{{ 'REPORT.SIMPLE_FILTER_DIALOG.PERIOD' | transloco }}</mat-label>
          <mat-date-range-input [formGroup]="dateRange" [rangePicker]="enrollmentRangePicker" [max]="maxDate">
            <input
              formControlName="time_start__gte"
              matStartDate
              placeholder="{{ 'REPORT.SIMPLE_FILTER_DIALOG.FROM' | transloco }}"
            />
            <input
              formControlName="time_start__lte"
              matEndDate
              placeholder="{{ 'REPORT.SIMPLE_FILTER_DIALOG.TO' | transloco }}"
            />
          </mat-date-range-input>
          <mat-datepicker-toggle matSuffix [for]="enrollmentRangePicker"></mat-datepicker-toggle>
          <mat-date-range-picker #enrollmentRangePicker></mat-date-range-picker>
        </mat-form-field>
      }
      <app-filter-selection-list
        [subtitle]="this.data?.subtitle || '' | transloco"
        [items]="items$ | async"
        [optionsTotal]="count$ | async"
        [isLoading]="isLoading$ | async"
        [hasNoItems]="hasNoItems$ | async"
        [multiple]="multiple$ | async"
        (searchChanged)="onSearch($event)"
        (loadMoreItems)="fetchMoreItem()"
        #selectionList
      >
      </app-filter-selection-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (isUserAccessReport) {
        <div class="mr-4">
          <mat-checkbox
            (change)="$event ? toggleAll() : null"
            [disabled]="(isLoading$ | async) || selectionList.isFiltering"
            [checked]="selectionList.isAllSelected"
            >{{ 'GENERAL.SELECT_ALL' | transloco }}
          </mat-checkbox>
        </div>
      }
      <button mat-stroked-button color="primary" (click)="clear()">
        {{ 'GENERAL.CLEAR_FILTER' | transloco }}
      </button>
      <button
        mat-flat-button
        [mat-dialog-close]="true"
        cdkFocusInitial
        color="primary"
        (click)="reportGenerate(reportType)"
        [disabled]="!validFilter"
      >
        <mat-icon svgIcon="filter_list" class="s-2 mr-2"></mat-icon>
        {{ 'GENERAL.APPLY' | transloco }}
      </button>
    </mat-dialog-actions>
  `,
  imports: [
    MatIconButton,
    MatDialogClose,
    MatTooltip,
    MatIcon,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatDateRangeInput,
    FormsModule,
    ReactiveFormsModule,
    MatStartDate,
    MatEndDate,
    MatDatepickerToggle,
    MatSuffix,
    MatDateRangePicker,
    FilterSelectionListComponent_1,
    MatDialogActions,
    MatCheckbox,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class SimpleFilterDialogComponent implements OnInit, OnDestroy {
  reportType: ReportType;
  items$: Observable<SimpleFilterListItem[]>;
  isLoading$: Observable<boolean>;
  hasNoItems$: Observable<boolean>;
  multiple$: Observable<boolean>;
  count$: Observable<number>;
  readonly isUserAccessReport: boolean;
  dateRange!: UntypedFormGroup;
  maxDate!: Date;

  @ViewChild('selectionList') selectionList!: FilterSelectionListComponent;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<SimpleFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SimpleFilterDialogData,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.items$ = this.store.select(SimpleFilterReportSelectors.selectItems);
    this.isLoading$ = this.store.select(SimpleFilterReportSelectors.selectIsLoading);
    this.hasNoItems$ = this.store.select(SimpleFilterReportSelectors.selectHasNoItems);
    this.multiple$ = this.store.select(SimpleFilterReportSelectors.selectMultiple);
    this.count$ = this.store.select(SimpleFilterReportSelectors.selectCount);
    this.reportType = this.data.reportType;
    this.isUserAccessReport = this.reportType === ReportType.USERS_ACCESS;

    if (this.isUserAccessReport) {
      this.setupDateRangeForm();
    }
  }

  private static normalizeDate(date: Date | null): string | null {
    return isDate(date) ? format(date, 'yyyy-MM-dd') : null;
  }

  get validFilter() {
    if (!this.isUserAccessReport) {
      return this.selectionList?.selectedCount > 0;
    }

    if (this.dateRange.invalid) {
      return false;
    }

    const { time_start__gte, time_start__lte } = this.dateRange.getRawValue();

    // The user needs to select a valid date range or at least one user in the list
    return (isValid(time_start__gte) && isValid(time_start__lte)) || this.selectionList?.selectedCount > 0;
  }

  ngOnInit() {
    const filter: SimpleFilterReportModel = { page: 1, reportType: this.reportType, search: '' };
    this.store.dispatch(SimpleFilterReportActions.loadFilterItems({ filter }));
  }

  ngOnDestroy() {
    this.store.dispatch(SimpleFilterReportActions.clear());
  }

  onSearch(search: string) {
    const filter = { page: 1, reportType: this.reportType, search };
    this.store.dispatch(SimpleFilterReportActions.searchItems({ filter }));
  }

  reportGenerate(reportType: ReportType) {
    if (this.isUserAccessReport) {
      // Normalize dates
      let { time_start__gte, time_start__lte } = this.dateRange.getRawValue();
      time_start__gte = SimpleFilterDialogComponent.normalizeDate(time_start__gte);
      time_start__lte = SimpleFilterDialogComponent.normalizeDate(time_start__lte);

      const filter = {
        reportType,
        user_id__in: this.selectionList.selectedItems.selected,
        time_start__gte,
        time_start__lte,
      };

      // We need to remove the date properties if they're empty so the API won't return an error
      if (!filter.time_start__lte || !filter.time_start__gte) {
        delete filter.time_start__lte;
        delete filter.time_start__gte;
      }

      this.store.dispatch(ReportActions.getReport({ filter }));
    } else {
      this.store.dispatch(
        ReportActions.getReport({ filter: { reportType, objectIds: this.selectionList.selectedItems.selected } }),
      );
    }
  }

  toggleAll() {
    this.selectionList.toggleAll();
  }

  fetchMoreItem() {
    this.store.dispatch(SimpleFilterReportActions.fetchMoreItems());
  }

  clear() {
    this.selectionList.clear();
    this.dateRange?.reset();
    const filter = { page: 1, reportType: this.reportType, search: '' };
    this.store.dispatch(SimpleFilterReportActions.searchItems({ filter }));
  }

  private setupDateRangeForm(): void {
    this.maxDate = new Date();
    this.dateRange = this.formBuilder.group({
      time_start__gte: '',
      time_start__lte: '',
    });
  }
}
