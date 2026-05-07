import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';

import { ContentPageBaseComponent } from './content-page-base';
import { ChannelsListComponent } from '../components/channels-list/channels-list.component';
import { ChannelsFiltersComponent } from '../components/filters/channels-filters.component';
import { KpTableLayoutComponent } from '@keeps-platform-frontend-workspace/ui/kp-table-layout';
import { Store } from '@ngrx/store';
import { LanguagesService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { toSignal } from '@angular/core/rxjs-interop';
import { categoriesFeature } from 'app/shared/store';
import { ChannelCategory } from 'app/main/channel/channel.model';
import { ContentManagementListActions } from '../store/actions';

@Component({
  selector: 'app-channels-page',
  imports: [ChannelsListComponent, ChannelsFiltersComponent, KpTableLayoutComponent],
  template: `
    <kp-table-layout
      class="grow"
      [totalItems]="totalItems()"
      [pageIndex]="currentPage() - 1"
      [pageSize]="perPage()"
      (pageChange)="pageChanged($event)"
      (searchChange)="filterChanged({ search: $event })"
    >
      <app-channels-filters
        kpTableFilterAfter
        [isContentCreator]="forceFilterOnlyManaged"
        [categories]="categories()"
        [languages]="languages()"
        (filterChange)="filterChanged($event)"
      ></app-channels-filters>

      <app-channels-list
        kpTable
        [learnContents]="learnContents()"
        [isLoading]="loading()"
        (itemAction)="onItemAction($event)"
      ></app-channels-list>
    </kp-table-layout>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelsPageComponent extends ContentPageBaseComponent implements OnInit {
  protected readonly categories: Signal<ChannelCategory[]>;

  constructor(
    protected override readonly store: Store,
    protected override readonly languagesService: LanguagesService,
    protected override readonly userProfileService: UserProfileService,
  ) {
    super(store, languagesService, userProfileService);
    this.categories = toSignal(store.select(categoriesFeature.selectChannels));
  }

  ngOnInit() {
    this.loadContents();
    this.store.dispatch(ContentManagementListActions.loadChannelsFilterData());
  }
}
