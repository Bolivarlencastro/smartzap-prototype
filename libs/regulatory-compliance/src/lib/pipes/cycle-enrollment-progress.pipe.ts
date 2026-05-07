import { Pipe, PipeTransform } from '@angular/core';
import { differenceInDays, isBefore } from 'date-fns';
import { EnrollmentCycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';

@Pipe({ name: 'cycleEnrollmentProgress' })
export class CycleEnrollmentProgressPipe implements PipeTransform {
  private readonly currentDate = new Date();

  transform(cycle: EnrollmentCycleDto): number {
    if (!cycle || cycle.status === 'DISABLED') {
      return 0;
    }

    const deadline = new Date(cycle.deadline);
    const renewDate = new Date(cycle.createdDate);
    const isOverdue = isBefore(deadline, this.currentDate);

    if (isOverdue) {
      return 100;
    }

    const durationInDays = differenceInDays(deadline, renewDate);
    const pastDays = differenceInDays(this.currentDate, renewDate);

    return Math.floor((pastDays / durationInDays) * 100);
  }
}
