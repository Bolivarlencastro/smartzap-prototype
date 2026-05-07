import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatDialogClose, MatDialogTitle } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { Store } from '@ngrx/store';
import { DialogItemListComponent } from '../../components/dialog-tab-items/dialog-item-list.component';
import { DialogUserItemComponent } from '../../components/dialog-tab-items/dialog-user-item.component';
import { EventDialogViewModel } from '../../models/event-dialog';
import { EventDialogActions, eventDialogFeature } from '../../store/event';

@Component({
  selector: 'lp-event-dialog',
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
    DialogItemListComponent,
    DialogUserItemComponent,
    DatePipe,
    KpPluralizeTranslatePipe,
  ],
  template: `
    @let event = this.vm()?.event;
    @let loading = this.vm()?.loading;
    @let enrolled = this.vm()?.data?.enrolled;
    @let notEnrolled = this.vm()?.data?.notEnrolled;

    <div matDialogTitle class="flex justify-between items-center">
      <span class="text-xl">{{ 'LEADER_PANEL.EVENTS.DIALOG.TITLE' | transloco }}</span>
      <button matDialogClose matIconButton>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <div class="p-5">
      <div class="event-info">
        <div class="text-xl font-bold mb-2.5">{{ event?.event_name }}</div>
        <div class="flex items-center gap-1 text-xs">
          <mat-icon class="s-3 opacity-70">event</mat-icon>
          <span class="opacity-70">{{ event?.start_date | date: 'shortDate' }}</span>

          <mat-icon class="s-4 ml-2 opacity-70">group</mat-icon>
          <span class="opacity-70"
            >{{ event?.enrolled_count }}
            {{
              'LEADER_PANEL.EVENTS.DIALOG.ENROLLED_COUNT' | kpPluralizeTranslate: { value: event?.enrolled_count }
            }}</span
          >
        </div>
      </div>

      <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="0ms">
        <mat-tab id="enrolled">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2 s-4">group</mat-icon>
            <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.TEAM_PARTICIPANTS.LABEL' | transloco }}</span>
          </ng-template>
          <ng-template matTabContent>
            <lp-dialog-item-list
              [loading]="loading"
              [hasItems]="!!enrolled?.length"
              [emptyStateMessage]="'LEADER_PANEL.EVENTS.DIALOG.TEAM_PARTICIPANTS.EMPTY_STATE'"
            >
              @for (item of enrolled; track item.id) {
                <lp-dialog-user-item [name]="item?.name" [avatar]="item?.avatar" [jobPosition]="item?.jobPosition">
                </lp-dialog-user-item>
              }
            </lp-dialog-item-list>
          </ng-template>
        </mat-tab>

        <mat-tab id="not-enrolled">
          <ng-template mat-tab-label>
            <mat-icon class="mr-2 s-4">visibility_off</mat-icon>
            <span class="text-xs">{{ 'LEADER_PANEL.GENERAL.NOT_REGISTERED.LABEL' | transloco }}</span>
          </ng-template>
          <ng-template matTabContent>
            <lp-dialog-item-list
              [loading]="loading"
              [hasItems]="!!notEnrolled?.length"
              [emptyStateMessage]="'LEADER_PANEL.EVENTS.DIALOG.NOT_REGISTERED.EMPTY_STATE'"
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
      .event-info {
        @apply rounded-lg p-3.5 w-full mb-5;

        background-color: var(--mat-sys-surface-container-low);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDialogComponent implements OnDestroy {
  readonly vm: Signal<EventDialogViewModel>;

  constructor(private readonly store: Store) {
    store.dispatch(EventDialogActions.fetchData());
    this.vm = toSignal(this.store.select(eventDialogFeature.selectViewModel));
  }

  ngOnDestroy() {
    this.store.dispatch(EventDialogActions.resetState());
  }
}
