import { Pipe, PipeTransform } from '@angular/core';
import { DevelopmentStatus, MirroredCourse } from '@keeps-platform-frontend-workspace/kp-keeps';

@Pipe({
  name: 'disallowMirroredCourseDeletion',
  standalone: true,
})
export class DisallowMirroredCourseDeletionPipe implements PipeTransform {
  transform(items: MirroredCourse[]): boolean {
    return items.some((item) => item.status === DevelopmentStatus.PROCESSING);
  }
}
