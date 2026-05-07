import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'kp-global-search-trigger',
  imports: [MatButtonModule, MatIconModule, TranslocoModule],
  template: `
    <button mat-icon-button class="flex sm:hidden ml-auto mt-0.5" (click)="onOpenDialog()">
      <mat-icon>search</mat-icon>
    </button>

    <div class="hidden sm:flex bar h-10 rounded-full items-center px-3 gap-2 mr-2" (click)="onOpenDialog()">
      <mat-icon class="s-7">search</mat-icon>
      <span class="text-sm leading-none line-clamp-2">{{ 'UI.GLOBAL_SEARCH.INPUT_TRIGGER' | transloco }}</span>
    </div>
  `,
  styles: [
    `
      :host {
        flex-grow: 1;
        padding-left: 1rem;
      }

      .bar {
        background-color: var(--mat-sys-surface-container-high);
        transition: box-shadow 0.2s ease;
        cursor: pointer;
      }

      .bar:hover {
        box-shadow: 0 2px 8px var(--mat-sys-surface-dim);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpGlobalSearchTriggerComponent {
  open = output<void>();

  onOpenDialog() {
    this.open.emit();
  }
}
