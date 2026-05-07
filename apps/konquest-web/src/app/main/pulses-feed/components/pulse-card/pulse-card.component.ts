import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';
import { Store } from '@ngrx/store';
import { formatDistanceToNow } from 'date-fns';
import { navigateToPulse } from 'app/shared/services';
import { Pulse } from '../../models/pulse';
import { PulseChannelActions, PulsesListActions } from '../../store';
import { initDescriptionTruncation } from '../../utils/description-truncation.util';
import { PulseCommentsComponent } from '../pulse-comments/pulse-comments.component';
import { PulseRatingComponent } from '../pulse-rating/pulse-rating.component';

@Component({
  selector: 'app-pulse-card',
  imports: [
    MatIconModule,
    MatIconButton,
    MatButton,
    TranslocoPipe,
    KpCategoryLabelPipe,
    PulseCommentsComponent,
    PulseRatingComponent,
  ],
  templateUrl: './pulse-card.component.html',
  styleUrl: './pulse-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseCardComponent {
  pulse = input.required<Pulse>();

  expanded = signal(false);
  isTruncated = signal(false);
  isBookmarked = computed(() => !!this.pulse()?.bookmark_id);
  isSubscribed = computed(() => !!this.pulse()?.channel_subscription_id);
  relativeTime = computed(() =>
    this.pulse()?.created_date ? formatDistanceToNow(new Date(this.pulse().created_date), { addSuffix: true }) : null,
  );

  private readonly descriptionEl = viewChild<ElementRef<HTMLParagraphElement>>('descriptionEl');
  readonly defaultChannelImage = 'assets/images/channel-default-image.png';
  readonly defaultPulseImage = 'https://assets.keepsdev.com/images/placeholders/v2/pulse.png';

  private readonly store = inject(Store);
  private readonly router = inject(Router);

  constructor() {
    initDescriptionTruncation(this.descriptionEl, this.isTruncated);
  }

  openDetail(): void {
    this.store.dispatch(PulsesListActions.openedFromFeed());
    navigateToPulse(this.router, this.pulse().id);
  }

  navigateToChannel() {
    this.router.navigate(['channels', 'details', this.pulse().channel_id]);
  }

  toggleBookmark(): void {
    const { id, bookmark_id } = this.pulse();
    this.store.dispatch(PulseChannelActions.toggleBookmark({ pulseId: id, bookmarkId: bookmark_id || null }));
  }

  toggleSubscription(): void {
    const { id, channel_id, channel_name, channel_cover_image, channel_subscription_id } = this.pulse();
    this.store.dispatch(
      PulseChannelActions.toggleSubscription({
        pulseId: id,
        channelId: channel_id,
        channelSubscription: channel_subscription_id || null,
        channel: { id: channel_id, name: channel_name, cover_image: channel_cover_image ?? '' },
      }),
    );
  }

  copyLink(): void {
    this.store.dispatch(PulseChannelActions.copyPulseLink({ pulseId: this.pulse().id }));
  }

  setRating(value: number): void {
    this.store.dispatch(PulseChannelActions.ratePulse({ pulseId: this.pulse().id, rating: value }));
  }
}
