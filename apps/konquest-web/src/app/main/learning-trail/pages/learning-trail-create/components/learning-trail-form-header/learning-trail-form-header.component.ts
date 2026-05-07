import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-learning-trail-form-header',
  imports: [TranslocoModule, TranslocoModule, MatButtonModule],
  template: `<div class="flex-grow">
      <h2 class="text-2xl font-black mb-1">{{ title }}</h2>
      <p>{{ label }}</p>
    </div>
    <div class="flex gap-2">
      @if (!hidePrevious) {
        <button
          type="button"
          mat-stroked-button
          color="primary"
          [disabled]="previousDisabled"
          (click)="onPreviousClick()"
        >
          {{ 'GENERAL.PREVIOUS' | transloco }}
        </button>
      }
      @if (!hideNext) {
        <button mat-flat-button type="submit" color="primary" [disabled]="nextDisabled" (click)="onNextClick()">
          {{ nextButtonLabel | transloco }}
        </button>
      }
    </div>`,
  styles: `
    :host {
      display: flex;
      gap: 8px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningTrailFormHeaderComponent {
  @Input() title!: string;
  @Input() label!: string;
  @Input() previousDisabled!: boolean;
  @Input() nextDisabled!: boolean;
  @Input() hidePrevious = false;
  @Input() hideNext = false;
  @Input() nextButtonLabel = 'MISSION.CREATE.NAVIGATION.SAVE_NEXT';
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onPreviousClick(): void {
    this.previous.emit();
  }

  onNextClick(): void {
    this.next.emit();
  }
}
