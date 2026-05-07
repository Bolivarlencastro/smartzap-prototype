import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { ChannelsListComponent } from '../../components/channels/channels-list/channels-list.component';
import { Channel } from '../../models/channel';
import { ListViewModel } from '../../models/list';
import { ChannelDialogActions, ChannelListActions, channelListFeature } from '../../store/channel';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';

@Component({
  selector: 'lp-channels',
  imports: [KpTableLayoutComponent, TranslocoPipe, MatButton, ChannelsListComponent],
  template: `
    @let vm = this.vm();
    @let filter = this.vm().filter;

    <kp-table-layout
      class="grow"
      [totalItems]="vm.count"
      [pageIndex]="filter.page - 1"
      [pageSize]="filter.per_page"
      [searchPlaceholder]="'LEADER_PANEL.CHANNELS.FILTER.SEARCH'"
      (searchChange)="onFilterChange($event)"
      (pageChange)="onPageChange($event)"
    >
      <button kpTableFilterAfter matButton="outlined" (click)="channelsList.exportTable()">
        {{ 'LEADER_PANEL.GENERAL.EXPORT_DATA' | transloco }}
      </button>
      <lp-channels-list
        #channelsList
        kpTable
        [isLoading]="vm.loading"
        [channels]="vm.data"
        (sort)="onSort($event)"
        (rowClick)="openDialog($event)"
      ></lp-channels-list>
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
export class ChannelsComponent {
  protected readonly vm: Signal<ListViewModel<Channel>>;

  constructor(private readonly store: Store) {
    store.dispatch(ChannelListActions.init());
    this.vm = toSignal(store.select(channelListFeature.selectViewModel));
  }

  onFilterChange(search: string) {
    this.store.dispatch(ChannelListActions.search({ search }));
  }

  onSort(sort: Sort) {
    this.store.dispatch(ChannelListActions.sort({ sort }));
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.store.dispatch(ChannelListActions.setPagination({ page: pageIndex + 1, per_page: pageSize }));
  }

  openDialog(selectedChannel: Channel) {
    this.store.dispatch(ChannelDialogActions.openDialog({ selectedChannel }));
  }
}
