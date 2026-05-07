import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'kp-snack-loading',
  template: `
    <div class="kp-snack-loading flex items-center">
      <mat-spinner class="mr-5" strokeWidth="1" diameter="15" color="accent"></mat-spinner>
      <span data-test="kp-snack-loading.snack-message">{{
        (data && data.message ? data.message : 'UI.GENERAL.LOADING') | transloco
      }}</span>
    </div>
  `,
  imports: [MatProgressSpinner, TranslocoPipe],
})
export class KpSnackLoadingComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
