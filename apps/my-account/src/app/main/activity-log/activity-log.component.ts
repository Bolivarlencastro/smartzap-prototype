import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivityLogFilter, ActivityLogViewModel } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpActivityLogHeaderComponent } from '@keeps-platform-frontend-workspace/ui/kp-activity-log-header';
import { KpActivityLogListComponent } from '@keeps-platform-frontend-workspace/ui/kp-activity-log-list';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { Store } from '@ngrx/store';
import { PageEvent } from '@angular/material/paginator';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivityLogActions, activityLogFeature } from './store';

@Component({
  selector: 'app-activity-log',
  imports: [TranslocoModule, KpActivityLogHeaderComponent, KpActivityLogListComponent, KpTableLayoutComponent],
  template: `
    @if (vm(); as vm) {
      <div class="w-full h-32 px-6 flex items-center gap-2.5 border-b border-default">
        <span class="text-2xl font-semibold">{{ 'UI.ACTIVITY_LOG.LABEL' | transloco }}</span>
      </div>
      <kp-table-layout
        class="grow"
        [totalItems]="vm.pagination.totalItems"
        [pageIndex]="vm.pagination.currentPage"
        [pageSize]="vm.pagination.perPage"
        (pageChange)="onPageChange($event)"
        (searchChange)="filterByTerm($event)"
      >
        <kp-activity-log-header
          kpTableFilterAfter
          [options]="vm.filterOptions"
          (filter)="onFilter($event)"
        ></kp-activity-log-header>
        <kp-activity-log-list kpTable [vm]="vm" (export)="onExport($event)"></kp-activity-log-list>
      </kp-table-layout>
    }
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
export class ActivityLogComponent implements OnDestroy {
  protected readonly vm: Signal<ActivityLogViewModel>;

  constructor(private store: Store) {
    this.store.dispatch(ActivityLogActions.init());
    this.vm = toSignal(store.select(activityLogFeature.selectViewModel));
  }

  ngOnDestroy(): void {
    this.store.dispatch(ActivityLogActions.resetState());
  }

  filterByTerm(search: string): void {
    this.store.dispatch(ActivityLogActions.filterByTerm({ search }));
  }

  onFilter(filter: ActivityLogFilter): void {
    this.store.dispatch(ActivityLogActions.setFilter({ filter }));
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      ActivityLogActions.setPagination({
        pagination: { currentPage: event.pageIndex + 1, perPage: event.pageSize },
      }),
    );
  }

  onExport(id: string): void {
    this.store.dispatch(ActivityLogActions.exportLog({ id }));
  }
}
