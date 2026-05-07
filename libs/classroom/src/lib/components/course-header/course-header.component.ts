import { ChangeDetectionStrategy, Component, input, output, ViewChild } from '@angular/core';
import { HeaderNavComponent } from '../header-nav/header-nav.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { KpCountdown } from '@keeps-platform-frontend-workspace/ui/kp-countdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'kp-course-header',
  template: `
    <div class="flex gap-6 items-center">
      <button
        data-test="button-menu-course"
        mat-icon-button
        [matTooltip]="'CLASSROOM.HELP_PANEL.TOP_BAR.MENU' | transloco"
        matTooltipPosition="after"
        (click)="toggleNavigation()"
      >
        <mat-icon>apps</mat-icon>
      </button>
      <span class="hidden xxs:block line-clamp-2 text-ellipsis overflow-hidden break-all">{{ courseName() }}</span>
    </div>
    <kp-header-nav
      #headerNavComponent
      (next)="nextStep()"
      (previous)="previousStep()"
      [class.hidden-nav]="!displayNavControls()"
      [disableNext]="disabledNext()"
      [totalSteps]="totalSteps()"
      [currentStepIndex]="currentStepIndex()"
      [countdown]="countdown()"
    ></kp-header-nav>
  `,
  styles: [
    `
      :host {
        height: 64px;
        display: flex;
        gap: 8px;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
        background-color: var(--course-header-bg);
      }

      .hidden-nav {
        display: none;
      }
    `,
  ],
  imports: [HeaderNavComponent, MatIconButton, MatIcon, MatTooltipModule, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseHeaderComponent {
  courseName = input<string>();
  totalSteps = input<number>();
  currentStepIndex = input<number>();
  disabledNext = input<boolean>(false);
  displayNavControls = input(true);
  next = output<void>();
  previous = output<void>();
  toggleNav = output<void>();
  countdown = input<KpCountdown>();

  @ViewChild('headerNavComponent') headerNavComponent: HeaderNavComponent;

  get countdownFinished() {
    return this.headerNavComponent?.countdownFinished;
  }

  previousStep(): void {
    this.previous.emit();
  }

  nextStep(): void {
    this.next.emit();
  }

  toggleNavigation() {
    this.toggleNav.emit();
  }
}
