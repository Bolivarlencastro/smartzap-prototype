import { Pipe, PipeTransform } from '@angular/core';
import { differenceInDays } from 'date-fns';

@Pipe({
  name: 'kpDaysUntil',
  standalone: true,
})
export class KpDaysUntil implements PipeTransform {
  private readonly currentDate = new Date();

  transform(date?: string | undefined): number {
    if (!date) {
      return 0;
    }

    const startDate = new Date(date);
    return Math.max(differenceInDays(startDate, this.currentDate) + 1, 0);
  }
}
