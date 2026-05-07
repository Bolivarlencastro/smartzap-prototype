import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { cycleEnrollmentsFilterOptions } from './cycle-enrollments-filter-options';
import { Observable, Subject } from 'rxjs';
import {
  KpFilterContainerComponent,
  KpFilterController,
  KpFilterDefDirective,
  KpFilterOption,
  KpFilterSelectOption,
} from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CycleEnrollmentsFilterACType, CycleEnrollmentsFilterResult } from '../../models';
import { Store } from '@ngrx/store';
import { cycleEnrollmentsFilterFeature, CycleEnrollmentsFilterState } from '../../store/features';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CycleEnrollmentsFilterActions } from '../../store/actions';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { CycleIconPipe } from '../../pipes/cycle-icon.pipe';

@Component({
  selector: 'kp-cycle-enrollments-filter',
  templateUrl: './cycle-enrollments-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    KpFilterContainerComponent,
    KpFilterDefDirective,
    MatFormField,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatIcon,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslocoPipe,
    CycleIconPipe,
  ],
})
export class CycleEnrollmentsFilterComponent implements OnInit, OnDestroy {
  protected filterOptions: KpFilterOption[];
  protected readonly filterFormGroup = new FormGroup({});
  private readonly unsub = new Subject<void>();

  @ViewChild(KpFilterController) private filterController: KpFilterController;
  protected readonly viewModel$: Observable<CycleEnrollmentsFilterState>;

  constructor(
    private dialogRef: MatDialogRef<CycleEnrollmentsFilterComponent>,
    private store: Store,
    private userProfileService: UserProfileService,
  ) {
    this.viewModel$ = this.store.select(cycleEnrollmentsFilterFeature.selectViewModel);
  }

  ngOnInit() {
    this.setFilterOptions();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  onFilter(): void {
    const result: CycleEnrollmentsFilterResult = {
      filter: this.filterFormGroup.getRawValue(),
      controllerState: this.filterController.getControllerState(),
    };
    this.dialogRef.close(result);
  }

  clearFilter() {
    this.filterController.resetSelection();
  }

  onSearch(search: string, searchType: CycleEnrollmentsFilterACType) {
    this.store.dispatch(CycleEnrollmentsFilterActions.autocompleteSearch({ searchType, search }));
  }

  defaultDisplayWith(item: KpFilterSelectOption) {
    return item.label;
  }

  private setFilterOptions() {
    if (this.userProfileService.isAdmin()) {
      this.filterOptions = cycleEnrollmentsFilterOptions;
      return;
    }

    this.filterOptions = cycleEnrollmentsFilterOptions.filter((option) => option.filterKey !== 'leader');
  }
}
