import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, output, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { ChannelPulsesManagementViewModel } from '../../models/channel-pulses-management.model';
import { channelPulsesManagementFeature } from '../../store/features';

@Component({
  selector: 'app-channel-pulses-management-header',
  imports: [MatIconModule, MatButtonModule, TranslocoModule],
  template: `
    <div class="flex items-center gap-2 w-full px-6 h-32 border-b border-default">
      <button matIconButton (click)="onGoBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span class="text-2xl font-normal flex-1">
        {{ vm()?.channelName }}
      </span>
      <button mat-flat-button (click)="createPulse.emit()">
        <mat-icon>add</mat-icon>
        {{ 'CHANNEL_PULSES_MANAGEMENT.NEW_PULSE' | transloco }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ChannelPulsesManagementHeaderComponent {
  readonly createPulse = output<void>();

  protected readonly vm: Signal<ChannelPulsesManagementViewModel>;

  constructor(
    private readonly store: Store,
    private readonly location: Location,
  ) {
    this.vm = toSignal(store.select(channelPulsesManagementFeature.selectViewModel));
  }

  onGoBack() {
    this.location.back();
  }
}
