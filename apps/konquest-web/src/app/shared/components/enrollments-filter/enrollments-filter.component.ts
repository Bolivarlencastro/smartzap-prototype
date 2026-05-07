import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';
import {
  KpDateRangeFilterV2Component,
  KpPercentageRangeFilterComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-range-filter';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { Store } from '@ngrx/store';
import { delay, Subject, takeUntil } from 'rxjs';
import { EnrollmentType } from './model/enrollment-filter';
import { EnrollmentsFilterService } from './services/enrollments-filter.service';
import { EnrollmentsFilterActions } from './store';

@Component({
  selector: 'app-enrollments-filter',
  templateUrl: './enrollments-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconButton,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    KpSelectMenuTriggerComponent,
    MatSelect,
    KpSelectTriggerContentDirective,
    MatOption,
    KpDateRangeFilterV2Component,
    KpPercentageRangeFilterComponent,
    TranslocoPipe,
  ],
})
export class EnrollmentsFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type: EnrollmentType;
  @Input() filteringAllUsers: boolean;

  filterForm: FormGroup;
  statusOptions: KpFilterSelectOption[];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private enrollmentsFilterService: EnrollmentsFilterService,
  ) {
    this.filterForm = this.buildFilterForm(formBuilder);
  }

  ngOnInit(): void {
    this.listenToStatusChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']) {
      this.statusOptions = this.enrollmentsFilterService.getStatusOptions(this.type);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openFiltersModal(): void {
    this.store.dispatch(EnrollmentsFilterActions.openFilterDialog({ enrollmentType: this.type }));
  }

  onFilter(): void {
    this.store.dispatch(
      EnrollmentsFilterActions.storeFilterControllerState({
        enrollmentType: this.type,
        filterState: { filter: this.filterForm.value },
      }),
    );
  }

  private buildFilterForm(fb: FormBuilder): FormGroup {
    return fb.group({
      status: null,
      start_date__gte: null,
      start_date__lte: null,
      end_date__gte: null,
      end_date__lte: null,
      performance__gte: undefined,
      performance__lte: undefined,
    });
  }

  private listenToStatusChange(): void {
    this.filterForm
      .get('status')
      .valueChanges.pipe(takeUntil(this.unsubscribe$), delay(0))
      .subscribe(() => this.onFilter());
  }
}
