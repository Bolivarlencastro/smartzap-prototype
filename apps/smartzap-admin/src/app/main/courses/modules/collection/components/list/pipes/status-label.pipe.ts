import { Pipe, PipeTransform } from '@angular/core';
import { Course } from '@app/main/courses/model';

@Pipe({ name: 'statusLabel' })
export class StatusLabelPipe implements PipeTransform {
  transform(course: Course): string {
    return `STATUS.${course.is_active ? course.status : 'INACTIVE'}`;
  }
}
