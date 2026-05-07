import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'kp-step-item',
  imports: [MatIcon, TranslocoModule, MatTooltipModule, NgClass],
  template: `
    <div class="flex flex-col h-16 cursor-pointer item" [ngClass]="{ active: active() }">
      <div class="grow flex items-center gap-4 pr-2.5 text-truncate" style="padding-left: 18px" (click)="goToStep()">
        <span class="text-xs text-default">{{ order() }}</span>
        <span
          class="text-sm line-clamp-2 text-default content-description"
          [matTooltip]="name()"
          [matTooltipDisabled]="disabledTooltip"
          >{{ name() }}</span
        >
        @if (completed()) {
          <mat-icon class="s-5 ml-auto mr-2.5">check</mat-icon>
        }
        @if (skippedByUser()) {
          <mat-icon
            class="s-5 ml-auto mr-2.5"
            [matTooltip]="'CLASSROOM.NAVIGATION_PANEL.SKIPPED_CONTENT_INFO' | transloco"
            >info
          </mat-icon>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .item:hover,
      .active {
        background-color: var(--kp-bg-hover) !important;
      }

      .content-description {
        word-break: normal;
        overflow-wrap: break-word;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepItemComponent {
  order = input<number>();
  name = input<string>();
  skippedByUser = input<boolean>();
  go = output<void>();
  active = input<boolean>();
  completed = input<boolean>();
  maxLengthName = 30;

  goToStep() {
    this.go.emit();
  }

  get disabledTooltip(): boolean {
    return this.name()?.length <= this.maxLengthName;
  }
}
