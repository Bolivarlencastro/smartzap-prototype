import { Pipe, PipeTransform } from '@angular/core';
import { MissionInformationDate } from '../../mission/mission.model';
import { format } from 'date-fns';

@Pipe({ name: 'dateRange', standalone: true })
export class DateRangePipe implements PipeTransform {
  transform(date: MissionInformationDate): string {
    if (!date) {
      return '';
    }

    const start = format(new Date(date.start_at), 'EEE, P, HH:mm');
    const end = format(new Date(date.end_at), 'HH:mm');
    return `${start} - ${end}`;
  }
}
