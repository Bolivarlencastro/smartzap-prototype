import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { ChangeDetectionStrategy, Component, input, OnChanges, OnDestroy, Signal, SimpleChanges } from '@angular/core';
import {
  KpLearnContentCardComponent,
  LearnContentCardData,
} from '@keeps-platform-frontend-workspace/ui/kp-learn-content-card';
import { LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';
import { Store } from '@ngrx/store';
import { SectionContentItemEvent } from 'app/main/section-contents/models/section-content-item-event';
import { sectionContentsFeature } from 'app/main/section-contents/store/section-contents.feature';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { map, Observable } from 'rxjs';
import { SectionContentViewModel } from '../models/section-content-view-model';
import { SectionContentActions, SectionContentItemActions } from '../store/actions';
import { SectionContentsHeaderComponent } from './section-contents-header.component';
import { TranslocoModule } from '@jsverse/transloco';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-section-contents',
  imports: [
    SectionContentsHeaderComponent,
    KpLearnContentCardComponent,
    InfiniteScrollDirective,
    NgxSkeletonLoaderModule,
    TranslocoModule,
    AsyncPipe,
    NgClass,
  ],
  template: `
    @let isMobile = isMobile$ | async;

    <div
      class="flex-1"
      infiniteScroll
      [infiniteScrollDistance]="2"
      [infiniteScrollThrottle]="1000"
      [infiniteScrollDisabled]="!vm()?.contents?.length"
      [scrollWindow]="true"
      (scrolled)="onScroll()"
    >
      <app-section-content-header
        [filterType]="vm()?.filterType"
        [loading]="vm()?.loading"
      ></app-section-content-header>
      <div class="max-w-[1328px] mx-auto p-0 xxs:p-6 sm:py-24 sm:pt-10 pb-14 pt-4">
        <div [ngClass]="vm()?.gridClass">
          @for (content of vm()?.contents; track content.contentId) {
            <kp-learn-content-card
              [learnContent]="content"
              [actions]="content.actions"
              [orientation]="vm()?.orientation"
              (cardAction)="onAction($event, content)"
              (click)="onAction('details', content)"
            ></kp-learn-content-card>
          }

          @if (vm()?.contentType && vm()?.loading) {
            @for (index of [0, 1, 2, 3, 4, 5]; track index) {
              <ngx-skeleton-loader
                count="1"
                animation="pulse"
                class="px-1"
                [theme]="isMobile ? vm()?.mobileLoaderTheme : vm()?.webLoaderTheme"
              ></ngx-skeleton-loader>
            }
          }
        </div>
        @if (!vm()?.contents?.length && !vm()?.loading) {
          <div class="text-center">{{ 'HOME.EMPTY_MESSAGES.NO_CONTENTS' | transloco }}</div>
        }
      </div>
    </div>
  `,
  styles: `
    .trails-grid {
      @apply grid gap-4 grid-cols-1 min-[870px]:grid-cols-2 min-[1390px]:grid-cols-3 justify-items-center;
    }

    .courses-grid {
      @apply grid gap-4 grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionContentsComponent implements OnChanges, OnDestroy {
  readonly sectionId = input<string>();
  readonly vm: Signal<SectionContentViewModel>;
  isMobile$: Observable<boolean>;

  constructor(
    private readonly store: Store,
    private readonly breakpointObserver: BreakpointObserver,
  ) {
    this.vm = toSignal(this.store.select(sectionContentsFeature.selectViewModel));

    this.isMobile$ = this.breakpointObserver
      .observe([`(max-width: ${constants.defaultMobileWidth})`])
      .pipe(map((result) => result.matches));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sectionId']) {
      this.init(this.sectionId());
    }
  }

  ngOnDestroy() {
    this.store.dispatch(SectionContentActions.resetState());
  }

  onAction(action: LearnContentCardActionId, content: LearnContentCardData) {
    const event: SectionContentItemEvent = { item: content, contentType: this.vm()?.contentType, action };
    this.store.dispatch(SectionContentItemActions.executeAction({ event }));
  }

  onScroll() {
    this.store.dispatch(SectionContentActions.loadMoreSectionContents());
  }

  private init(sectionId: string) {
    if (!sectionId) {
      return;
    }

    this.store.dispatch(SectionContentActions.init({ sectionId }));
  }
}
