import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Content } from 'app/main/courses/model';

import { MatIcon } from '@angular/material/icon';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';

@Component({
  selector: 'app-course-timeline',
  templateUrl: './course-timeline.component.html',
  styleUrls: ['./course-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [MatIcon, MatAnchor, RouterLink, MatButton, TranslocoPipe, KpContentIconName],
})
export class CourseTimelineComponent {
  @Input() contents!: Content[];
  @Input() lessonsEntity: any;
  @Output() publish = new EventEmitter<void>();
}
