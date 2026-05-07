import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'kp-course-badget',
  standalone: true,
  template: `
    <div class="badget flex flex-row items-center mb-6">
      <img class="badget__image mr-8" [src]="src()" [alt]="alt()" />
      <div class="flex flex-col justify-center">
        <div class="badget__title text-sm">
          {{ title() }}
        </div>
        <div class="badget__subtitle text-base">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .badget {
        margin-bottom: 10px;

        &__image {
          width: 60px;
          height: 61px;
          margin-bottom: 8px;
        }
        &__title {
          color: #989797;
          font-size: 1.2rem;
          margin-bottom: 0;
        }
        &__subtitle {
          color: #606060;
          font-size: 1.3rem;
          font-weight: bold;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseBadgetComponent {
  src = input<string>();
  alt = input<string>();
  title = input<string>();
}
