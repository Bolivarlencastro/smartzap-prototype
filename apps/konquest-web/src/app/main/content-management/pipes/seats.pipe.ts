import { Pipe, PipeTransform } from '@angular/core';
import { LearnContentListItem } from '../models/learn-content-list-item';

@Pipe({
  name: 'seats',
  standalone: true,
})
export class SeatsPipe implements PipeTransform {
  transform(item: LearnContentListItem): string {
    const seats = item.meta?.['seats'];
    const enrolledCount = item.meta?.['enrolledCount'];

    if (seats) {
      return `${enrolledCount} / ${seats}`;
    }

    return enrolledCount;
  }
}
