import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CustomMenuItem } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMenuApp } from './kp-menu-app';

@Component({
  selector: 'kp-menu',
  template: `
    @if (isButtonVisible) {
      <button
        mat-icon-button
        [matMenuTriggerFor]="keepsMenu"
        [class.user-button-on-navigation]="isNavigationButtonVariant()"
      >
        <div class="flex flex-row justify-center items-center">
          <mat-icon>apps</mat-icon>
        </div>
      </button>
    }

    <mat-menu #keepsMenu="matMenu" [overlapTrigger]="false" xPosition="before">
      @for (app of apps(); track app.id) {
        <a mat-menu-item [href]="getAppHref(app)" target="_blank" class="no-underline font-semibold" rel="noopener">
          <mat-icon>{{ app.icon }}</mat-icon>
          {{ app?.name }}
        </a>
      }
      @for (item of customMenuItems(); track item.id) {
        <a mat-menu-item [href]="item.url" target="_blank" class="no-underline font-semibold" rel="noopener">
          <mat-icon>{{ item.icon }}</mat-icon>
          {{ item.name }}
        </a>
      }
    </mat-menu>
  `,
  styles: [
    `
      .user-button-on-navigation {
        color: var(--kp-on-navigation-container) !important;
      }

      .user-button-on-navigation:hover {
        background: color-mix(in srgb, var(--kp-on-navigation-container) 14%, transparent);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem],
})
export class KpMenuComponent {
  apps = input<KpMenuApp[]>([]);
  workspaceBaseHref = input<string>();
  customMenuItems = input<CustomMenuItem[]>([]);
  buttonVariant = input<'default' | 'on-navigation'>('default');
  readonly isNavigationButtonVariant = computed(() => this.buttonVariant() === 'on-navigation');

  private readonly GAME_UP_ID = '85d8e4b9-9582-4c98-926d-9322e40896db';

  get isButtonVisible(): boolean {
    return !!this.apps()?.length || !!this.customMenuItems()?.length;
  }

  getAppHref(app: KpMenuApp) {
    if (this.workspaceBaseHref() && app.id !== this.GAME_UP_ID) {
      return app.url.concat(this.workspaceBaseHref());
    }
    return app.url;
  }
}
