import { Pipe, PipeTransform } from '@angular/core';
import { UsersImportDialogViewMode } from 'app/main/users/users.types';
import { marker } from '@jsverse/transloco-keys-manager/marker';

const TITLES_MAP = new Map<UsersImportDialogViewMode, string>([
  ['selectRoles', marker('USERS.ROLES_DIALOG.TITLE.ROLES')],
  ['selectFile', marker('USERS.ROLES_DIALOG.TITLE.FILE')],
]);

@Pipe({
  name: 'usersImportTitle',
  standalone: true,
})
export class UsersImportTitlePipe implements PipeTransform {
  transform(viewMode: UsersImportDialogViewMode): string {
    return TITLES_MAP.get(viewMode);
  }
}
