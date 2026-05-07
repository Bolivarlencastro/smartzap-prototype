import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { EventsListComponent } from '../../components/events/events-list/events-list.component';
import { Event } from '../../models/events';
import { ListViewModel } from '../../models/list';
import { EventDialogActions, EventListActions, eventListFeature } from '../../store/event';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'lp-events',
  imports: [KpTableLayoutComponent, EventsListComponent, TranslocoPipe, MatButton],
  template: `
    @let vm = this.vm();
    @let filter = this.vm().filter;

    <kp-table-layout
      class="grow"
      [totalItems]="vm.count"
      [pageIndex]="filter.page - 1"
      [pageSize]="filter.per_page"
      [searchPlaceholder]="'LEADER_PANEL.EVENTS.FILTER.SEARCH'"
      (searchChange)="onFilterChange($event)"
      (pageChange)="onPageChange($event)"
    >
      <button kpTableFilterAfter matButton="outlined" (click)="eventsList.exportTable()">
        {{ 'LEADER_PANEL.GENERAL.EXPORT_DATA' | transloco }}
      </button>
      <lp-events-list
        #eventsList
        kpTable
        [events]="vm.data"
        [isLoading]="vm.loading"
        (sort)="onSort($event)"
        (rowClick)="openDialog($event)"
      ></lp-events-list>
    </kp-table-layout>
  `,
  styles: `
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  protected readonly vm: Signal<ListViewModel<Event>>;

  constructor(private readonly store: Store) {
    store.dispatch(EventListActions.init());
    this.vm = toSignal(store.select(eventListFeature.selectViewModel));
  }

  onFilterChange(search: string) {
    this.store.dispatch(EventListActions.search({ search }));
  }

  onSort(sort: Sort) {
    this.store.dispatch(EventListActions.sort({ sort }));
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.store.dispatch(EventListActions.setPagination({ page: pageIndex + 1, per_page: pageSize }));
  }

  openDialog(selectedEvent: Event) {
    this.store.dispatch(EventDialogActions.openDialog({ selectedEvent }));
  }
}
