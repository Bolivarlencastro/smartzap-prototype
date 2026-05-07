import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'cp-attendance-confirmed',
  imports: [MatIcon, TranslocoPipe],
  template: `
    <div class="flex flex-col gap-6 items-center text-center">
      <mat-icon [inline]="true" class="text-8xl check-in-ok">verified</mat-icon>
      <p class="text-3xl " [innerHTML]="'attendance-confirmed.title' | transloco"></p>
      <p [innerHTML]="'attendance-confirmed.welcome' | transloco"></p>
    </div>
  `,
  styles: `
    .check-in-ok {
      color: var(--check-in-green);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceConfirmedComponent {}
