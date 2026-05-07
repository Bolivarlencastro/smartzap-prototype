import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserSummary } from '../../store/selectors/users.selectors';

@Component({
  selector: 'app-user-side-menu',
  templateUrl: './user-side-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatIcon, MatDivider, TranslocoPipe],
})
export class UserSideMenuComponent {
  summary = input<UserSummary>();
  closeMenu = output();
}
