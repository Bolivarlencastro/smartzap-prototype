import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userStatusLabel',
  standalone: true,
})
export class UserStatusLabelPipe implements PipeTransform {
  transform(syncCheck?: string | null): string {
    return syncCheck ? 'USERS.STATUS.NOT_SYNCED' : 'USERS.STATUS.SYNCED';
  }
}
