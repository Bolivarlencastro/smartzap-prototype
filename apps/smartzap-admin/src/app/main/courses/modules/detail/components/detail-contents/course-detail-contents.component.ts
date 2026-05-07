import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KeyValuePipe, UpperCasePipe } from '@angular/common';
import { MatBadge } from '@angular/material/badge';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';

@Component({
  selector: 'app-course-detail-contents',
  templateUrl: './course-detail-contents.component.html',
  styleUrls: ['./course-detail-contents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [MatBadge, MatTooltip, MatIcon, UpperCasePipe, KeyValuePipe, TranslocoPipe, KpContentIconName],
})
export class CourseDetailContentsComponent {
  @Input() contents!: Record<string, any>;
}
