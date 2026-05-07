import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Contributor } from '@core/model/contributor.model';
import { environment } from 'environments/environment';
import { MatList, MatListItem } from '@angular/material/list';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';

@Component({
  selector: 'app-contributors-list',
  templateUrl: './contributors-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatList, MatListItem, MatIconButton, MatIcon, KpPluralizeTranslatePipe],
})
export class ContributorsListComponent {
  @Input() contributors: Contributor[];
  @Output() removeContributor = new EventEmitter<Contributor>();
  protected readonly defaultUserAvatar = environment.defaultUserAvatar;

  onRemoveContributor(contributor: Contributor) {
    this.removeContributor.emit(contributor);
  }
}
