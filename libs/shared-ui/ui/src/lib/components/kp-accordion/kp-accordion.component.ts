import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { KpSpinnerCircleComponent } from '../kp-spinner-circle';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'kp-accordion',
  imports: [CommonModule, MatExpansionModule, KpSpinnerCircleComponent, MatIcon, MatIconButton, MatTooltipModule],
  styles: [
    `
      .order {
        font-size: 12px;
      }

      .description {
        font-size: 14px;
      }

      :host {
        --mat-expansion-header-collapsed-state-height: 64px;
      }

      .step:hover,
      .active {
        background-color: var(--kp-bg-hover) !important;
      }
    `,
  ],
  templateUrl: './kp-accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpAccordionComponent {
  title = input<string>();
  order = input<number>();
  progress = input<number>();
  hasChildren = input<boolean>();
  subjectStep = output<void>();
  active = input<boolean>();
  maxLengthTitle = 30;

  protected panelOpenState = signal(true);

  get disabledTooltip(): boolean {
    return this.title()?.length <= this.maxLengthTitle;
  }

  get arrowIcon(): string {
    return this.panelOpenState() ? 'keyboard_control_key' : 'keyboard_arrow_down';
  }

  goToSubjectStep(event: PointerEvent) {
    event.stopPropagation();
    this.subjectStep.emit();
  }

  setPanelOpenState(event: PointerEvent) {
    event.stopPropagation();
    this.panelOpenState.set(!this.panelOpenState());
  }
}
