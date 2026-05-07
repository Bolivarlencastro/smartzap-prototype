import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lp-dialog-learn-content-item',
  imports: [MatIcon],
  template: `
    <mat-icon class="s-6 text-primary">{{ icon() }}</mat-icon>
    <span class="text-sm [word-break:break-word] line-clamp-1">{{ name() }}</span>

    <div class="ml-auto flex items-center gap-3">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        height: 3.25rem;
        padding: 0.7rem;
        gap: 0.75rem;
        background-color: var(--mat-sys-surface-container-low);
        border-radius: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogLearnContentItemComponent {
  name = input<string>();
  learn_content_type = input<string>();
  readonly icon = computed(() => this.getIconFromLearnContentType());

  private getIconFromLearnContentType() {
    const type = this.learn_content_type();

    const ICON_MAP: Record<string, string> = {
      trail: 'route',
      course: 'rocket_launch',
      pulse: 'track_changes',
    };

    return ICON_MAP[type];
  }
}
