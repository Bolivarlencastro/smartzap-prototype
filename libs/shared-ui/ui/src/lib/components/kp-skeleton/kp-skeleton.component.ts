import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'kp-skeleton',
  imports: [],
  template: ``,
  styles: `
    :host {
      border-radius: 4px;
      will-change: background-position;
      background-image: linear-gradient(90deg, #0000 0% 25%, var(--skeleton-accent) 50%, #0000 75% 100%);
      background-position-x: -50%;
      background-repeat: no-repeat;
      background-size: 200%;
      animation: 1.8s ease-in-out infinite skeleton;
    }

    @keyframes skeleton {
      0% {
        background-position: 150%;
      }

      to {
        background-position: -50%;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpSkeletonComponent {}
