import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-workspace-dark-switch',
  templateUrl: './workspace-dark-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  styles: [
    `
      .theme-button {
        background-color: var(--mat-sys-surface-container);
        border-style: solid;
        border-color: var(--mat-sys-primary);
      }
    `,
  ],
})
export class WorkspaceDarkSwitchComponent {
  @Input() isDarkTheme: boolean;

  @Output() toggled = new EventEmitter();

  toggleDarkTheme(isDark: boolean) {
    this.toggled.emit(isDark);
  }
}
