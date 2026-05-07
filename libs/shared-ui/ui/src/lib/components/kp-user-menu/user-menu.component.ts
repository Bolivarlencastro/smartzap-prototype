import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { constants } from '../../constants';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'kp-user-menu',
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, RouterLink, TranslocoPipe],
})
export class UserMenuComponent {
  @Input() user: { name: string; avatar: string } | undefined;
  @Input() workspaceName: string | undefined;
  @Input() isAdmin = false;
  @Input() hasMultipleWorkspaces: boolean;
  @Output() logout = new EventEmitter<void>();
  @Output() profile = new EventEmitter<void>();

  readonly defaultAvatar = constants.defaultUserAvatar;
  @Input() settingsRoute = 'settings';
  @Input() workspacesRoute = 'workspaces';

  logoutClick(): void {
    this.logout.emit();
  }

  profileClick(): void {
    this.profile.emit();
  }
}
