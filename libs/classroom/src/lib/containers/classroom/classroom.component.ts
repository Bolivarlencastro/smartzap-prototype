import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnDestroy, Signal, signal, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FullscreenService } from '@keeps-platform-frontend-workspace/layout';
import { KpAccordionComponent } from '@keeps-platform-frontend-workspace/ui/kp-accordion';
import {
  KpSidenavContentDirective,
  KpSidenavFooterDirective,
  KpSidenavItemComponent,
  KpSideNavMode,
  KpSidenavType,
  SidenavComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-sidenav';
import { TranslocoPipe } from '@jsverse/transloco';
import { Observable, tap } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { CourseHeaderComponent } from '../../components/course-header/course-header.component';
import { HelpPanelComponent } from '../../components/help-panel/help-panel.component';
import { ProgressPanelComponent } from '../../components/progress-panel/progress-panel.component';
import { StepItemComponent } from '../../components/step-item/step-item.component';
import { ClassroomFacade, ClassroomViewModel } from '../../facades';
import { ClassroomStep, THEME_TOOLTIP } from '../../models';
import { KpUserOnboardingService } from '@keeps-platform-frontend-workspace/ui/kp-user-onboarding-service';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'kp-classroom',
  imports: [
    CommonModule,
    SidenavComponent,
    KpSidenavFooterDirective,
    MatIconButton,
    MatIcon,
    KpSidenavItemComponent,
    KpSidenavContentDirective,
    KpAccordionComponent,
    RouterOutlet,
    CourseHeaderComponent,
    StepItemComponent,
    ProgressPanelComponent,
    TranslocoPipe,
    RouterLink,
    RouterLinkActive,
    MatTooltipModule,
    UpperCasePipe,
  ],
  template: `
    @if (view$ | async; as view) {
      <kp-course-header
        #courseHeaderComponent
        (next)="nextStep()"
        (previous)="previousStep()"
        (toggleNav)="kpSidenav.toggle()"
        [totalSteps]="view.totalSteps"
        [currentStepIndex]="view.currentStepIndex"
        [courseName]="view.courseName"
        [disabledNext]="view.disabledNext"
        [displayNavControls]="view.showNavigationControls"
        [countdown]="view.countdown"
      ></kp-course-header>

      <kp-sidenav
        #kpSidenav
        [open]="!isMobileView"
        [sideNavType]="sideNavType$ | async"
        [sidenavMode]="sideNavMode$ | async"
        [activeItemIndex]="initialSelectedStepIndex()"
      >
        <div class="flex flex-col gap-4">
          <kp-sidenav-item icon="list" [tooltip]="'CLASSROOM.HELP_PANEL.SIDE_MENU.SUMMARY' | transloco">
            <div class="flex flex-col gap-2 pb-2 overflow-y-auto">
              @for (step of view.steps; track step.id) {
                <kp-accordion
                  data-test="classroom-steps-menu"
                  [title]="step.name | transloco"
                  [order]="step.order"
                  [progress]="step.progress"
                  [hasChildren]="!!step.childrenSteps?.length"
                  [active]="isCurrentStep(view.currentStep, step.id)"
                  (subjectStep)="goToStep(step.id)"
                >
                  @for (childrenStep of step.childrenSteps; track childrenStep.id) {
                    <kp-step-item
                      data-test="classroom-steps-menu"
                      [order]="childrenStep.order"
                      [name]="childrenStep.name | transloco"
                      [skippedByUser]="childrenStep.skippedByUser"
                      [active]="isCurrentStep(view.currentStep, childrenStep.id)"
                      [completed]="childrenStep.completed"
                      (go)="goToStep(childrenStep.id)"
                    ></kp-step-item>
                  }
                </kp-accordion>
              }
            </div>
          </kp-sidenav-item>
          <kp-sidenav-item
            data-test="progress-panel-button"
            icon="analytics"
            [tooltip]="'CLASSROOM.HELP_PANEL.SIDE_MENU.PROGRESS' | transloco"
          >
            <kp-progress-panel
              class="w-full"
              [progressPanel]="view.progressPanel"
              (updateGoalDate)="changeGoalDate($event)"
              (toggleGoalDate)="toggleGoalDateMenu($event)"
            ></kp-progress-panel>
          </kp-sidenav-item>
          <kp-sidenav-item
            #certificateItem
            routerLinkActive
            #rla="routerLinkActive"
            icon="school"
            [active]="rla.isActive"
            [tooltip]="'CLASSROOM.HELP_PANEL.SIDE_MENU.CERTIFICATE' | transloco"
            [hasContent]="false"
            [routerLink]="view.certificateLink"
            [disabled]="!view.certificateAvailable"
          >
          </kp-sidenav-item>
        </div>

        <div kpSidenavFooter class="flex flex-col gap-2">
          <button
            class="hidden xxs:flex"
            mat-icon-button
            [matTooltip]="'CLASSROOM.HELP_PANEL.SIDE_MENU.HELP' | transloco"
            matTooltipPosition="after"
            (click)="openHelpPanel()"
          >
            <mat-icon>help</mat-icon>
          </button>
          <button
            class="hidden xxs:flex"
            mat-icon-button
            [matTooltip]="'CLASSROOM.HELP_PANEL.SIDE_MENU.FULLSCREEN' | transloco"
            matTooltipPosition="after"
            (click)="toggleFullscreen()"
          >
            <mat-icon>{{ fullscreenIcon() }}</mat-icon>
          </button>

          <button
            class="hidden xxs:flex"
            mat-icon-button
            [matTooltip]="getThemeTooltip(view.themeIcon) | transloco"
            matTooltipPosition="after"
            (click)="toggleTheme()"
          >
            <mat-icon>{{ view.themeIcon }}</mat-icon>
          </button>

          <button
            data-test="button-close-classroom"
            class="hidden xxs:flex"
            mat-icon-button
            [matTooltip]="'CLASSROOM.HELP_PANEL.SIDE_MENU.EXIT_COURSE' | transloco"
            matTooltipPosition="after"
            (click)="leaveCourse()"
          >
            <mat-icon>keyboard_return</mat-icon>
          </button>

          <div class="flex flex-col xxs:hidden items-center" (click)="leaveCourse()">
            <mat-icon>logout</mat-icon>
            <span class="text-sm">{{ 'CLASSROOM.GENERAL.LEAVE' | transloco | uppercase }}</span>
          </div>
        </div>

        <div kpSidenavContent class="min-h-full">
          <router-outlet></router-outlet>
        </div>
      </kp-sidenav>
    }
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      min-height: 100%;
      --classroom-fixed-height: calc(100dvh - 72px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassroomComponent implements OnDestroy {
  @ViewChild('courseHeaderComponent') courseHeaderComponent: CourseHeaderComponent;
  @ViewChild('kpSidenav', { static: true }) sideNav: SidenavComponent;

  view$: Observable<ClassroomViewModel>;
  sideNavType$: Observable<KpSidenavType>;
  sideNavMode$: Observable<KpSideNavMode>;
  isMobileView: boolean;
  fullscreenIcon: Signal<string>;
  initialSelectedStepIndex = signal<number | undefined>(undefined);

  private readonly sideNavOverBreakPoint = '(max-width: 960px)';

  constructor(
    private classroomFacade: ClassroomFacade,
    private fullscreenService: FullscreenService,
    private dialog: MatDialog,
    private breakPointObserver: BreakpointObserver,
    private userOnboardingService: KpUserOnboardingService,
  ) {
    this.view$ = classroomFacade.view$;
    this.sideNavType$ = this.initBreakPointWatcher();
    this.sideNavMode$ = this.getInitialSideNavMode();
    this.classroomFacade.loadClassroomTheme();
    this.fullscreenIcon = computed(() => (this.fullscreenService.isFullscreen() ? 'fullscreen_exit' : 'fullscreen'));
    this.userOnboardingService.openDialog('classroom');
  }

  ngOnDestroy(): void {
    this.classroomFacade.restoreWorkspaceTheme();
  }

  toggleTheme() {
    this.classroomFacade.toggleTheme();
  }

  toggleFullscreen() {
    this.fullscreenService.toggleFullscreen();
  }

  goToStep(stepId: string) {
    if (this.isMobileView && this.sideNav?.open()) {
      this.sideNav.toggle();
    }
    this.classroomFacade.goToStep(stepId, this.courseHeaderComponent.countdownFinished);
  }

  openHelpPanel() {
    this.dialog.open(HelpPanelComponent, { autoFocus: 'dialog', panelClass: 'route-dialog-container' });
  }

  nextStep() {
    this.classroomFacade.nextStep();
  }

  previousStep() {
    this.classroomFacade.previousStep(this.courseHeaderComponent.countdownFinished);
  }

  leaveCourse() {
    this.classroomFacade.leaveCourse();
  }

  changeGoalDate(date: Date) {
    this.classroomFacade.changeGoalDate(date);
  }

  toggleGoalDateMenu(value: boolean) {
    this.classroomFacade.toggleGoalDateMenu(value);
  }

  getThemeTooltip(themeIcon: string): string {
    return THEME_TOOLTIP[themeIcon] || '';
  }

  isCurrentStep(currentStep: ClassroomStep, stepId: string): boolean {
    return currentStep?.id === stepId;
  }

  private initBreakPointWatcher(): Observable<KpSidenavType> {
    return this.breakPointObserver.observe([this.sideNavOverBreakPoint]).pipe(
      tap((result) => (this.isMobileView = result.matches)),
      map((result) => (result.matches ? 'over' : 'side')),
    );
  }

  private getInitialSideNavMode(): Observable<KpSideNavMode> {
    return this.view$.pipe(
      map(({ enrollment, steps }) => ({ status: enrollment?.status, steps })),
      filter(({ steps }) => !!steps.length),
      tap({ next: ({ status }) => this.setInitialSelectedStepIndex(status) }),
      map(({ status }) => (status ? 'full' : 'mini') as KpSideNavMode),
      take(1),
    );
  }

  private setInitialSelectedStepIndex(status: EnrollmentStatuses) {
    if (!status) {
      return;
    }

    this.initialSelectedStepIndex.set(0);
  }
}
