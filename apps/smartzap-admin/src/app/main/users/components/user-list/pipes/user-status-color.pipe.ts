import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userStatusColor',
  standalone: true,
})
export class UserStatusColorPipe implements PipeTransform {
  transform(syncCheck?: string | null): string {
    return syncCheck ? '#FF800B' : '#47AB0A';
  }
}
