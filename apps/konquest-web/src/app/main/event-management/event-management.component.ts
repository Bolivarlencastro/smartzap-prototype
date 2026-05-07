import { SelectionModel } from '@angular/cdk/collections';
import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { KpBatchActionSelectionCounterComponent } from '@keeps-platform-frontend-workspace/ui/kp-batch-action-selection-counter';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MissionEnrollmentAttendance } from '../mission/mission.model';
import { EventManagementHeaderComponent } from './containers/event-management-header/event-management-header.component';
import { EventManagementListComponent } from './containers/event-management-list/event-management-list.component';
import { FilterForm } from './models/filter';
import { EventManagementViewModel } from './models/view-model';
import { DateRangePipe } from './pipes/date-range.pipe';
import { EventManagementActions } from './store/actions';
import { eventManagementFeature } from './store/features';

@Component({
  selector: 'app-event-management',
  imports: [
    EventManagementHeaderComponent,
    EventManagementListComponent,
    KpBatchActionSelectionCounterComponent,
    KpTableLayoutComponent,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslocoModule,
    DateRangePipe,
    TitleCasePipe,
  ],
  template: `
    @if (selection.hasValue() && !vm()?.usersLoading) {
      <kp-batch-action-selection-counter [selection]="selection.selected.length"></kp-batch-action-selection-counter>
    }
    <app-event-management-header></app-event-management-header>
    <kp-table-layout class="grow" [hidePaginator]="true" (searchChange)="onSearch($event)">
      <div kpTableFilterAfter class="flex gap-2" [formGroup]="form">
        <kp-select-menu-trigger [label]="selectedDate() | dateRange | titlecase" [displayCloseButton]="false">
          <mat-select kpSelectTriggerContent formControlName="date_id">
            @for (date of vm()?.dateFilterOptions; track date.id) {
              <mat-option [value]="date.id">{{ date | dateRange | titlecase }}</mat-option>
            }
          </mat-select>
        </kp-select-menu-trigger>
        <kp-select-menu-trigger [label]="'EVENT_MANAGEMENT.PRESENCE.LABEL' | transloco">
          <mat-icon class="s-1 filled text-primary">circle</mat-icon>
          <mat-select kpSelectTriggerContent formControlName="presented">
            <mat-option [value]="false">{{ 'EVENT_MANAGEMENT.PRESENCE.ABSENT' | transloco }}</mat-option>
            <mat-option [value]="true">{{ 'EVENT_MANAGEMENT.PRESENCE.PRESENT' | transloco }}</mat-option>
          </mat-select>
        </kp-select-menu-trigger>
      </div>
      <app-event-management-list kpTable [selection]="selection"></app-event-management-list>
    </kp-table-layout>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventManagementComponent implements OnInit, OnDestroy {
  readonly eventId = input<string>();
  readonly vm: Signal<EventManagementViewModel>;
  readonly selection = new SelectionModel<MissionEnrollmentAttendance>(true, []);

  readonly form: FormGroup<FilterForm>;
  readonly selectedDate = signal<any>(null);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
  ) {
    this.vm = toSignal(store.select(eventManagementFeature.selectViewModel));
    this.form = this.buildForm();
    this.registerFormListener();
  }

  ngOnInit() {
    this.store.dispatch(EventManagementActions.init({ eventId: this.eventId() }));
  }

  ngOnDestroy() {
    this.store.dispatch(EventManagementActions.reset());
  }

  onSearch(search: string) {
    this.store.dispatch(EventManagementActions.setFilter({ filter: { search } }));
  }

  private buildForm() {
    return this.formBuilder.group<FilterForm>({
      date_id: new FormControl(),
      presented: new FormControl(),
    });
  }

  private registerFormListener() {
    this.form.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onFilter());

    effect(() => {
      const formDateValue = this.form?.get('date_id')?.value;
      const storeDateValue = this.vm()?.filter?.date_id;
      const selectedDate = this.vm()?.dateFilterOptions?.find((date) => date.id === storeDateValue);
      this.selectedDate.set(selectedDate);

      if (!!storeDateValue && formDateValue !== storeDateValue) {
        this.form.patchValue({ date_id: storeDateValue });
      }
    });
  }

  private onFilter() {
    const formValue = this.form.value;
    this.store.dispatch(EventManagementActions.setFilter({ filter: { ...formValue } }));
  }
}
