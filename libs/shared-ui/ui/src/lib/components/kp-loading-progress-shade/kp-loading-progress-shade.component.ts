import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'kp-loading-progress-shade',
  templateUrl: './kp-loading-progress-shade.component.html',
  styleUrls: ['./kp-loading-progress-shade.component.scss'],
  imports: [MatProgressSpinner, TranslocoPipe],
})
export class KpLoadingProgressShadeComponent {}
