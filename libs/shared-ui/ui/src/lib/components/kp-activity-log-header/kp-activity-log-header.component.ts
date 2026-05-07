import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivityLogFilter, ActivityLogOptions } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpDateRangeFilterV2Component } from '../kp-range-filter';
import { KpSelectMenuTriggerComponent, KpSelectTriggerContentDirective } from '../kp-select-menu';

@Component({
  selector: 'kp-activity-log-header',
  imports: [
    TranslocoModule,
    KpDateRangeFilterV2Component,
    MatIconModule,
    MatSelectModule,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './kp-activity-log-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpActivityLogHeaderComponent implements OnInit {
  options = input<ActivityLogOptions>();
  filter = output<ActivityLogFilter>();

  filterForm: FormGroup;
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly formBuilder: FormBuilder) {
    this.filterForm = this.buildFilterForm(formBuilder);
  }

  ngOnInit(): void {
    this.listenToChanges();
  }

  onFilter(): void {
    const filter = this.filterForm.value;
    this.filter.emit(filter);
  }

  private buildFilterForm(fb: FormBuilder): FormGroup {
    return fb.group({
      createdDateGte: null,
      createdDateLte: null,
      userId: null,
      actionKey: null,
      status: null,
    });
  }

  private listenToChanges(): void {
    this.filterForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onFilter());
  }
}
