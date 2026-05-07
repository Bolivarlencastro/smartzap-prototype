import { Pipe, PipeTransform } from '@angular/core';
import { format, isSameDay } from 'date-fns';
import { LedEventItem } from '../models/led-event-item';

@Pipe({
  name: 'eventDateRange',
})
export class EventDateRangePipe implements PipeTransform {
  transform(item: LedEventItem, separator: string): string {
    const startDate = new Date(item.start_date);
    const endDate = new Date(item.end_date);

    if (isSameDay(startDate, endDate)) {
      return format(startDate, 'P');
    }

    const start = format(startDate, 'dd');
    const end = format(endDate, 'P');

    return `${start} ${separator} ${end}`;
  }
}
