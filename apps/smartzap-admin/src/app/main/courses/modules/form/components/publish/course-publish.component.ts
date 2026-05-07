import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Component({
  selector: 'app-course-publish',
  templateUrl: './course-publish.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton, TranslocoPipe],
  styles: [
    `
      .status-tag {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `,
  ],
})
export class CoursePublishComponent {
  courseStatus = input<string>();
  publish = output<void>();

  private static readonly STATUS_COLORS: Record<string, string> = {
    CREATING: '#9E9E9E',
    PROCESSING: '#FF9800',
    REVIEWING: '#FFC107',
    FINISHED: '#4CAF50',
  };

  private static readonly STATUS_TITLES: Record<string, string> = {
    CREATING: marker('COURSE.FORM.FINISH.TITLE.CREATING'),
    PROCESSING: marker('COURSE.FORM.FINISH.TITLE.PROCESSING'),
    REVIEWING: marker('COURSE.FORM.FINISH.TITLE.REVIEWING'),
    FINISHED: marker('COURSE.FORM.FINISH.TITLE.FINISHED'),
  };

  private static readonly STATUS_MESSAGES: Record<string, string> = {
    CREATING: marker('COURSE.FORM.FINISH.MESSAGE.DEFAULT'),
    PROCESSING: marker('COURSE.FORM.FINISH.MESSAGE.DEFAULT'),
    REVIEWING: marker('COURSE.FORM.FINISH.MESSAGE.DEFAULT'),
    FINISHED: marker('COURSE.FORM.FINISH.MESSAGE.DEFAULT'),
  };

  get statusColor(): string {
    return CoursePublishComponent.STATUS_COLORS[this.courseStatus()] ?? '#9E9E9E';
  }

  get title(): string {
    return CoursePublishComponent.STATUS_TITLES[this.courseStatus()] ?? marker('COURSE.FORM.FINISH.TITLE.CREATING');
  }

  get message(): string {
    return CoursePublishComponent.STATUS_MESSAGES[this.courseStatus()] ?? marker('COURSE.FORM.FINISH.MESSAGE.DEFAULT');
  }

  get statusLabel(): string {
    return `STATUS.${this.courseStatus()}`;
  }
}
