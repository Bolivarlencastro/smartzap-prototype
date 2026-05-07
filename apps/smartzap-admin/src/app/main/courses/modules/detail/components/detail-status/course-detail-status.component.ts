import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Course } from 'app/main/courses/model';
import { NgTemplateOutlet } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';

@Component({
  selector: 'app-course-detail-status',
  templateUrl: './course-detail-status.component.html',
  styleUrls: ['./course-detail-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [NgTemplateOutlet, MatIcon, MatDivider, TranslocoPipe, KpDurationPipe],
})
export class CourseDetailStatusComponent {
  @Input() course!: Course;
}
