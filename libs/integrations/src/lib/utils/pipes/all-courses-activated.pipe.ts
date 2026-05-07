import { Pipe, PipeTransform } from '@angular/core';
import { MirroredCourse } from '@keeps-platform-frontend-workspace/kp-keeps';

@Pipe({
  name: 'allCoursesActivated',
  standalone: true,
})
export class AllCoursesActivatedPipe implements PipeTransform {
  transform(items: MirroredCourse[]): boolean {
    return items.every((item) => item.isActive);
  }
}
