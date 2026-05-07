import { Pipe, PipeTransform } from '@angular/core';
import { Tracking } from 'app/main/courses/model/tracking';

@Pipe({ name: 'trackingConsume' })
export class TrackingConsumePipe implements PipeTransform {
  transform(value: Tracking): string {
    if (value.learn_duration) {
      return `${Math.round(value.duration / 60)}min`;
    } else if (value.total_questions) {
      return `${value.total_correct_answers}/${value.total_questions}`;
    }
    return '';
  }
}
