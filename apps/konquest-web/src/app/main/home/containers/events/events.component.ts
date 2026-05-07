import { ChangeDetectionStrategy, Component, input, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AllMissionsComponent } from '@app/main/mission/pages/missions/components';
import { LearnContentActions } from '@app/shared/store';
import { LearnContentActionData } from '@keeps-platform-frontend-workspace/ui/models';
import { Store } from '@ngrx/store';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { EventsViewModel } from '../../models/events';
import { EventsActions } from '../../store/actions';
import { eventsFeature } from '../../store/features';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-events',
  imports: [InfiniteScrollDirective, AllMissionsComponent, MatIconModule, TranslocoModule],
  template: `
    <div
      class="flex-1"
      infiniteScroll
      [infiniteScrollDistance]="2"
      [infiniteScrollThrottle]="1000"
      [scrollWindow]="true"
      (scrolled)="onScroll()"
    >
      @if (vm()?.loading || vm()?.events?.length) {
        <div class="max-w-[1328px] mx-auto p-0 xxs:px-6 xxs:pb-6 pb-14">
          <kp-all-missions
            [missions]="vm()?.events"
            [isLoading]="vm()?.loading"
            [isMobile]="isMobile()"
            (cardAction)="onLearnContentAction($event)"
          ></kp-all-missions>
        </div>
      }

      @if (!vm()?.events?.length && !vm()?.loading) {
        <div class="flex flex-col justify-center items-center opacity-75 mt-5 mb-20">
          <mat-icon class="icon">event</mat-icon>
          <div class="text-base text-center font-bold">{{ 'HOME.EMPTY_STATE.SECTION.EVENTS.TITLE' | transloco }}</div>
          <div class="text-sm text-center">{{ 'HOME.EMPTY_STATE.SECTION.EVENTS.DESCRIPTION' | transloco }}</div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .icon {
        @apply mb-2;

        font-size: 48px;
        width: 48px;
        height: 48px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent implements OnDestroy {
  isMobile = input<boolean>();
  vm: Signal<EventsViewModel>;

  constructor(private readonly store: Store) {
    this.vm = toSignal(store.select(eventsFeature.selectEventsViewModel));
  }

  ngOnDestroy(): void {
    this.store.dispatch(EventsActions.reset());
  }

  onScroll() {
    this.store.dispatch(EventsActions.loadMoreEvents());
  }

  onLearnContentAction(learnContentAction: LearnContentActionData) {
    this.store.dispatch(LearnContentActions.learnContentAction({ learnContentAction }));
  }
}
