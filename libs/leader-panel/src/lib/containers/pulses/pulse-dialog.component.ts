import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogTitle } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpCategoryLabelPipe } from '@keeps-platform-frontend-workspace/ui/kp-category-label';
import { KpContentIconName } from '@keeps-platform-frontend-workspace/ui/kp-content-icon-name';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { Store } from '@ngrx/store';
import { DialogItemListComponent } from '../../components/dialog-tab-items/dialog-item-list.component';
import { DialogLearnContentItemComponent } from '../../components/dialog-tab-items/dialog-learn-content-item.component';
import { DialogUserItemComponent } from '../../components/dialog-tab-items/dialog-user-item.component';
import { PulseDialogViewModel } from '../../models/pulse-dialog';
import { PulseDialogActions, pulseDialogFeature } from '../../store/pulse';

@Component({
  selector: 'lp-pulse-dialog',
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
    KpContentIconName,
    KpCategoryLabelPipe,
    DialogItemListComponent,
    DialogUserItemComponent,
    DialogLearnContentItemComponent,
    DatePipe,
  ],
  template: `
    @let pulse = this.vm()?.pulse;
    @let loading = this.vm()?.loading;
    @let consumedBy = this.vm()?.data?.consumedBy;
    @let notConsumed = this.vm()?.data?.notConsumed;
    @let associatedTrails = this.vm()?.data?.associatedTrails;

    <div matDialogTitle class="flex justify-between items-center">
      <span class="text-xl">{{ 'LEADER_PANEL.PULSES.DIALOG.TITLE' | transloco }}</span>
      <button matDialogClose matIconButton>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <div class="p-5">
      <div class="pulse-info">
        <div class="text-xl font-bold mb-2.5">{{ pulse?.name }}</div>
        <div class="flex items-center gap-1 text-xs">
          <mat-icon class="s-2 opacity-70" [svgIcon]="pulse?.content_type_name | KpContentIconName"></mat-icon>
          <span class="opacity-70">{{ pulse?.content_type_name | kpCategoryLabel | transloco }}</span>

          <mat-icon class="s-4 opacity-70 ml-2">timer</mat-icon>
          <span class="opacity-70">{{ pulse?.duration | kpDuration }}</span>

          <mat-icon class="s-4 ml-2 opacity-70">hub</mat-icon>
          <span class="opacity-70">{{ pulse?.channel_name }}</span>

          <mat-icon class="s-4 ml-2 opacity-70">visibility</mat-icon>
          <span class="opacity-70">{{ pulse?.views }} {{ 'LEADER_PANEL.PULSES.DIALOG.VIEWS' | transloco }}</span>
        </div>
      </div>

      <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="0ms">
        <mat-tab id="consumed-by">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2 s-4">visibility</mat-icon>
            <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.CONSUMED_BY.LABEL' | transloco }}</span>
          </ng-template>
          <ng-template matTabContent>
            <lp-dialog-item-list
              [loading]="loading"
              [hasItems]="consumedBy?.length"
              [emptyStateMessage]="'LEADER_PANEL.PULSES.DIALOG.CONSUMED_BY.EMPTY_STATE'"
            >
              @for (item of consumedBy; track item.id) {
                <lp-dialog-user-item [name]="item?.name" [avatar]="item?.avatar" [jobPosition]="item?.jobPosition">
                  <span class="ml-auto text-xs opacity-70">
                    {{ 'LEADER_PANEL.GENERAL.VIEWED_IN' | transloco }} {{ item?.view_date | date: 'shortDate' }}
                  </span>
                </lp-dialog-user-item>
              }
            </lp-dialog-item-list>
          </ng-template>
        </mat-tab>

        <mat-tab id="not-consumed">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2 s-4">visibility_off</mat-icon>
            <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.NOT_CONSUMED.LABEL' | transloco }}</span>
          </ng-template>
          <ng-template matTabContent>
            <lp-dialog-item-list
              [loading]="loading"
              [hasItems]="notConsumed?.length"
              [emptyStateMessage]="'LEADER_PANEL.PULSES.DIALOG.NOT_CONSUMED.EMPTY_STATE'"
            >
              @for (item of notConsumed; track item.id) {
                <lp-dialog-user-item [name]="item?.name" [avatar]="item?.avatar" [jobPosition]="item?.jobPosition">
                </lp-dialog-user-item>
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
                [emptyStateMessage]="'LEADER_PANEL.TRAILS.DIALOG.ASSOCIATED_TRAILS.EMPTY_STATE'"
              >
                @for (item of associatedTrails; track item.id) {
                  <lp-dialog-learn-content-item [name]="item?.name" [learn_content_type]="item?.learn_content_type">
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
      .pulse-info {
        @apply rounded-lg p-3.5 w-full mb-5;

        background-color: var(--mat-sys-surface-container-low);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseDialogComponent implements OnDestroy {
  readonly vm: Signal<PulseDialogViewModel>;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected readonly hasTrailTab: boolean,
    private readonly store: Store,
  ) {
    store.dispatch(PulseDialogActions.fetchData());
    this.vm = toSignal(this.store.select(pulseDialogFeature.selectViewModel));
  }

  ngOnDestroy() {
    this.store.dispatch(PulseDialogActions.resetState());
  }
}
