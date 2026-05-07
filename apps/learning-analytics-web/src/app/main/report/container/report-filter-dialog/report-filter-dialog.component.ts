import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ReportType } from 'app/main/report/enums/report';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { reportFiltersFeature, ReportFiltersFeatureState } from 'app/main/report/store/features/report-filters.feature';
import { ReportFiltersSearch, ReportFiltersSearchType } from 'app/main/report/interfaces/report-filters-search';
import { ReportFiltersActions } from 'app/main/report/store/actions';
import {
  ALL_USERS_OPTIONS,
  MISSION_ENROLLMENTS_OPTIONS,
  MISSION_ENROLLMENTS_QUIZZES_OPTIONS,
  TRAIL_CONCLUSION_RATE_OPTIONS,
  TRAILS_ENROLLMENTS_OPTIONS,
  TRAILS_LIST_OPTIONS,
  USERS_ACCESS_OPTIONS,
  WORKSPACE_MISSION_OPTIONS,
} from 'app/main/report/container/report-filter-dialog/filter-options';
import {
  KpFilterContainerComponent,
  KpFilterController,
  KpFilterDefDirective,
  KpFilterOption,
  KpFilterSelectOption,
} from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { AsyncPipe } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

export type ReportFilterDialogData = {
  reportType: ReportType;
};

@Component({
  selector: 'app-report-filter-dialog',
  templateUrl: './report-filter-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    KpFilterContainerComponent,
    KpFilterDefDirective,
    MatFormField,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    NgxMatSelectSearchModule,
    KpCardTagComponent,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class ReportFilterDialogComponent implements OnInit, OnDestroy {
  protected readonly filterOptions: KpFilterOption[];
  protected readonly filterFormGroup = new FormGroup({});
  readonly channelsAcFormControl = new FormControl();
  readonly leadersAcFormControl = new FormControl();
  readonly creatorsAcFormControl = new FormControl();
  readonly providersAcFormControl = new FormControl();
  readonly missionsAcFormControl = new FormControl();
  readonly trailsAcFormControl = new FormControl();
  readonly categoriesAcFormControl = new FormControl();
  readonly groupsAcFormControl = new FormControl();
  readonly usersAcFormControl = new FormControl();
  readonly activityAreasAcFormControl = new FormControl();
  readonly managersAcFormControl = new FormControl();
  readonly directorsAcFormControl = new FormControl();
  readonly jobsAcFormControl = new FormControl();
  readonly jobFunctionsAcFormControl = new FormControl();

  private readonly unsub = new Subject<void>();
  protected readonly viewModel$: Observable<ReportFiltersFeatureState>;

  @ViewChild(KpFilterController) private filterController: KpFilterController;

  constructor(
    private dialogRef: MatDialogRef<ReportFilterDialogComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) protected dialogData: ReportFilterDialogData,
  ) {
    this.filterOptions = this.getFilterOptions(dialogData.reportType);
    this.viewModel$ = this.store.select(reportFiltersFeature.selectViewModel);
  }

  get title() {
    return `REPORT.${this.dialogData.reportType}`;
  }

  ngOnInit() {
    this.registerAutocompletes();
  }

  private registerAutocompletes(): void {
    this.registerAutocomplete(this.channelsAcFormControl, 'channels');
    this.registerAutocomplete(this.leadersAcFormControl, 'leaders');
    this.registerAutocomplete(this.creatorsAcFormControl, 'creators');
    this.registerAutocomplete(this.providersAcFormControl, 'providers');
    this.registerAutocomplete(this.missionsAcFormControl, 'missions');
    this.registerAutocomplete(this.trailsAcFormControl, 'trails');
    this.registerAutocomplete(this.categoriesAcFormControl, 'categories');
    this.registerAutocomplete(this.groupsAcFormControl, 'groups');
    this.registerAutocomplete(this.usersAcFormControl, 'users');
    this.registerAutocomplete(this.activityAreasAcFormControl, 'activityAreas');
    this.registerAutocomplete(this.managersAcFormControl, 'managers');
    this.registerAutocomplete(this.directorsAcFormControl, 'directors');
    this.registerAutocomplete(this.jobsAcFormControl, 'jobs');
    this.registerAutocomplete(this.jobFunctionsAcFormControl, 'jobFunctions');
  }

  private registerAutocomplete(formControl: FormControl, searchType: ReportFiltersSearchType): void {
    formControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), startWith(''), takeUntil(this.unsub))
      .subscribe((value) => this.onSearch(value, searchType));
  }

  private onSearch(filter: string, searchType: ReportFiltersSearchType) {
    const search: ReportFiltersSearch = { search: filter, searchType };
    this.store.dispatch(ReportFiltersActions.filterSelectOptions({ search }));
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
    this.store.dispatch(ReportFiltersActions.resetState());
  }

  clearFilter() {
    this.filterController.resetSelection();
  }

  onFilter() {
    this.dialogRef.close(this.filterFormGroup.getRawValue());
  }

  optionsTrackBy(_index: number, option: KpFilterSelectOption) {
    return option?.value as string;
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

  shouldDisplayOption(optionValue: string, currentOptions: KpFilterSelectOption[]) {
    return !currentOptions.some((option) => option.value === optionValue);
  }

  private getFilterOptions(reportType: ReportType): KpFilterOption[] {
    const configMap = new Map([
      [ReportType.WORKSPACE_MISSION, WORKSPACE_MISSION_OPTIONS],
      [ReportType.MISSION_ENROLLMENTS, MISSION_ENROLLMENTS_OPTIONS],
      [ReportType.MISSION_ENROLLMENTS_QUIZZES, MISSION_ENROLLMENTS_QUIZZES_OPTIONS],
      [ReportType.TRAIL_LIST, TRAILS_LIST_OPTIONS],
      [ReportType.TRAIL_ENROLLMENTS, TRAILS_ENROLLMENTS_OPTIONS],
      [ReportType.TRAIL_CONCLUSION_RATE, TRAIL_CONCLUSION_RATE_OPTIONS],
      [ReportType.ALL_USERS, ALL_USERS_OPTIONS],
      [ReportType.USERS_ACCESS, USERS_ACCESS_OPTIONS],
    ]);

    return configMap.get(reportType) || [];
  }

  shouldDisplayMissionTag(option: any): boolean {
    return option.status === 'DONE' || option.status === 'INACTIVATED';
  }

  getMissionTagType(option: any): string {
    if (option.status === 'DONE') {
      return 'development-published';
    } else if (option.status === 'INACTIVATED') {
      return 'development-inactive';
    }
    return option.status;
  }
}
