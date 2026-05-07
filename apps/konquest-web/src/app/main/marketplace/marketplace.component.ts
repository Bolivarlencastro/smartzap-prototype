import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { MARKETPLACE_CARDS } from './models';

@Component({
  selector: 'app-marketplace',
  imports: [TranslocoModule, MatButtonModule, MatIconModule],
  template: `
    <div class="text-2xl mb-3">Marketplace</div>

    @for (card of cards; track card.title) {
      <div class="card">
        <img [src]="card.image" class="card-img" />
        <div class="h-full flex flex-col">
          <div class="text-2xl mb-3">{{ card.title }}</div>
          <div class="text-sm line-clamp-[12]">{{ card.description | transloco }}</div>
          <div class="mt-auto flex gap-2">
            <button mat-flat-button color="primary" [disabled]="!card.hireLink" (click)="openLink(card.hireLink)">
              {{ 'MARKETPLACE.BUTTON.HIRE' | transloco }}
            </button>

            <button mat-stroked-button color="primary" [disabled]="!card.site" (click)="openLink(card.site)">
              {{ 'MARKETPLACE.BUTTON.SITE' | transloco }}
            </button>

            <button
              mat-button
              class="ml-auto text-primary flex gap-1"
              [disabled]="!card.catalog"
              (click)="openLink(card.catalog)"
            >
              <mat-icon>download</mat-icon>
              <span>{{ 'MARKETPLACE.BUTTON.CATALOG' | transloco }}</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .card {
        @apply h-96 w-[900px] border-1 border-default rounded-xl flex p-5 gap-5;
      }

      .card-img {
        @apply h-full w-auto rounded-xl;
      }

      @media (max-width: 1080px) {
        .card-img {
          @apply h-20 w-auto rounded-xl;
        }

        .card {
          @apply w-auto max-w-[900px];
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketplaceComponent {
  protected cards = MARKETPLACE_CARDS;

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
