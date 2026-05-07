import { Pipe, PipeTransform } from '@angular/core';
import { LearnContentListItem } from '../models/learn-content-list-item';

@Pipe({
  name: 'hasReachedVacancyLimit',
  standalone: true,
})
export class HasReachedVacancyLimitPipe implements PipeTransform {
  transform(item: LearnContentListItem): boolean {
    const seats = item.meta?.['seats'];
    const enrolledCount = item.meta?.['enrolledCount'];

    if (!seats) {
      return false;
    }

    return enrolledCount >= seats;
  }
}
