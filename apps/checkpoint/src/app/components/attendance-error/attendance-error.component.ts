import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { CHECK_IN_ERROR_CODE } from '../../models/check-in-error-code';

const ERROR_MESSAGES: Record<CHECK_IN_ERROR_CODE, string> = {
  date_expired_for_auto_check: 'attendance-error.self-check-in-expired',
  date_not_found: 'attendance-error.event-not-found',
  enrollment_not_found_for_user_and_date: 'attendance-error.enrollment-not-found',
};

@Component({
  selector: 'cp-attendance-error',
  imports: [MatIcon, TranslocoPipe],
  template: ` <div class="flex flex-col gap-6 items-center text-center">
    <mat-icon [inline]="true" class="text-8xl check-in-error">brightness_alert</mat-icon>
    <p class="text-3xl " [innerHTML]="'attendance-error.title' | transloco"></p>
    <p class="max-w-prose" [innerHTML]="errorMessage() | transloco"></p>
  </div>`,
  styles: `
    .check-in-error {
      color: var(--check-in-red);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceErrorComponent {
  errorCode = input<CHECK_IN_ERROR_CODE>();
  errorMessage = computed(() => ERROR_MESSAGES[this.errorCode()] || '');
}
