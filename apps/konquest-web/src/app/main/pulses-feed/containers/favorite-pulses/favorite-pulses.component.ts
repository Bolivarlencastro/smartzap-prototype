import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { navigateToPulse } from 'app/shared/services';
import { feedFeature } from '../../store';

@Component({
  selector: 'app-favorite-pulses',
  imports: [TranslocoPipe, MatIcon, NgxSkeletonLoaderModule, MatButton],
  template: `
    @let loading = this.vm()?.loading;
    @let items = this.vm()?.items;

    <div class="flex items-center gap-2">
      <mat-icon class="text-primary s-6">bookmark</mat-icon>
      <span class="text-base font-bold">{{ 'PULSES_FEED.FAVORITE_PULSES.TITLE' | transloco }}</span>
    </div>
    <div class="flex flex-col gap-1">
      @if (loading) {
        @for (i of [0, 1, 2]; track i) {
          <ngx-skeleton-loader
            count="1"
            animation="pulse"
            [theme]="{ height: '3rem', 'border-radius': '0.5rem', 'margin-bottom': '0' }"
          ></ngx-skeleton-loader>
        }
      } @else if (items?.length) {
        @for (item of visibleItems(); track item.id) {
          <div class="item" (click)="onOpenPulse(item.id)">
            <img
              [src]="item?.cover_image || defaultBackgroundImage"
              alt="Pulse Background Image"
              class="w-10 h-10 rounded-md object-cover object-center"
            />
            <span class="truncate text-sm">{{ item?.name }}</span>
          </div>
        }

        @if ((items?.length ?? 0) > maxItems) {
          <button matButton class="toggle-btn" (click)="toggleShowAll()">
            <mat-icon class="s-5">{{ showAll() ? 'expand_less' : 'expand_more' }}</mat-icon>
            <span>
              @if (showAll()) {
                {{ 'PULSES_FEED.SHOW_LESS' | transloco }}
              } @else {
                {{ 'PULSES_FEED.SHOW_ALL' | transloco: { count: items?.length } }}
              }
            </span>
          </button>
        }
      } @else {
        <span class="text-sm opacity-70">{{ 'PULSES_FEED.FAVORITE_PULSES.NO_DATA_MESSAGE' | transloco }}</span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        @apply p-5 border border-default rounded-xl flex flex-col gap-4;
        background-color: var(--mat-sys-surface);
      }

      .item {
        @apply flex items-center gap-3 cursor-pointer p-2 rounded-lg;

        &:hover {
          background-color: color-mix(in srgb, var(--mat-sys-surface-container) 50%, transparent);
        }
      }

      .toggle-btn {
        @apply flex items-center gap-1 text-sm font-medium cursor-pointer self-center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritePulsesComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly vm = toSignal(this.store.select(feedFeature.selectFavoritePulsesViewModel));

  protected readonly maxItems = 4;
  protected readonly showAll = signal(false);

  protected readonly visibleItems = computed(() => {
    const items = this.vm()?.items ?? [];
    return this.showAll() ? items : items.slice(0, this.maxItems);
  });

  protected readonly defaultBackgroundImage = 'https://assets.keepsdev.com/images/placeholders/v2/pulse.png';

  onOpenPulse(pulseId: string): void {
    navigateToPulse(this.router, pulseId);
  }

  toggleShowAll() {
    this.showAll.update((v) => !v);
  }
}
