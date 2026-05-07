import { Component, Input } from '@angular/core';
import { EnrollmentsStatistics } from '../../store/reducers/enrollments.reducer';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-settings-enrollments-statistics',
  templateUrl: './enrollments-statistics.component.html',
  imports: [TranslocoPipe],
})
export class EnrollmentsStatisticsComponent {
  @Input() statistics!: EnrollmentsStatistics;
}
