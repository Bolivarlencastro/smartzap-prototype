import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivityService, ProgressBarService } from '@core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isProgressBarVisible$ | async) {
      <div class="app-layout__progress-bar">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>
    }
    <ng-content></ng-content>
  `,
  standalone: false,
})
export class LayoutComponent {
  isProgressBarVisible$: Observable<boolean>;

  constructor(
    private _service: ActivityService,
    _progressBarService: ProgressBarService,
  ) {
    this.isProgressBarVisible$ = _progressBarService.visible$;
  }
}
