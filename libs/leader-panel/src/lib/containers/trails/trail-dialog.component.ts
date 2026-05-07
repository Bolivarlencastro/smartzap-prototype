import { PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogTitle } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { Store } from '@ngrx/store';
import { DialogItemListComponent } from '../../components/dialog-tab-items/dialog-item-list.component';
import { DialogLearnContentItemComponent } from '../../components/dialog-tab-items/dialog-learn-content-item.component';
import { DialogUserItemInfoComponent } from '../../components/dialog-tab-items/dialog-user-item-info.component';
import { DialogUserItemComponent } from '../../components/dialog-tab-items/dialog-user-item.component';
import { TrailDialogViewModel } from '../../models/trail-dialog';
import { TrailDialogActions, trailDialogFeature } from '../../store/trail';

@Component({
  selector: 'lp-trail-dialog',
  imports: [
    MatDialogTitle,
    MatDialogClose,
    MatIconButton,
    MatIcon,
    MatTabGroup,
    MatTab,
    MatDivider,
    MatTabLabel,
    MatTabContent,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
    DialogItemListComponent,
    DialogUserItemComponent,
    DialogUserItemInfoComponent,
    DialogLearnContentItemComponent,
    PercentPipe,
    KpDurationPipe,
  ],
  template: `
    @let trail = this.vm()?.trail;
    @let loading = this.vm()?.loading;
    @let enrollments = this.vm()?.data?.enrollments;
    @let notEnrolled = this.vm()?.data?.notEnrolled;
    @let courseOnTrails = this.vm()?.data?.courseOnTrails;
    @let pulseOnTrails = this.vm()?.data?.pulseOnTrails;

    <div matDialogTitle class="flex justify-between items-center">
      <span class="text-xl">{{ 'LEADER_PANEL.TRAILS.DIALOG.TITLE' | transloco }}</span>
      <button matDialogClose matIconButton>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <div class="p-5">
      <div class="trail-info">
        <div class="text-xl font-bold mb-2.5">{{ trail?.learning_trail_name }}</div>
        <div class="flex items-center gap-1 text-xs">
          <mat-icon class="s-4 ml-2 opacity-70">group</mat-icon>
          <span class="opacity-70"
            >{{ trail?.enrollments_count }}
            {{
              'LEADER_PANEL.TRAILS.DIALOG.ENROLLED_COUNT' | kpPluralizeTranslate: { value: trail?.enrollments_count }
            }}</span
          >
        </div>
      </div>

      <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="0ms">
        <mat-tab id="enrolled">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2 s-4">group</mat-icon>
            <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.ENROLLMENTS.LABEL' | transloco }}</span>
          </ng-template>
          <ng-template matTabContent>
            <lp-dialog-item-list
              [loading]="loading"
              [hasItems]="enrollments?.length"
              [emptyStateMessage]="'LEADER_PANEL.TRAILS.DIALOG.ENROLLMENTS.EMPTY_STATE'"
            >
              @for (item of enrollments; track item.id) {
                <lp-dialog-user-item
                  [name]="item?.name"
                  [avatar]="item?.avatar"
                  [isNormative]="item?.normative"
                  [isRequired]="item?.required"
                >
                  <lp-dialog-user-item-info
                    [progress]="item?.progress"
                    [status]="item?.status"
                    [goal_date]="item?.goal_date"
                  ></lp-dialog-user-item-info>
                </lp-dialog-user-item>
              }
            </lp-dialog-item-list>
          </ng-template>
        </mat-tab>

        <mat-tab id="not-enrolled">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2 s-4">person_off</mat-icon>
            <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.NOT_ENROLLED.LABEL' | transloco }}</span>
          </ng-template>
          <ng-template matTabContent>
            <lp-dialog-item-list
              [loading]="loading"
              [hasItems]="notEnrolled?.length"
              [emptyStateMessage]="'LEADER_PANEL.TRAILS.DIALOG.NOT_ENROLLED.EMPTY_STATE'"
            >
              @for (item of notEnrolled; track item.id) {
                <lp-dialog-user-item
                  [name]="item.name"
                  [avatar]="item.avatar"
                  [jobPosition]="item.jobPosition"
                ></lp-dialog-user-item>
              }</lp-dialog-item-list
          ></ng-template>
        </mat-tab>

        @if (data?.hasCourseTab) {
          <mat-tab id="course">
            <ng-template mat-tab-label>
              <mat-icon class="mr-2 s-4">rocket_launch</mat-icon>
              <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.COURSE_IN_TRAIL.LABEL' | transloco }}</span>
            </ng-template>
            <ng-template matTabContent>
              <lp-dialog-item-list
                [loading]="loading"
                [hasItems]="courseOnTrails?.length"
                [emptyStateMessage]="'LEADER_PANEL.TRAILS.DIALOG.COURSE_IN_TRAIL.EMPTY_STATE'"
              >
                @for (item of courseOnTrails; track item.id) {
                  <lp-dialog-learn-content-item [name]="item?.name" [learn_content_type]="item?.learn_content_type">
                    <div class="flex flex-col items-center">
                      <span class="text-xs font-bold opacity-70">{{ item.progress | percent }}</span>
                      <span class="text-2xxs opacity-70">{{
                        'LEADER_PANEL.GENERAL.AVERAGE_PROGRESS' | transloco
                      }}</span>
                    </div>

                    <div class="flex flex-col items-center">
                      <span class="text-xs font-bold opacity-70">{{ item.performance | percent }}</span>
                      <span class="text-2xxs opacity-70">{{
                        'LEADER_PANEL.GENERAL.AVERAGE_PERFORMANCE' | transloco
                      }}</span>
                    </div>
                  </lp-dialog-learn-content-item>
                }
              </lp-dialog-item-list>
            </ng-template>
          </mat-tab>
        }

        @if (data?.hasPulseTab) {
          <mat-tab id="pulse">
            <ng-template mat-tab-label>
              <mat-icon class="mr-2 s-4">track_changes</mat-icon>
              <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.PULSE_IN_TRAIL.LABEL' | transloco }}</span>
            </ng-template>
            <ng-template matTabContent>
              <lp-dialog-item-list
                [loading]="loading"
                [hasItems]="pulseOnTrails?.length"
                [emptyStateMessage]="'LEADER_PANEL.TRAILS.DIALOG.PULSE_IN_TRAIL.EMPTY_STATE'"
              >
                @for (item of pulseOnTrails; track item.id) {
                  <lp-dialog-learn-content-item [name]="item?.name" [learn_content_type]="item?.learn_content_type">
                    <span class="text-2xxs font-bold opacity-70 leading-none">{{ item.duration | kpDuration }}</span>
                    <span class="text-xs font-bold opacity-70 leading-none">{{ item.performance | percent }}</span>
                  </lp-dialog-learn-content-item>
                }
              </lp-dialog-item-list>
            </ng-template>
          </mat-tab>
        }
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .trail-info {
        @apply rounded-lg p-3.5 w-full mb-5;

        background-color: var(--mat-sys-surface-container-low);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailDialogComponent implements OnDestroy {
  readonly vm: Signal<TrailDialogViewModel>;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected readonly data: { hasCourseTab: boolean; hasPulseTab: boolean },
    private readonly store: Store,
  ) {
    store.dispatch(TrailDialogActions.fetchData());
    this.vm = toSignal(this.store.select(trailDialogFeature.selectViewModel));
  }

  ngOnDestroy() {
    this.store.dispatch(TrailDialogActions.resetState());
  }
}
