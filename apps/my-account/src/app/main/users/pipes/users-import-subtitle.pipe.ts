import { Pipe, PipeTransform } from '@angular/core';
import { UsersImportDialogViewMode } from '../users.types';
import { marker } from '@jsverse/transloco-keys-manager/marker';

const SUBTITLES_MAP = new Map<UsersImportDialogViewMode, string>([
  ['selectRoles', marker('USERS.ROLES_DIALOG.SUBTITLE.ROLES')],
  ['selectFile', marker('USERS.ROLES_DIALOG.SUBTITLE.FILE')],
]);

@Pipe({
  name: 'usersImportSubtitle',
  standalone: true,
})
export class UsersImportSubtitlePipe implements PipeTransform {
  transform(viewMode: UsersImportDialogViewMode): string {
    return SUBTITLES_MAP.get(viewMode);
  }
}
