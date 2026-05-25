import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { SummaryModel } from '../../models/panel';

@Component({
  selector: 'pm-panel-side-menu',
  imports: [MatDivider, MatIcon, MatIconButton, TranslocoPipe, DecimalPipe],
  template: `
    <div class="h-full w-80 flex flex-col">
      <div class="h-32 pl-8 pr-6 flex items-center">
        <div class="flex flex-col gap-1">
          <span class="mb-2">{{ 'PUSH_MANAGER.PANEL.SIDE_MENU.TITLE' | transloco }}</span>
          <span class="text-xs opacity-60">{{ 'PUSH_MANAGER.PANEL.SIDE_MENU.SUBTITLE' | transloco }}</span>
        </div>
        <button mat-icon-button class="ml-auto" (click)="closeMenu.emit()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="flex-1 pt-6 px-6 flex flex-col gap-3 overflow-y-auto">
        <div class="min-h-14 pl-6 py-3 w-full rounded-md border border-default flex items-center gap-3">
          <mat-icon class="s-6 text-primary shrink-0">notifications</mat-icon>
          <div class="flex flex-col leading-tight">
            <span class="font-medium">{{ summary()?.pushCount | number: '1.0-0' }}</span>
            <span class="text-xs opacity-60">{{ 'PUSH_MANAGER.PANEL.SUMMARY_CARD.TOTAL_SENDS' | transloco }}</span>
          </div>
        </div>

        <div class="min-h-14 pl-6 py-3 w-full rounded-md border border-default flex items-center gap-3">
          <mat-icon class="s-6 text-primary shrink-0">attach_money</mat-icon>
          <div class="flex flex-col leading-tight">
            <span class="font-medium">R$ {{ summary()?.totalInvestiment | number: '1.2-2' }}</span>
            <span class="text-xs opacity-60">{{
              'PUSH_MANAGER.PANEL.SUMMARY_CARD.TOTAL_INVESTIMENT' | transloco
            }}</span>
          </div>
        </div>

        <div class="min-h-14 pl-6 py-3 w-full rounded-md border border-default flex items-center gap-3">
          <mat-icon class="s-6 text-primary shrink-0">account_balance_wallet</mat-icon>
          <div class="flex flex-col leading-tight">
            <span class="font-medium">R$ {{ summary()?.currentBalance | number: '1.2-2' }}</span>
            <span class="text-xs opacity-60">{{ 'PUSH_MANAGER.PANEL.SUMMARY_CARD.ROI_ENROLLMENT' | transloco }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmPanelSideMenuComponent {
  summary = input<SummaryModel | null>(null);
  closeMenu = output<void>();
}
