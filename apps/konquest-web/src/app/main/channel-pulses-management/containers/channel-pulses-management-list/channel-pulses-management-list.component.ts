import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChannelPulsesManagementViewModel, PulseManagementItem } from '../../models/channel-pulses-management.model';
import { ChannelPulsesManagementActions } from '../../store/actions';
import { channelPulsesManagementFeature } from '../../store/features';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-channel-pulses-management-list',
  imports: [
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslocoModule,
    NgxSkeletonLoaderModule,
    DatePipe,
  ],
  templateUrl: './channel-pulses-management-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelPulsesManagementListComponent {
  protected readonly vm: Signal<ChannelPulsesManagementViewModel>;
  protected readonly displayedColumns = ['icon', 'name', 'pulse_type', 'creator_name', 'published_date', 'menu'];

  private readonly baseLoaderTheme = { width: '100%', borderRadius: '0' };
  protected readonly headerLoaderTheme = { ...this.baseLoaderTheme, height: '48px' };
  protected readonly itemsLoaderTheme = { ...this.baseLoaderTheme, height: '60px' };

  constructor(private readonly store: Store) {
    this.vm = toSignal(store.select(channelPulsesManagementFeature.selectViewModel));
  }

  onEditPulse(pulse: PulseManagementItem): void {
    this.store.dispatch(ChannelPulsesManagementActions.editPulse({ pulseId: pulse.id }));
  }

  onEditContent(pulse: PulseManagementItem): void {
    this.store.dispatch(
      ChannelPulsesManagementActions.editContent({ pulseId: pulse.id, pulseTypeName: pulse.pulse_type.name }),
    );
  }

  onToggleActivation(pulse: PulseManagementItem): void {
    this.store.dispatch(
      ChannelPulsesManagementActions.toggleActivation({ pulseId: pulse.id, isActive: pulse.is_active }),
    );
  }

  onDeletePulse(pulse: PulseManagementItem): void {
    this.store.dispatch(ChannelPulsesManagementActions.deletePulse({ pulseId: pulse.id }));
  }
}
