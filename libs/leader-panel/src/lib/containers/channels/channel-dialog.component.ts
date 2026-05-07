import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatDialogClose, MatDialogTitle } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpDurationPipe } from '@keeps-platform-frontend-workspace/ui/kp-duration';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { Store } from '@ngrx/store';
import { DialogItemListComponent } from '../../components/dialog-tab-items/dialog-item-list.component';
import { DialogLearnContentItemComponent } from '../../components/dialog-tab-items/dialog-learn-content-item.component';
import { DialogUserItemComponent } from '../../components/dialog-tab-items/dialog-user-item.component';
import { PulsesCounterComponent } from '../../components/pulses-counter/pulses-counter.component';
import { ChannelDialogViewModel } from '../../models/channel-dialog';
import { ChannelDialogActions, channelDialogFeature } from '../../store/channel';

@Component({
  selector: 'lp-channel-dialog',
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
    DialogItemListComponent,
    DialogUserItemComponent,
    DialogLearnContentItemComponent,
    KpPluralizeTranslatePipe,
    PulsesCounterComponent,
  ],
  template: `
    @let channel = this.vm()?.channel;
    @let loading = this.vm()?.loading;
    @let enrolled = this.vm()?.data?.enrolled;
    @let pulses = this.vm()?.data?.pulses;
    @let notEnrolled = this.vm()?.data?.notEnrolled;

    <div matDialogTitle class="flex justify-between items-center">
      <span class="text-xl">{{ 'LEADER_PANEL.CHANNELS.DIALOG.TITLE' | transloco }}</span>
      <button matDialogClose matIconButton>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <div class="p-5">
      <div class="channel-info">
        <div class="text-xl font-bold">{{ channel?.name }}</div>
        <div class="text-xs opacity-70 mb-3">{{ channel?.description }}</div>
        <div class="flex items-center gap-1 text-xs">
          <mat-icon class="s-4 opacity-70">group</mat-icon>
          <span class="opacity-70"
            >{{ channel?.enrolled_count }}
            {{
              'LEADER_PANEL.CHANNELS.DIALOG.ENROLLED_COUNT' | kpPluralizeTranslate: { value: channel?.enrolled_count }
            }}</span
          >

          <mat-icon class="s-4 opacity-70 ml-2">track_changes</mat-icon>
          <span class="opacity-70"
            >{{ channel?.pulses }}
            {{
              'LEADER_PANEL.CHANNELS.DIALOG.PULSE_IN_CHANNEL' | kpPluralizeTranslate: { value: channel?.pulses }
            }}</span
          >
        </div>
      </div>

      <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="0ms">
        <mat-tab id="enrolled">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2 s-4">group</mat-icon>
            <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.ENROLLED.LABEL' | transloco }}</span>
          </ng-template>
          <ng-template matTabContent>
            <lp-dialog-item-list
              [loading]="loading"
              [hasItems]="enrolled?.length"
              [emptyStateMessage]="'LEADER_PANEL.CHANNELS.DIALOG.ENROLLED.EMPTY_STATE'"
            >
              @for (item of enrolled; track item.id) {
                <lp-dialog-user-item [name]="item?.name" [avatar]="item?.avatar" [jobPosition]="item?.jobPosition">
                  <lp-pulses-counter [count]="item?.pulse_count" [total]="item?.total_pulse" />
                </lp-dialog-user-item>
              }
            </lp-dialog-item-list>
          </ng-template>
        </mat-tab>

        <mat-tab id="pulses">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2 s-4">track_changes</mat-icon>
            <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.PULSE_IN_CHANNEL.LABEL' | transloco }}</span>
          </ng-template>
          <ng-template matTabContent>
            <lp-dialog-item-list
              [loading]="loading"
              [hasItems]="pulses?.length"
              [emptyStateMessage]="'LEADER_PANEL.CHANNELS.DIALOG.PULSES.EMPTY_STATE'"
            >
              @for (item of pulses; track item.id) {
                <lp-dialog-learn-content-item [name]="item?.name" learn_content_type="pulse">
                  <span class="text-2xxs font-bold opacity-70 leading-none">{{ item?.duration | kpDuration }}</span>
                  <div class="flex items-center opacity-70 gap-1">
                    <mat-icon class="s-4">visibility</mat-icon>
                    <span class="text-2xxs font-bold leading-none">{{ item?.views }}</span>
                  </div>
                </lp-dialog-learn-content-item>
              }
            </lp-dialog-item-list>
          </ng-template>
        </mat-tab>

        <mat-tab id="not-enrolled">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2 s-4">person_off</mat-icon>
            <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.NOT_REGISTERED.LABEL' | transloco }}</span>
          </ng-template>
          <ng-template matTabContent>
            <lp-dialog-item-list
              [loading]="loading"
              [hasItems]="notEnrolled?.length"
              [emptyStateMessage]="'LEADER_PANEL.CHANNELS.DIALOG.NOT_ENROLLED.EMPTY_STATE'"
            >
              @for (item of notEnrolled; track item.id) {
                <lp-dialog-user-item [name]="item?.name" [avatar]="item?.avatar" [jobPosition]="item?.jobPosition">
                </lp-dialog-user-item>
              }
            </lp-dialog-item-list>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .channel-info {
        @apply rounded-lg p-3.5 w-full mb-5;

        background-color: var(--mat-sys-surface-container-low);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelDialogComponent implements OnDestroy {
  readonly vm: Signal<ChannelDialogViewModel>;

  constructor(private readonly store: Store) {
    store.dispatch(ChannelDialogActions.fetchData());
    this.vm = toSignal(this.store.select(channelDialogFeature.selectViewModel));
  }

  ngOnDestroy() {
    this.store.dispatch(ChannelDialogActions.resetState());
  }
}
