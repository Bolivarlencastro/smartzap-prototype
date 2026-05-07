import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ListViewModel } from '../../models/list';
import { Trail } from '../../models/trail';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { TranslocoPipe } from '@jsverse/transloco';
import { TrailsListComponent } from '../../components/trails-list/trails-list.component';
import { MatButton } from '@angular/material/button';
import { TrailDialogActions, TrailListActions, trailListFeature } from '../../store/trail';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'lp-trails',
  imports: [KpTableLayoutComponent, TranslocoPipe, TrailsListComponent, MatButton],
  template: `
    @let vm = this.vm();
    @let filter = this.vm().filter;

    <kp-table-layout
      class="grow"
      [totalItems]="vm.count"
      [pageIndex]="filter.page - 1"
      [pageSize]="filter.per_page"
      [searchPlaceholder]="'LEADER_PANEL.TRAILS.FILTER.SEARCH'"
      (searchChange)="onFilterChange($event)"
      (pageChange)="onPageChange($event)"
    >
      <button kpTableFilterAfter matButton="outlined" (click)="trailsList.exportTable()">
        {{ 'LEADER_PANEL.GENERAL.EXPORT_DATA' | transloco }}
      </button>
      <lp-trails-list
        #trailsList
        kpTable
        [isLoading]="vm.loading"
        [trails]="vm.data"
        (sort)="onSort($event)"
        (rowClick)="openDialog($event)"
      ></lp-trails-list>
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
export class TrailsComponent {
  vm: Signal<ListViewModel<Trail>>;

  constructor(private readonly store: Store) {
    store.dispatch(TrailListActions.init());
    this.vm = toSignal(store.select(trailListFeature.selectViewModel));
  }

  onFilterChange(search: string) {
    this.store.dispatch(TrailListActions.search({ search }));
  }

  onSort(sort: Sort) {
    this.store.dispatch(TrailListActions.sort({ sort }));
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.store.dispatch(TrailListActions.setPagination({ page: pageIndex + 1, per_page: pageSize }));
  }

  openDialog(selectedTrail: Trail) {
    this.store.dispatch(TrailDialogActions.openDialog({ selectedTrail }));
  }
}
