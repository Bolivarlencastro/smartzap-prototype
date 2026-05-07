import { Pipe, PipeTransform } from '@angular/core';
import { Tracking } from 'app/main/courses/model/tracking';

@Pipe({ name: 'trackingPercentage' })
export class TrackingPercentagePipe implements PipeTransform {
  transform(value: Tracking): number | undefined {
    if (value.learn_duration) {
      return value.duration / value.learn_duration;
    } else if (value.total_questions) {
      return value.total_correct_answers / value.total_questions;
    } else return undefined;
  }
}
