import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { PulsesListComponent } from '../../components/pulses/pulses-list.component';
import { ListViewModel } from '../../models/list';
import { Pulse } from '../../models/pulse';
import { PulseDialogActions, PulseListActions, pulseListFeature } from '../../store/pulse';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'lp-pulses',
  imports: [KpTableLayoutComponent, TranslocoPipe, PulsesListComponent, MatButton],
  template: `
    @let vm = this.vm();
    @let filter = this.vm().filter;

    <kp-table-layout
      class="grow"
      [totalItems]="vm.count"
      [pageIndex]="filter.page - 1"
      [pageSize]="filter.per_page"
      [searchPlaceholder]="'LEADER_PANEL.PULSES.FILTER.SEARCH'"
      (searchChange)="onFilterChange($event)"
      (pageChange)="onPageChange($event)"
    >
      <button kpTableFilterAfter matButton="outlined" (click)="pulsesListComponent.exportTable()">
        {{ 'LEADER_PANEL.GENERAL.EXPORT_DATA' | transloco }}
      </button>
      <lp-pulses-list
        #pulsesListComponent
        kpTable
        [isLoading]="vm.loading"
        [pulses]="vm.data"
        (sort)="onSort($event)"
        (rowClick)="openDialog($event)"
      ></lp-pulses-list>
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
export class PulsesComponent {
  protected readonly vm: Signal<ListViewModel<Pulse>>;

  constructor(private readonly store: Store) {
    this.store.dispatch(PulseListActions.init());
    this.vm = toSignal(this.store.select(pulseListFeature.selectViewModel));
  }

  onFilterChange(search: string) {
    this.store.dispatch(PulseListActions.search({ search }));
  }

  onSort(sort: Sort) {
    this.store.dispatch(PulseListActions.sort({ sort }));
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.store.dispatch(PulseListActions.setPagination({ page: pageIndex + 1, per_page: pageSize }));
  }

  openDialog(selectedPulse: Pulse) {
    this.store.dispatch(PulseDialogActions.openDialog({ selectedPulse }));
  }
}
