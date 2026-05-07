import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { TranslocoPipe } from '@jsverse/transloco';
import { CourseSummary } from 'app/main/courses/store/selectors/courses.selectors';

@Component({
  selector: 'app-course-side-menu',
  templateUrl: './course-side-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconButton, MatIcon, MatDivider, TranslocoPipe],
})
export class CourseSideMenuComponent {
  summary = input<CourseSummary>();
  closeMenu = output();
}
