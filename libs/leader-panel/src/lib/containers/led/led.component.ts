import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { LedListComponent } from '../../components/led/led-list/led-list.component';
import { PageEvent } from '@angular/material/paginator';
import { ListViewModel } from '../../models/list';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Sort } from '@angular/material/sort';
import { Led } from '../../models/led';
import { LedListActions, ledListFeature } from '../../store/led';
import { LedOverviewActions } from '../../store/led-overview';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'lp-led',
  imports: [LedListComponent, KpTableLayoutComponent],
  template: `
    @let vm = this.vm();
    @let filter = this.vm().filter;
    <kp-table-layout
      class="grow"
      [totalItems]="vm.count"
      [pageIndex]="filter.page - 1"
      [pageSize]="filter.per_page"
      [searchPlaceholder]="'LEADER_PANEL.LED.FILTER.SEARCH'"
      (searchChange)="onFilterChange($event)"
      (pageChange)="onPageChange($event)"
    >
      <lp-led-list
        kpTable
        [isLoading]="vm.loading"
        [led]="vm.data"
        (sort)="onSort($event)"
        (rowClick)="openDialog($event)"
      ></lp-led-list>
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
export class LedComponent {
  vm: Signal<ListViewModel<Led>>;

  constructor(private readonly store: Store) {
    store.dispatch(LedListActions.init());
    this.vm = toSignal(store.select(ledListFeature.selectViewModel));
  }

  onFilterChange(search: string) {
    this.store.dispatch(LedListActions.search({ search }));
  }

  onSort(sort: Sort) {
    this.store.dispatch(LedListActions.sort({ sort }));
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.store.dispatch(LedListActions.setPagination({ page: pageIndex + 1, per_page: pageSize }));
  }

  openDialog(led: Led) {
    this.store.dispatch(LedOverviewActions.openDialog({ selectedUser: led }));
  }
}
