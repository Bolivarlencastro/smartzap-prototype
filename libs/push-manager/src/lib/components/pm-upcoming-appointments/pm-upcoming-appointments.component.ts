import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppointmentModel } from '../../models/panel';

@Component({
  selector: 'pm-upcoming-appointments',
  imports: [MatIcon, TranslocoPipe, MatTableModule, MatButtonModule],
  template: `
    <div class="header">
      <mat-icon class="s-6">calendar_today</mat-icon>
      <span class="text-sm font-bold">{{ 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.TITLE' | transloco }}</span>
    </div>
    <mat-table [dataSource]="data()" class="kp-card-table">
      <ng-container matColumnDef="campaign">
        <mat-header-cell *matHeaderCellDef class="min-w-[110px]">
          <span class="header-row">{{ 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.CAMPAIGN' | transloco }}</span>
        </mat-header-cell>
        <mat-cell *matCellDef="let element" class="min-w-[110px]">
          <span class="break-words line-clamp-2 font-bold text-base">
            {{ element?.campaign }}
          </span>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="date">
        <mat-header-cell *matHeaderCellDef class="min-w-[160px] max-w-[160px]">
          <span class="header-row">{{ 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.DATE' | transloco }}</span>
        </mat-header-cell>
        <mat-cell *matCellDef="let element" class="min-w-[160px] max-w-[160px] text-xs">
          {{ element?.date }}
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="contacts">
        <mat-header-cell *matHeaderCellDef class="min-w-[120px] max-w-[120px] justify-center">
          <span class="header-row">{{ 'PUSH_MANAGER.PANEL.UPCOMING_APPOINTMENTS.CONTACTS' | transloco }}</span>
        </mat-header-cell>
        <mat-cell *matCellDef="let element" class="min-w-[120px] max-w-[120px] text-xs font-bold justify-center">
          {{ element?.contacts }}
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="menu">
        <mat-header-cell *matHeaderCellDef class="min-w-[70px] max-w-[70px]"> </mat-header-cell>
        <mat-cell *matCellDef="let element" class="min-w-[70px] max-w-[70px]">
          <button matIconButton (click)="onRemovePush(element.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns" class="h-12"></mat-row>
    </mat-table>
  `,
  styles: [
    `
      :host {
        @apply flex flex-col border border-default rounded-xl overflow-hidden;
      }

      .header {
        @apply flex items-center h-12 gap-3 py-3.5 px-5 border-b border-default;
        background-color: var(--mat-sys-surface-container);
      }

      .header-row {
        @apply opacity-50 text-xs font-bold;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmUpcomingAppointmentsComponent {
  data = input<AppointmentModel[]>();
  removePush = output<string>();

  protected readonly displayedColumns: string[] = ['campaign', 'date', 'contacts', 'menu'];

  onRemovePush(id: string) {
    this.removePush.emit(id);
  }
}
