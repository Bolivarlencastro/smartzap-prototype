import { Pipe, PipeTransform } from '@angular/core';
import { Course } from '@app/main/courses/model';

@Pipe({ name: 'statusColor' })
export class StatusColorPipe implements PipeTransform {
  transform(course: Course): string {
    if (!course.is_active) {
      return '#b5b5b5';
    }

    switch (course.status) {
      case 'FINISHED':
        return '#01d89b';
      case 'REVIEWING':
        return '#ff9706';
      case 'PROCESSING':
        return '#e1b258';
      case 'CREATING':
        return '#ff7152';
      case 'DELETING':
        return '#000000';
      default:
        return undefined;
    }
  }
}
