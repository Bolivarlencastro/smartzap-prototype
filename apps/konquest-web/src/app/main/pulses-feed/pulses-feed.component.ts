import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ChannelsFilterComponent } from './containers/channels-filter/channels-filter.component';
import { FavoritePulsesComponent } from './containers/favorite-pulses/favorite-pulses.component';
import { FeedListComponent } from './containers/feed-list/feed-list.component';
import { FeedTabsComponent } from './containers/feed-tabs/feed-tabs.component';
import { MobileFilterBarComponent } from './containers/mobile-filter-bar/mobile-filter-bar.component';
import { SideFiltersComponent } from './containers/side-filters/side-filters.component';
import { FeedActions } from './store';

@Component({
  selector: 'app-pulses-feed',
  imports: [
    ChannelsFilterComponent,
    SideFiltersComponent,
    FeedTabsComponent,
    MobileFilterBarComponent,
    FeedListComponent,
    FavoritePulsesComponent,
  ],
  template: `
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div class="hidden md:block space-y-6 md:col-span-3">
          <app-channels-filter />
          <app-side-filters />
        </div>

        <div class="md:col-span-6">
          <app-feed-tabs class="mb-0 md:mb-6" />
          <app-mobile-filter-bar class="block md:hidden" />
          <app-feed-list />
        </div>

        <div class="hidden md:block md:col-span-3">
          <app-favorite-pulses />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        @apply p-4 sm:p-6 lg:p-8 h-full;
        background-color: var(--mat-sys-surface-container);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulsesFeedComponent {
  private readonly store = inject(Store);
  private readonly userProfileService = inject(UserProfileService);

  constructor() {
    this.store.dispatch(FeedActions.init({ isCurator: this.userProfileService.isCurator() }));
  }
}
