import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UsersImportDialogViewMode } from 'app/main/users/users.types';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

const SAVE_BUTTON_LABEL = marker('GENERAL.SAVE');
const NEXT_BUTTON_LABEL = marker('GENERAL.NEXT');

@Component({
  selector: 'app-user-roles-footer',
  templateUrl: './user-roles-footer.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogActions, MatSlideToggle, MatTooltip, MatButton, MatDialogClose, TranslocoPipe],
})
export class UserRolesFooterComponent {
  @Input() viewMode: UsersImportDialogViewMode;
  @Input() positiveButtonDisabled: boolean;
  @Input() showTemporaryPasswordToggle: boolean;
  @Output() saveRoles = new EventEmitter<void>();
  @Output() setImportFile = new EventEmitter<void>();

  protected readonly EXAMPLE_IMPORT_FILE_URL =
    'https://assets.keepsdev.com/files/my-account/cadastrar-ou-atualizar-usuarios.xlsx';

  @ViewChild('temporaryPasswordToggle') temporaryPasswordToggle: MatSlideToggle;

  private readonly labelsMap = new Map<UsersImportDialogViewMode, string>([
    ['selectRoles', SAVE_BUTTON_LABEL],
    ['selectFile', NEXT_BUTTON_LABEL],
  ]);

  private readonly eventsMap = new Map<UsersImportDialogViewMode, EventEmitter<void>>([
    ['selectRoles', this.saveRoles],
    ['selectFile', this.setImportFile],
  ]);

  get buttonLabel() {
    return this.labelsMap.get(this.viewMode) || '';
  }

  get temporaryPassword() {
    return this.temporaryPasswordToggle?.checked;
  }

  positiveButtonClick() {
    this.eventsMap.get(this.viewMode)?.emit();
  }
}
