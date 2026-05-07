import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'cv-header',
  imports: [TranslocoPipe, MatIcon],
  template: `
    <mat-icon [inline]="true" class="text-4xl primary-text">verified</mat-icon>
    <h1 class="text-xl font-medium">{{ 'header.title' | transloco }}</h1>
  `,
  styles: `
    :host {
      padding: 1rem 2rem;
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
