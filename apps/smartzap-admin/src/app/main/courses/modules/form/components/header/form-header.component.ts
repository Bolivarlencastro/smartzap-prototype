import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Course } from 'app/main/courses/model';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-course-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [TranslocoPipe],
})
export class FormHeaderComponent {
  @Input() course!: Course;
}
