import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  model,
  output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'kp-sidenav-item',
  imports: [MatIconButton, MatIcon, MatTooltipModule],
  template: `
    <div class="flex gap-4 min-w-full whitespace-nowrap overflow-hidden">
      <button
        mat-icon-button
        class="item-button"
        [class.active]="active()"
        [disabled]="disabled()"
        [matTooltip]="tooltip()"
        matTooltipPosition="after"
      >
        <mat-icon>{{ icon() }}</mat-icon>
      </button>
      <ng-template>
        <div class="kp-sidenav-item-content w-full overflow-y-auto">
          <ng-content></ng-content>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .item-button.active {
        background-color: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpSidenavItemComponent {
  icon = input('');
  tooltip = input<string>();
  active = model(false);
  disabled = model(false);
  hasContent = input(true, { transform: booleanAttribute });
  activeChange = output<boolean>();
  @ViewChild(TemplateRef, { static: true }) templateRef: TemplateRef<unknown>;

  @HostListener('click')
  toggle(emitEvent = true) {
    if (this.disabled()) {
      return;
    }
    this.active.set(!this.active());
    if (emitEvent) {
      this.activeChange.emit(this.active());
    }
  }
}
