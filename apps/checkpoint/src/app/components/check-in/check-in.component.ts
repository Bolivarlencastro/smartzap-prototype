import { ChangeDetectionStrategy, Component, DestroyRef, inject, Signal } from '@angular/core';
import { AttendanceConfirmedComponent } from '../attendance-confirmed/attendance-confirmed.component';
import { AttendanceErrorComponent } from '../attendance-error/attendance-error.component';
import { CheckInService } from '../../services/check-in.service';
import { SupportMaterial } from '@keeps-platform-frontend-workspace/kp-keeps';
import { SupportMaterialsService } from '../../services/support-materials.service';
import { SupportMaterialComponent } from '../support-material/support-material.component';
import { CHECK_IN_STATUS } from '../../models/check-in-error-code';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'cp-check-in',
  imports: [AttendanceConfirmedComponent, AttendanceErrorComponent, SupportMaterialComponent, MatProgressSpinner],
  template: `
    @let result = this.checkInResult();
    @switch (result) {
      @case ('success') {
        <cp-attendance-confirmed></cp-attendance-confirmed>
        <cp-support-material class="mt-8" [materials]="supportMaterials()"></cp-support-material>
      }
      @case ('loading') {
        <mat-progress-spinner [diameter]="50" [mode]="'indeterminate'"></mat-progress-spinner>
      }
      @default {
        <cp-attendance-error [errorCode]="result"></cp-attendance-error>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckInComponent {
  readonly supportMaterials: Signal<SupportMaterial[]>;
  readonly checkInResult: Signal<CHECK_IN_STATUS>;
  readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly checkingService: CheckInService,
    private readonly supportMaterialsService: SupportMaterialsService,
  ) {
    this.supportMaterials = this.supportMaterialsService.supportMaterials;
    this.checkInResult = this.checkingService.checkInStatus;
  }
}
