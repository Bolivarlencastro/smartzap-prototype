import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'pm-dispatch-summary',
  imports: [TranslocoPipe, MatIcon, DatePipe],
  template: `
    <div class="summary-card flex flex-col gap-5 p-5 rounded-2xl border border-default h-full">
      <div class="flex items-center gap-2">
        <mat-icon class="text-green-600 w-5 h-5 text-xl leading-none">check_circle</mat-icon>
        <span class="text-lg font-bold">{{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.TITLE' | transloco }}</span>
      </div>

      <div class="grid grid-cols-2 gap-x-6 gap-y-5">
        <div class="flex flex-col gap-1">
          <span class="text-2xxs font-bold opacity-60 uppercase tracking-wide">
            {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.TEMPLATE' | transloco }}
          </span>
          <span class="template-link text-sm font-semibold">{{ templateName }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-2xxs font-bold opacity-60 uppercase tracking-wide">
            {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.DESTINATION' | transloco }}
          </span>
          <span class="text-sm font-medium">{{ destination }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-2xxs font-bold opacity-60 uppercase tracking-wide">
            {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.TOTAL_RECIPIENTS' | transloco }}
          </span>
          <span class="text-sm font-medium">
            {{ contactsCount }} {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.CONTACTS' | transloco }}
          </span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-2xxs font-bold opacity-60 uppercase tracking-wide">
            {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.START_FORECAST' | transloco }}
          </span>
          <span class="text-sm font-medium">{{ startDate | date: 'dd/MM/yyyy, HH:mm:ss' }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-1 border-t border-default pt-4 mt-auto">
        <span class="text-2xxs font-bold opacity-60 uppercase tracking-wide">
          {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.ESTIMATED_COST' | transloco }}
        </span>
        <span class="text-3xl font-bold">{{ estimatedCost }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .summary-card {
        background-color: var(--mat-sys-surface);
        box-shadow: 0 0.0625rem 0.25rem 0 rgba(0, 0, 0, 0.06);
      }

      .template-link {
        color: var(--mat-sys-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmDispatchSummaryComponent {
  templateName = 'Lançamento - Tom de exclusividade';
  destination = 'ARGUMENTOS DE VENDA- SEGURO RESIDENCIAL';
  contactsCount = 4;
  startDate = new Date();
  estimatedCost = 'R$ 145,00';
}
