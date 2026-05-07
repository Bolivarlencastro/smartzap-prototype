import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { EnrollmentsStatistics } from '../../store/reducers/enrollments.reducer';

@Component({
  selector: 'app-enrollments-side-menu',
  templateUrl: './enrollments-side-menu.component.html',
  imports: [MatDivider, MatIcon, MatIconButton, TranslocoPipe],
})
export class EnrollmentsSideMenuComponent {
  @Input() statistics: EnrollmentsStatistics | null = null;
  @Output() closeMenu = new EventEmitter<void>();
}
