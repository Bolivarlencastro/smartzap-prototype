import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-not-found',
  imports: [MatButton, RouterLink, MatIcon, TranslocoPipe],
  template: `
    <div class="flex flex-col items-center gap-4">
      <div class="error-container">
        <div class="font-bold text-8xl error-label tracking-wider text-primary opacity-45">404</div>
        <div class="circles relative">
          <div class="rounded-full w-40 h-40 bg-primary opacity-25 circles z-0"></div>
          <div class="rounded-full w-30 h-30 bg-primary opacity-35 circles z-10"></div>
          <div class="rounded-full w-20 h-20 bg-primary circles z-20">
            <mat-icon class="text-on-primary text-4xl" inline="true">search_off</mat-icon>
          </div>
        </div>
      </div>

      <div class="text-center max-w-prose flex flex-col gap-4">
        <h1 class="text-4xl font-bold">{{ 'NOT_FOUND.TITLE' | transloco }}</h1>
        <p [innerHTML]="'NOT_FOUND.MESSAGE' | transloco"></p>
        <a matButton="filled" routerLink="/" class="self-center">{{ 'NOT_FOUND.BACK_TO_START' | transloco }}</a>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .error-container,
    .circles {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      place-items: center;

      .error-label,
      .circles {
        grid-row: 1 / 2;
        grid-column: 1 / 2;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
