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
import { CourseDialogViewModel } from '../../models/course-dialog';
import { CourseDialogActions, courseDialogFeature } from '../../store/course';

@Component({
  selector: 'lp-course-dialog',
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
    KpDurationPipe,
    KpPluralizeTranslatePipe,
    DialogItemListComponent,
    DialogUserItemComponent,
    DialogUserItemInfoComponent,
    DialogLearnContentItemComponent,
    PercentPipe,
  ],
  template: `
    @let course = this.vm()?.course;
    @let loading = this.vm()?.loading;
    @let enrollments = this.vm()?.data?.enrollments;
    @let notEnrolled = this.vm()?.data?.notEnrolled;
    @let associatedTrails = this.vm()?.data?.associatedTrails;

    <div matDialogTitle class="flex justify-between items-center">
      <span class="text-xl">{{ 'LEADER_PANEL.COURSES.DIALOG.TITLE' | transloco }}</span>
      <button matDialogClose matIconButton>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <div class="p-5">
      <div class="course-info">
        <div class="text-xl font-bold mb-2.5">{{ course?.course_name }}</div>
        <div class="flex items-center gap-1 text-xs">
          <mat-icon class="s-4 opacity-70">timer</mat-icon>
          <span class="opacity-70">{{ course?.duration | kpDuration }}</span>

          <mat-icon class="s-4 ml-2 opacity-70">group</mat-icon>
          <span class="opacity-70"
            >{{ course?.enrollments_count }}
            {{
              'LEADER_PANEL.COURSES.DIALOG.ENROLLED_COUNT' | kpPluralizeTranslate: { value: course?.enrollments_count }
            }}</span
          >

          @if (course?.overdue_count) {
            <mat-icon class="s-4 overdue-count-color ml-2">error</mat-icon>
            <span class="overdue-count-color font-bold"
              >{{ course?.overdue_count }}
              {{
                'LEADER_PANEL.COURSES.DIALOG.OVERDUE_COUNT' | kpPluralizeTranslate: { value: course?.overdue_count }
              }}</span
            >
          }
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
              [emptyStateMessage]="'LEADER_PANEL.COURSES.DIALOG.ENROLLMENTS.EMPTY_STATE'"
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
              [emptyStateMessage]="'LEADER_PANEL.COURSES.DIALOG.NOT_ENROLLED.EMPTY_STATE'"
            >
              @for (item of notEnrolled; track item.id) {
                <lp-dialog-user-item
                  [name]="item.name"
                  [avatar]="item.avatar"
                  [jobPosition]="item.jobPosition"
                ></lp-dialog-user-item>
              }
            </lp-dialog-item-list>
          </ng-template>
        </mat-tab>

        @if (hasTrailTab) {
          <mat-tab id="trail">
            <ng-template mat-tab-label>
              <mat-icon class="mr-2 s-4">timeline</mat-icon>
              <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.ASSOCIATED_TO_TRAILS.LABEL' | transloco }}</span>
            </ng-template>
            <ng-template matTabContent>
              <lp-dialog-item-list
                [loading]="loading"
                [hasItems]="associatedTrails?.length"
                [emptyStateMessage]="'LEADER_PANEL.COURSES.DIALOG.ASSOCIATED_TO_TRAILS.EMPTY_STATE'"
              >
                @for (item of associatedTrails; track item.id) {
                  <lp-dialog-learn-content-item [name]="item?.name" [learn_content_type]="item?.learn_content_type">
                    <span class="text-2xxs font-bold opacity-70">{{ item.progress | percent }}</span>
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
      .course-info {
        @apply rounded-lg p-3.5 w-full mb-5;

        background-color: var(--mat-sys-surface-container-low);
      }

      .overdue-count-color {
        color: rgb(239, 68, 68);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDialogComponent implements OnDestroy {
  readonly vm: Signal<CourseDialogViewModel>;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected readonly hasTrailTab: boolean,
    private readonly store: Store,
  ) {
    store.dispatch(CourseDialogActions.fetchData());
    this.vm = toSignal(this.store.select(courseDialogFeature.selectViewModel));
  }

  ngOnDestroy() {
    this.store.dispatch(CourseDialogActions.resetState());
  }
}
