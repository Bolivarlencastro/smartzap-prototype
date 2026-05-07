import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDetailAction } from 'app/main/users/users.types';
import { marker } from '@jsverse/transloco-keys-manager/marker';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-user-footer',
  templateUrl: './user-footer.component.html',
  styles: [
    `
      :host {
        @apply flex items-center w-full gap-2 py-4 px-6 sm:px-12 border-t-1 border-default min-h-[74px];
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, TranslocoPipe],
})
export class UserFooterComponent {
  @Input() submitDisabled: boolean;
  @Input() editing: boolean;
  @Output() userAction = new EventEmitter<UserDetailAction>();

  get cancelButtonLabel() {
    if (this.editing) {
      return marker('GENERAL.CANCEL');
    }

    return marker('GENERAL.CLOSE');
  }

  onDeleteUser() {
    this.userAction.emit('delete');
  }

  onClose() {
    const cancelAction: UserDetailAction = 'close';
    this.userAction.emit(cancelAction);
  }

  onSave() {
    this.userAction.emit('save');
  }
}
