import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'kp-loading',
  templateUrl: './kp-loading.component.html',
  imports: [MatProgressSpinner],
})
export class KpLoadingComponent {}
