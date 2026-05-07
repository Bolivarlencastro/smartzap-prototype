import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FeedActions, feedFeature } from '../../store';

@Component({
  selector: 'app-channels-filter',
  imports: [TranslocoPipe, MatIcon, NgxSkeletonLoaderModule, MatButton],
  templateUrl: './channels-filter.component.html',
  styleUrl: './channels-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelsFilterComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly vm = toSignal(this.store.select(feedFeature.selectChannelsFilterViewModel));

  protected readonly maxItems = 4;
  protected readonly showAllCreatedByMe = signal(false);
  protected readonly showAllSubscribed = signal(false);

  protected readonly visibleCreatedByMe = computed(() => {
    const items = this.vm()?.createdByMe?.items ?? [];
    return this.showAllCreatedByMe() ? items : items.slice(0, this.maxItems);
  });

  protected readonly visibleSubscribed = computed(() => {
    const items = this.vm()?.subscribed?.items ?? [];
    return this.showAllSubscribed() ? items : items.slice(0, this.maxItems);
  });

  protected readonly defaultCoverImage = 'https://assets.keepsdev.com/images/placeholders/v2/pulse.png';

  onSelectFeed() {
    this.store.dispatch(FeedActions.selectChannel({ channelId: null }));
  }

  onSelectChannel(channelId: string) {
    if (this.vm()?.selectedTab === 'channels') {
      this.router.navigate(['/channels/details', channelId]);
    } else {
      this.store.dispatch(FeedActions.selectChannel({ channelId }));
    }
  }

  toggleShowAllCreatedByMe() {
    this.showAllCreatedByMe.update((v) => !v);
  }

  toggleShowAllSubscribed() {
    this.showAllSubscribed.update((v) => !v);
  }
}
