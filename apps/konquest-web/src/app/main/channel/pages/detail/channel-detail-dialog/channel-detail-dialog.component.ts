import { ChangeDetectionStrategy, Component, computed, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Channel } from 'app/main/channel/channel.model';
import { ChannelDetailSelectors } from 'app/main/channel/pages/detail/store/selectors';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpEditorComponent } from '@keeps-platform-frontend-workspace/ui/kp-editor';
import { MatIcon } from '@angular/material/icon';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDivider } from '@angular/material/divider';
import { ChannelDetailActions } from 'app/main/channel/pages/detail/store/actions';

@Component({
  selector: 'app-channel-detail-dialog',
  imports: [
    CommonModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    TranslocoPipe,
    MatButton,
    KpEditorComponent,
    MatIconButton,
    MatIcon,
    MatDivider,
  ],
  template: `
    <div mat-dialog-title class="text-2xl flex justify-between">
      <h1>{{ 'CHANNEL.DETAIL.DESCRIPTION' | transloco }}</h1>

      @if (!canEdit()) {
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      }
    </div>

    @if (!canEdit()) {
      <div mat-dialog-content class="text-default">
        <p [innerHTML]="description()" class="ck-editor"></p>
        <mat-divider></mat-divider>
        <p class="mt-2">
          <span class="font-bold">{{ 'CHANNEL.DETAIL.CREATED_BY' | transloco }}:&nbsp;</span>{{ creator() }}
        </p>
        <p>
          <span class="font-bold">{{ 'CHANNEL.DETAIL.CREATED_IN' | transloco }} :&nbsp;</span
          >{{ createdDate() | date: 'shortDate' }}
        </p>
      </div>
    } @else {
      <div mat-dialog-content class="text-default">
        <kp-editor [value]="description()" (valueChange)="onValueChange($event)"></kp-editor>
      </div>
      <mat-dialog-actions align="end">
        <button mat-stroked-button mat-dialog-close class="mr-2">
          {{ 'GENERAL.CANCEL' | transloco }}
        </button>
        <button mat-flat-button color="primary" (click)="saveEdition()" [disabled]="disableSave()">
          {{ 'GENERAL.SAVE' | transloco }}
        </button>
      </mat-dialog-actions>
    }
  `,
  styles: `
    :host {
      overflow-wrap: break-word;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelDetailDialogComponent {
  protected readonly editorValue = signal<string>('');
  protected readonly disableSave = signal(true);
  protected readonly canEdit: Signal<boolean>;
  protected readonly description: Signal<string>;
  protected readonly creator: Signal<string>;
  protected readonly createdDate: Signal<string>;

  private readonly channel: Signal<Channel>;
  private readonly isSuperAdmin: Signal<boolean>;

  constructor(
    private readonly store: Store,
    private userProfileService: UserProfileService,
  ) {
    this.channel = toSignal(this.store.select(ChannelDetailSelectors.selectChannelDetail));
    this.isSuperAdmin = toSignal(this.userProfileService.isSuperAdmin$());

    this.canEdit = computed(() => {
      const channel = this.channel();
      return channel?.is_owner ?? channel?.is_contributor ?? this.isSuperAdmin();
    });

    this.description = computed(() => {
      const channel = this.channel();
      return channel?.description;
    });

    this.creator = computed(() => {
      const channel = this.channel();
      return channel?.user_creator?.name;
    });

    this.createdDate = computed(() => {
      const channel = this.channel();
      return channel?.created_date as string;
    });
  }

  saveEdition() {
    const description = this.editorValue();
    this.store.dispatch(ChannelDetailActions.updateChannelDescription({ description }));
  }

  onValueChange(value: string) {
    this.disableSave.set(false);
    this.editorValue.set(value);
  }
}
