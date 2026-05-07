import { ChangeDetectionStrategy, Component, computed, input, output, ViewChild } from '@angular/core';

import { KpCountdown, KpCountdownDirective } from '@keeps-platform-frontend-workspace/ui/kp-countdown';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatTooltip } from '@angular/material/tooltip';
import { KpCountdownContainerComponent } from '@keeps-platform-frontend-workspace/ui/kp-countdown-container';

@Component({
  selector: 'kp-header-nav',
  imports: [MatIconButton, MatIcon, TranslocoPipe, MatTooltip, KpCountdownContainerComponent, KpCountdownDirective],
  template: `
    <button
      data-test="previus-step-button"
      mat-icon-button
      [disabled]="previousStepDisabled()"
      (click)="previousStep()"
      [matTooltip]="'CLASSROOM.HEADER_NAV.RETURN' | transloco"
    >
      <mat-icon>arrow_back</mat-icon>
    </button>

    <span class="text-xs text-nowrap">
      {{ currentStepIndex() }}&nbsp;{{ 'CLASSROOM.HEADER_NAV.OF' | transloco }}&nbsp;{{ totalSteps() }}
    </span>

    <kp-countdown-container
      #countDownContainer
      *kpCountdown="countdown(); let progress; let seconds = timer"
      [count]="seconds"
      [progress]="progress"
    >
      <button
        data-test="next-step-button"
        mat-icon-button
        [disabled]="nextStepDisabled()"
        (click)="nextStep()"
        [matTooltip]="'CLASSROOM.HEADER_NAV.FORWARD' | transloco"
      >
        <mat-icon>arrow_forward</mat-icon>
      </button>
    </kp-countdown-container>
  `,
  styles: `
    :host {
      display: flex;
      gap: 4px;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavComponent {
  @ViewChild('countDownContainer') countDownContainer: KpCountdownContainerComponent;
  totalSteps = input<number>(0);
  currentStepIndex = input<number>(0);
  disableNext = input<boolean>(false);
  countdown = input<KpCountdown>();
  previousStepDisabled = computed(() => {
    return this.currentStepIndex() <= 1;
  });

  nextStepDisabled = computed(() => {
    return this.currentStepIndex() === this.totalSteps() || this.disableNext();
  });

  next = output<void>();
  previous = output<void>();

  get countdownFinished() {
    return this.countDownContainer?.finished;
  }

  nextStep() {
    this.next.emit();
  }

  previousStep() {
    this.previous.emit();
  }
}
