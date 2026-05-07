import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from 'app/main/courses/model';
import { environment } from 'environments/environment';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { StatusColorPipe } from '../../../collection/components/list/pipes/status-color.pipe';
import { StatusLabelPipe } from '../../../collection/components/list/pipes/status-label.pipe';

@Component({
  selector: 'app-course-detail-header',
  templateUrl: './course-detail-header.component.html',
  styleUrls: ['./course-detail-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [TranslocoPipe, MatIconButton, MatIcon, KpCardTagComponent, StatusColorPipe, StatusLabelPipe],
})
export class CourseDetailHeaderComponent {
  @Input() course!: Course;
  @Input() showCloseButton = false;
  @Output() closeClick = new EventEmitter<void>();
  readonly defaultUserAvatar = environment.defaultUserAvatar;

  handleClose(): void {
    this.closeClick.emit();
  }
}
