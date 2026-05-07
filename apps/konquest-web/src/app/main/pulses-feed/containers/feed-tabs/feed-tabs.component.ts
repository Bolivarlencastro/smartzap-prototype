import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { TranslocoPipe } from '@jsverse/transloco';
import { FeedActions, feedFeature } from '../../store';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-feed-tabs',
  imports: [MatIcon, MatIconButton, TranslocoPipe, MatDividerModule],
  template: `
    @let tab = selectedTab();
    @let layout = feedLayout();

    <div class="tab-container">
      <div class="flex items-center gap-1">
        <button class="feed-tab" [class.active]="tab === 'feed'" (click)="onSelectTab('feed')">
          <mat-icon>dynamic_feed</mat-icon>
          <span>{{ 'PULSES_FEED.TABS.FEED' | transloco }}</span>
        </button>

        <button class="feed-tab" [class.active]="tab === 'channels'" (click)="onSelectTab('channels')">
          <mat-icon>hub</mat-icon>
          <span>{{ 'PULSES_FEED.TABS.CHANNELS' | transloco }}</span>
        </button>
      </div>

      <mat-divider [vertical]="true" class="ml-auto h-12"></mat-divider>

      <div class="flex items-center gap-2">
        <button
          mat-icon-button
          class="layout-btn"
          [class.active]="layout === 'list'"
          [disabled]="tab !== 'feed'"
          (click)="onSelectLayout('list')"
        >
          <mat-icon class="s-6">view_day</mat-icon>
        </button>

        <button
          mat-icon-button
          class="layout-btn"
          [class.active]="layout === 'grid'"
          [disabled]="tab !== 'feed'"
          (click)="onSelectLayout('grid')"
        >
          <mat-icon class="s-6">grid_view</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .tab-container {
        @apply flex items-center gap-2 rounded-lg p-2 h-14;
        background-color: var(--mat-sys-surface-container-highest);
      }

      .feed-tab {
        @apply flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold;
        background: transparent;
        border: none;
        cursor: pointer;
        opacity: 0.75;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &.active {
          @apply shadow-sm;
          background: var(--mat-sys-surface);
          color: var(--mat-sys-primary);
          opacity: 1;

          mat-icon {
            color: var(--mat-sys-primary);
          }
        }

        &:hover:not(.active) {
          opacity: 1;
          background: var(--mat-sys-surface-container-high);
        }
      }

      .layout-btn {
        color: var(--mat-sys-on-surface-variant);

        &.active {
          color: var(--mat-sys-primary);
        }

        &:disabled {
          opacity: 0.38;
        }
      }

      .border-outline {
        border-color: var(--mat-sys-outline-variant);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedTabsComponent {
  private readonly store = inject(Store);

  protected readonly selectedTab = toSignal(this.store.select(feedFeature.selectSelectedTab));
  protected readonly feedLayout = toSignal(this.store.select(feedFeature.selectFeedLayout));

  onSelectTab(tab: 'feed' | 'channels') {
    this.store.dispatch(FeedActions.setTab({ tab }));
  }

  onSelectLayout(layout: 'list' | 'grid') {
    this.store.dispatch(FeedActions.setFeedLayout({ layout }));
  }
}
