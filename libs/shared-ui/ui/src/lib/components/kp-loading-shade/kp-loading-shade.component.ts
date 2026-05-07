import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'kp-loading-shade',
  templateUrl: './kp-loading-shade.component.html',
  styleUrls: ['./kp-loading-shade.component.scss'],
  imports: [MatProgressSpinner],
})
export class KpLoadingShadeComponent {}
