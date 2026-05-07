import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { navigateToPulse } from 'app/shared/services';
import { NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { KpChannelCardComponent, KpChannelCardModel } from '@keeps-platform-frontend-workspace/ui/kp-channel-card';
import { KpPulseCardComponent } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import {
  ChannelsListActions,
  channelsListFeature,
  feedFeature,
  pulsesListFeature,
  PulsesListActions,
  PulseChannelActions,
} from '../../store';
import { PulseCardComponent } from '../../components/pulse-card/pulse-card.component';
import { Pulse } from '../../models/pulse';

@Component({
  selector: 'app-feed-list',
  imports: [
    NgTemplateOutlet,
    MatIconModule,
    TranslocoPipe,
    NgxSkeletonLoaderModule,
    InfiniteScrollDirective,
    PulseCardComponent,
    KpChannelCardComponent,
    KpPulseCardComponent,
  ],
  templateUrl: './feed-list.component.html',
  styles: [
    `
      .feed-list-skeletons,
      .feed-list-items {
        @apply flex flex-col gap-4;
      }

      .feed-list-skeletons--grid,
      .feed-list-items--grid {
        @apply grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4;
      }

      .feed-list-empty {
        @apply flex flex-col items-center justify-center gap-1 p-8 border border-default rounded-xl text-center;
        background-color: var(--mat-sys-surface);

        &__icon-wrapper {
          @apply flex items-center justify-center w-14 h-14 rounded-full mb-2;
          background-color: var(--mat-sys-primary-container);

          mat-icon {
            color: var(--mat-sys-primary);
          }
        }

        &__title {
          @apply text-base font-bold;
        }

        &__description {
          @apply text-sm opacity-75;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedListComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly skeletonItems = [1, 2, 3];

  vm = toSignal(this.store.select(feedFeature.selectFeedListViewModel));
  pulsesVm = toSignal(this.store.select(pulsesListFeature.selectPulsesListViewModel));
  channelsVm = toSignal(this.store.select(channelsListFeature.selectChannelsListViewModel));

  titleKey = computed(() =>
    this.vm()?.selectedTab === 'feed'
      ? 'PULSES_FEED.FEED_LIST.EMPTY_FEED_TITLE'
      : 'PULSES_FEED.FEED_LIST.EMPTY_CHANNELS_TITLE',
  );

  descriptionKey = computed(() =>
    this.vm()?.selectedTab === 'feed'
      ? 'PULSES_FEED.FEED_LIST.EMPTY_FEED_DESCRIPTION'
      : 'PULSES_FEED.FEED_LIST.EMPTY_CHANNELS_DESCRIPTION',
  );

  onOpenPulse(pulse: Pulse): void {
    const { id, is_active } = pulse;

    if (is_active) {
      this.store.dispatch(PulsesListActions.openedFromFeed());
      navigateToPulse(this.router, id);
    }
  }

  onPulsesScroll() {
    this.store.dispatch(PulsesListActions.fetchMorePulses());
  }

  onChannelsScroll() {
    this.store.dispatch(ChannelsListActions.fetchMoreChannels());
  }

  onChannelClick(channelId: string): void {
    this.router.navigate(['/channels/details', channelId]);
  }

  onChannelSubscribe(channel: KpChannelCardModel): void {
    this.store.dispatch(
      ChannelsListActions.toggleSubscription({
        channelId: channel.id,
        subscriptionId: channel.subscription_id || null,
      }),
    );
  }

  onToggleBookmark(pulse: Pulse): void {
    const { id, bookmark_id } = pulse;
    this.store.dispatch(PulseChannelActions.toggleBookmark({ pulseId: id, bookmarkId: bookmark_id || null }));
  }
}
