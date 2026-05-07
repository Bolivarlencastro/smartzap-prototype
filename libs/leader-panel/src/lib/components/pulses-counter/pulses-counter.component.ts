import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

@Component({
  selector: 'lp-pulses-counter',
  imports: [TranslocoPipe, KpPluralizeTranslatePipe],
  template: `
    <span class="text-xs opacity-70">
      {{ count() }} {{ 'LEADER_PANEL.GENERAL.OF' | transloco }} {{ total() }}
      {{ 'LEADER_PANEL.GENERAL.TOTAL_PULSES' | kpPluralizeTranslate: { value: total() } }}
    </span>
    <div class="pulse-progress-bar">
      <div class="fill" [style.width.%]="animatedPercentage()"></div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .pulse-progress-bar {
      width: 84px;
      height: 9px;
      background-color: var(--mat-sys-surface-container-highest);
      border-radius: 5px;
      overflow: hidden;
      flex-shrink: 0;

      .fill {
        height: 100%;
        background-color: var(--mat-sys-primary);
        border-radius: 5px;
        transition: width 0.5s ease-out;
        width: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulsesCounterComponent {
  readonly count = input.required<number>();
  readonly total = input.required<number>();
  readonly realPercentage = computed(() => this.buildPercentage());
  readonly animatedPercentage = signal(0);

  constructor() {
    this.initialConfig();
  }

  private initialConfig() {
    effect(() => {
      const target = this.realPercentage();

      requestAnimationFrame(() => {
        this.animatedPercentage.set(target);
      });
    });
  }

  private buildPercentage() {
    const count = this.count();
    const total = this.total();

    if (!total || total <= 0) {
      return 0;
    }

    const ratio = count / total;

    return Math.round(Math.max(0, Math.min(1, ratio)) * 100);
  }
}
