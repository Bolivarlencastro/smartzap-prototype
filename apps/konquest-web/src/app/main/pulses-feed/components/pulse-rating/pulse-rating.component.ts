import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface Star {
  icon: string;
  filled: boolean;
  rate: number;
}

@Component({
  selector: 'app-pulse-rating',
  imports: [MatIconModule],
  template: `
    @for (star of stars(); track star.rate) {
      <mat-icon
        class="pulse-rating__star"
        [class.filled]="star.filled"
        [class.half]="star.icon === 'star_half'"
        (mouseenter)="hoverRating.set(star.rate)"
        (mouseleave)="hoverRating.set(0)"
        (click)="rate(star.rate)"
        >{{ star.icon }}</mat-icon
      >
    }
    <span class="pulse-rating__value">{{ averageRating() }}</span>
  `,
  styleUrl: './pulse-rating.component.scss',
  host: { class: 'pulse-rating' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseRatingComponent {
  averageRating = input<number>(0);
  rateChange = output<number>();

  readonly hoverRating = signal(0);

  readonly stars = computed<Star[]>(() => {
    const hover = this.hoverRating();

    if (hover) {
      return [1, 2, 3, 4, 5].map((i) => ({ icon: 'star', filled: i <= hover, rate: i }));
    }

    const avg = this.averageRating();

    return [1, 2, 3, 4, 5].map((i) => {
      if (avg >= i) {
        return { icon: 'star', filled: true, rate: i };
      }

      if (avg > i - 1 && avg < i) {
        return { icon: 'star_half', filled: false, rate: i };
      }

      return { icon: 'star', filled: false, rate: i };
    });
  });

  rate(value: number): void {
    this.rateChange.emit(value);
  }
}
