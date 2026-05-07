import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  Inject,
  OnDestroy,
  Renderer2,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuTrigger } from '@angular/material/menu';
import { PulseService } from '@core/api';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';
import { RouteDetailDialogWrapper } from '@keeps-platform-frontend-workspace/ui/kp-route-detail-dialog-wrapper';
import { Store } from '@ngrx/store';
import { KpViewerKonquestComponent } from 'app/shared/components/kp-components/kp-viewers/kp-viewer/kp-viewer-konquest.component';
import { formatDistanceToNow } from 'date-fns';
import { map } from 'rxjs';
import { PulseDetailsCommentsComponent } from '../../components/pulse-details-comments/pulse-details-comments.component';
import { PulseFeedQuizComponent } from '../../components/pulse-feed-quiz/pulse-feed-quiz.component';
import { PulseRatingComponent } from '../../components/pulse-rating/pulse-rating.component';
import { PulseDetailsApiComment } from '../../models/pulse-details';
import { PulseChannelActions, PulseDetailsActions } from '../../store';
import { pulseDetailsFeature } from '../../store/pulse-details/pulse-details.feature';
import { pulsesListFeature } from '../../store/pulses-list/pulses-list.feature';
import { initDescriptionTruncation } from '../../utils/description-truncation.util';
import { initEmojiPicker } from '../../utils/emoji-picker.util';

@Component({
  selector: 'app-pulse-details',
  imports: [
    FormsModule,
    MatDialogClose,
    MatIconModule,
    MatIconButton,
    MatButton,
    MatMenu,
    MatMenuContent,
    MatMenuTrigger,
    TranslocoPipe,
    KpCategoryLabelPipe,
    KpViewerKonquestComponent,
    PulseRatingComponent,
    PulseFeedQuizComponent,
    PulseDetailsCommentsComponent,
  ],
  templateUrl: './pulse-details.component.html',
  styleUrl: './pulse-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseDetailsComponent extends RouteDetailDialogWrapper<PulseDetailsComponent> implements OnDestroy {
  private readonly store = inject(Store);
  private readonly userProfileService = inject(UserProfileService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly pulseService = inject(PulseService);

  // Store selectors
  readonly pulse = toSignal(this.store.select(pulseDetailsFeature.selectPulse));
  readonly comments = toSignal(this.store.select(pulseDetailsFeature.selectComments), { initialValue: [] });
  readonly channel = toSignal(this.store.select(pulseDetailsFeature.selectChannel));
  readonly loading = toSignal(this.store.select(pulseDetailsFeature.selectLoading), { initialValue: false });
  readonly content = toSignal(this.store.select(pulseDetailsFeature.selectContent));
  private readonly pulseId = this.store.selectSignal(pulseDetailsFeature.selectPulseId);
  private readonly pulsesList = this.store.selectSignal(pulsesListFeature.selectAll);

  // User
  readonly currentUser = toSignal(this.userProfileService.profile$);

  // Responsive
  readonly isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).pipe(map((s) => s.matches)),
    { initialValue: this.breakpointObserver.isMatched([Breakpoints.Handset, Breakpoints.TabletPortrait]) },
  );

  // View refs
  readonly descriptionEl = viewChild<ElementRef<HTMLParagraphElement>>('descriptionEl');
  readonly emojiPickerContainer = viewChild<ElementRef<HTMLDivElement>>('emojiPickerContainer');

  // Presentation signals
  readonly infoOpen = signal(true);
  readonly expanded = signal(false);
  readonly isTruncated = signal(false);
  readonly commentText = signal('');

  // Computed
  readonly hasNavigation = this.store.selectSignal(pulsesListFeature.selectOpenedFromFeed);
  readonly currentIndex = computed(() => this.pulsesList().findIndex((p) => p.id === this.pulseId()));
  readonly hasPrev = computed(() => this.currentIndex() > 0);
  readonly hasNext = computed(() => {
    const idx = this.currentIndex();
    return idx !== -1 && idx < this.pulsesList().length - 1;
  });

  readonly maxChars = 500;
  readonly charCount = computed(() => this.commentText().length);
  readonly isOverLimit = computed(() => this.charCount() > this.maxChars);
  readonly canPublish = computed(() => this.commentText().trim().length > 0 && !this.isOverLimit());
  readonly contentUrl = computed(() => this.content()?.url ?? '');
  readonly contentType = computed(() => this.content()?.content_type?.name);
  readonly disableActivityEvents = computed(
    () =>
      !!this.channel()?.is_owner ||
      !!this.channel()?.is_contributor ||
      this.pulse()?.user_creator?.id === this.currentUser()?.id,
  );
  readonly isQuiz = computed(() => this.pulseService.isQuiz(this.pulse()?.pulse_type?.id ?? ''));
  readonly isBookmarked = computed(() => !!this.pulse()?.bookmark_id);
  readonly isSubscribed = computed(() => !!this.channel()?.subscription);
  readonly relativeTime = computed(() =>
    this.pulse()?.created_date ? formatDistanceToNow(new Date(this.pulse()!.created_date), { addSuffix: true }) : null,
  );

  // Layout computed classes
  readonly outerClass = computed(() =>
    this.isMobile()
      ? 'grid grid-cols-1 grid-rows-2 overflow-hidden h-[100vh] w-[100vw]'
      : 'grid grid-rows-1 grid-cols-12 overflow-hidden rounded-2xl h-[90vh] w-[85vw]',
  );
  readonly contentAreaClass = computed(() => {
    if (this.isQuiz()) {
      return this.isMobile() ? 'row-span-2 flex flex-col' : 'col-span-12 flex flex-col';
    }
    if (this.isMobile()) {
      return this.infoOpen() ? 'row-span-1 flex flex-col' : 'row-span-2 flex flex-col';
    }
    return this.infoOpen() ? 'col-span-8 bg-black' : 'col-span-12 bg-black';
  });
  readonly infoPanelClass = computed(() =>
    this.isMobile()
      ? 'row-span-1 flex flex-col h-full overflow-hidden bg-[var(--mat-sys-surface)]'
      : 'col-span-4 flex flex-col h-full overflow-hidden bg-[var(--mat-sys-surface)]',
  );

  // Constants
  readonly defaultChannelImage = 'assets/images/channel-default-image.png';

  constructor(
    @Inject(DOCUMENT) protected override _document: Document,
    protected override _renderer2: Renderer2,
    protected override dialogRef: MatDialogRef<PulseDetailsComponent>,
  ) {
    super(_document, _renderer2, dialogRef);
    initDescriptionTruncation(this.descriptionEl, this.isTruncated);
    initEmojiPicker(this.emojiPickerContainer, (emoji) => {
      if (this.charCount() < this.maxChars) {
        this.commentText.update((t) => t + emoji);
      }
    });
  }

  navigatePrev(): void {
    const idx = this.currentIndex();
    if (idx <= 0) return;
    this.store.dispatch(PulseDetailsActions.openPulseDetails({ pulseId: this.pulsesList()[idx - 1].id }));
  }

  navigateNext(): void {
    const list = this.pulsesList();
    const idx = this.currentIndex();
    if (idx === -1 || idx >= list.length - 1) return;
    this.store.dispatch(PulseDetailsActions.openPulseDetails({ pulseId: list[idx + 1].id }));
  }

  publish(): void {
    const text = this.commentText().trim();
    if (!text) return;

    const user = this.currentUser();
    const displayComment: PulseDetailsApiComment = {
      id: `c-${Date.now()}`,
      comment: text,
      pulse: null,
      user: { id: user?.id ?? '', name: user?.name ?? '', avatar: user?.avatar ?? '' } as any,
      created_date: new Date().toISOString(),
    };

    this.store.dispatch(PulseDetailsActions.submitComment({ text, displayComment }));
    this.commentText.set('');
  }

  toggleInfo() {
    this.infoOpen.update((open) => !open);
  }

  setRating(value: number) {
    const pulseId = this.pulseId();
    if (!pulseId) return;
    this.store.dispatch(PulseChannelActions.ratePulse({ pulseId, rating: value }));
  }

  toggleBookmark() {
    const pulse = this.pulse();
    if (!pulse) return;
    this.store.dispatch(
      PulseChannelActions.toggleBookmark({ pulseId: pulse.id, bookmarkId: pulse.bookmark_id ?? null }),
    );
  }

  toggleSubscription() {
    const pulse = this.pulse();
    if (!pulse) return;

    const channelId = pulse.channels?.[0]?.id;
    if (!channelId) return;

    this.store.dispatch(
      PulseChannelActions.toggleSubscription({
        pulseId: this.pulseId(),
        channelId,
        channelSubscription: this.channel()?.subscription?.id ?? null,
        channel: {
          id: channelId,
          name: this.channel()?.name ?? '',
          cover_image: this.channel()?.holder_image ?? '',
        },
      }),
    );
  }

  copyLink() {
    const pulse = this.pulse();
    if (!pulse) return;
    this.store.dispatch(PulseChannelActions.copyPulseLink({ pulseId: pulse.id }));
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.store.dispatch(PulseDetailsActions.dialogDestroy());
  }
}
