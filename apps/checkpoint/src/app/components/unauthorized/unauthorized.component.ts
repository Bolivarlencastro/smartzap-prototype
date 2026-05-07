import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'cp-unauthorized',
  imports: [MatIcon, TranslocoPipe],
  template: `
    <div class="flex flex-col gap-6 items-center text-center">
      <mat-icon [inline]="true" class="text-8xl unauthorized-icon">error</mat-icon>
      <p class="text-3xl font-medium">{{ 'unauthorized.title' | transloco }}</p>
      <p class="max-w-prose">{{ 'unauthorized.message' | transloco }}</p>
    </div>
  `,
  styles: `
    .unauthorized-icon {
      color: var(--check-in-red);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedComponent {}
