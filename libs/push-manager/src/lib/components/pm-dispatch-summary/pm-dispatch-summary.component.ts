import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
          <span class="template-link text-sm font-semibold">{{ templateName() }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-2xxs font-bold opacity-60 uppercase tracking-wide">
            {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.DESTINATION' | transloco }}
          </span>
          <span class="text-sm font-medium">{{ destination() }}</span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-2xxs font-bold opacity-60 uppercase tracking-wide">
            {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.TOTAL_RECIPIENTS' | transloco }}
          </span>
          <span class="text-sm font-medium">
            {{ contactsCount() }} {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.CONTACTS' | transloco }}
          </span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-2xxs font-bold opacity-60 uppercase tracking-wide">
            {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.START_FORECAST' | transloco }}
          </span>
          <span class="text-sm font-medium">{{ startDate() | date: 'dd/MM/yyyy, HH:mm:ss' }}</span>
        </div>
      </div>

      <div class="flex justify-between items-center border-t border-default pt-4 mt-auto">
        <div class="flex flex-col gap-1">
          <span class="text-2xxs font-bold opacity-60 uppercase tracking-wide">
            {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.ESTIMATED_COST' | transloco }}
          </span>
          <span class="text-3xl font-bold">{{ formattedCost() }}</span>
        </div>

        @if (hasSufficientBalance()) {
          <div class="balance-available flex items-center gap-1 px-3 py-1 rounded-full">
            <mat-icon class="w-4 h-4 text-base leading-none">attach_money</mat-icon>
            <span class="text-2xxs font-bold uppercase tracking-wide">
              {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.SUFFICIENT_BALANCE' | transloco }}
            </span>
          </div>
        } @else {
          <div class="balance-unavailable flex items-center gap-1 px-3 py-1 rounded-full">
            <mat-icon class="w-4 h-4 text-base leading-none">attach_money</mat-icon>
            <span class="text-2xxs font-bold uppercase tracking-wide">
              {{ 'PUSH_MANAGER.CREATION.REVIEW.SUMMARY.INSUFFICIENT_BALANCE' | transloco }}
            </span>
          </div>
        }
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

      .balance-available {
        background-color: color-mix(in srgb, var(--mat-sys-primary) 12%, transparent);
        color: var(--mat-sys-primary);
      }

      .balance-unavailable {
        background-color: rgba(239, 68, 68, 0.12);
        color: rgb(185, 28, 28);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmDispatchSummaryComponent {
  templateName = input<string>('');
  destination = input<string>('');
  contactsCount = input<number>(0);
  startDate = input<Date | null>(null);
  estimatedCost = input<string>('');
  hasSufficientBalance = input<boolean>(true);

  formattedCost = computed(() => {
    const raw = this.estimatedCost();
    if (!raw) {
      return '';
    }

    const num = Number.parseFloat(raw);

    if (Number.isNaN(num)) {
      return raw;
    }

    return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  });
}
