import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { AluraStatus, ManagementFilter, ManagementFilterForm } from '../../models';
import { getTranslocoScope } from '../../utils';
import { AluraCourseStatusPipe } from '../../utils/pipes/alura-course-status.pipe';
import { KpFilterComponent } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { KpDateRangeFilterV2Component } from '@keeps-platform-frontend-workspace/ui/kp-range-filter';

@Component({
  selector: 'kp-alura-management-filter',
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    KpFilterComponent,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    KpDateRangeFilterV2Component,
    MatIconModule,
    MatSelectModule,
    AluraCourseStatusPipe,
  ],
  template: `
    <kp-filter (searchChange)="onSearch($event)">
      <form [formGroup]="filterForm" class="flex items-center gap-2">
        <!-- CATEGORIES -->
        <kp-select-menu-trigger [label]="'INTEGRATIONS.MANAGEMENT_FILTER.CATEGORY' | transloco">
          <mat-icon class="s-6 text-primary">folder</mat-icon>
          <mat-select kpSelectTriggerContent multiple formControlName="category">
            @for (category of categories; track category) {
              <mat-option data-test="management-filter-category-option" [value]="category">
                <span>{{ category | transloco }}</span>
              </mat-option>
            }
          </mat-select>
        </kp-select-menu-trigger>
        <!-- / CATEGORIES -->

        <!-- STATUS -->
        <kp-select-menu-trigger [label]="'INTEGRATIONS.MANAGEMENT_FILTER.STATUS' | transloco">
          <mat-icon class="s-1 filled text-primary">circle</mat-icon>
          <mat-select kpSelectTriggerContent multiple formControlName="status">
            @for (status of statuses; track status) {
              <mat-option [value]="status">
                <span>{{ status | aluraCourseStatus | transloco }}</span>
              </mat-option>
            }
          </mat-select>
        </kp-select-menu-trigger>
        <!-- / STATUS -->

        <!-- START DATE FILTER -->
        <kp-date-range-filter-v2
          [parentFormGroup]="filterForm"
          gteFcName="created_date_gte"
          lteFcName="created_date_lte"
          icon="today"
          [label]="'INTEGRATIONS.MANAGEMENT_FILTER.MIRROR_DATE' | transloco"
        ></kp-date-range-filter-v2>
        <!-- / START DATE FILTER -->
      </form>
    </kp-filter>
  `,
  providers: [getTranslocoScope()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementFilterComponent implements OnInit, OnDestroy {
  @Input() categories: string[];
  @Output() saveFilter = new EventEmitter<ManagementFilter>();
  @Output() searchChange = new EventEmitter<string>();
  statuses = Object.values(AluraStatus);

  readonly filterForm: FormGroup<ManagementFilterForm>;
  private unsubscribe$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.buildForm(formBuilder);
  }

  ngOnInit(): void {
    this.listenToChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onFilter(): void {
    const value = this.filterForm.getRawValue();
    this.saveFilter.emit(value);
  }

  onSearch(term: string): void {
    this.searchChange.emit(term);
  }

  private listenToChanges(): void {
    this.filterForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.onFilter());
  }

  private buildForm(fb: FormBuilder): FormGroup {
    return fb.group({
      category: null,
      status: null,
      created_date_gte: undefined,
      created_date_lte: undefined,
    });
  }
}
