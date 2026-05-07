import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import {
  KpFilterContainerComponent,
  KpFilterController,
  KpFilterDefDirective,
  KpFilterOption,
  KpFilterSelectOption,
} from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TransfersFiltersSearchType } from '../../models/transfers-filters-search-type';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransfersFiltersActions } from '../../store/actions';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { transfersFiltersFeature, TransfersFiltersFeatureState } from 'app/main/transfer/store/features';
import { TransfersFiltersResult } from 'app/main/transfer/models/transfers-filters-result';
import { AsyncPipe } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

const FILTER_OPTIONS: KpFilterOption[] = [
  {
    filterKey: 'source__in',
    type: 'autoComplete',
    customTemplate: 'originAc',
    label: marker('TRANSFER.FILTER.ORIGIN_WORKSPACE'),
  },
  {
    filterKey: 'receiver__in',
    type: 'autoComplete',
    customTemplate: 'destinationAc',
    label: marker('TRANSFER.FILTER.DESTINATION_WORKSPACE'),
  },
];

@Component({
  selector: 'app-transfers-filter-dialog',
  templateUrl: './transfers-filter-dialog.component.html',
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
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class TransfersFilterDialogComponent implements OnDestroy {
  protected readonly filterFormGroup = new FormGroup({});
  protected readonly filterOptions = FILTER_OPTIONS;
  protected readonly viewModel$: Observable<TransfersFiltersFeatureState>;

  readonly originAcFormControl = new FormControl();
  readonly destinationAcFormControl = new FormControl();

  private readonly unsub = new Subject<void>();

  @ViewChild(KpFilterController) private filterController: KpFilterController;

  constructor(
    private dialogRef: MatDialogRef<TransfersFilterDialogComponent>,
    private store: Store,
  ) {
    this.registerAutocompletes();
    this.viewModel$ = this.store.select(transfersFiltersFeature.selectTransfersFiltersState);
  }

  private registerAutocompletes(): void {
    this.registerAutocomplete(this.originAcFormControl, 'origin');
    this.registerAutocomplete(this.destinationAcFormControl, 'destination');
  }

  private registerAutocomplete(formControl: FormControl, searchType: TransfersFiltersSearchType): void {
    formControl.valueChanges
      .pipe(debounceTime(250), startWith(''), distinctUntilChanged(), takeUntil(this.unsub))
      .subscribe((value) => this.onSearch(value, searchType));
  }

  private onSearch(search: string, searchType: TransfersFiltersSearchType) {
    this.store.dispatch(TransfersFiltersActions.filterSelectOptions({ search, searchType }));
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  clearFilter() {
    this.filterController.resetSelection();
  }

  onFilter() {
    const result: TransfersFiltersResult = {
      filter: this.filterFormGroup.getRawValue(),
      controllerState: this.filterController.getControllerState(),
    };
    this.dialogRef.close(result);
  }

  getSelectTriggerLabel(value: KpFilterSelectOption[]) {
    if (!value?.length) {
      return '';
    }

    return value.map((option) => option.label).join(', ');
  }

  shouldDisplayOption(optionValue: string, currentOptions: KpFilterSelectOption[]) {
    return !currentOptions.some((option) => option.value === optionValue);
  }

  optionsTrackBy(_index: number, option: KpFilterSelectOption) {
    return option?.value as string;
  }

  optionsCompare(o1: KpFilterSelectOption, o2: KpFilterSelectOption) {
    return o1.value === o2.value;
  }
}
