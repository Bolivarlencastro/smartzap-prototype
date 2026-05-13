import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { EnrollmentsStatistics } from '../../store/reducers/enrollments.reducer';
import { State as BillingState } from 'app/shared/store/reducers/billing.reducer';

const TIER_OVERAGE_RATES: Record<string, { utility: number; marketing: number }> = {
  starter: { utility: 0.46, marketing: 1.21 },
  growth: { utility: 0.38, marketing: 1.05 },
  scale: { utility: 0.34, marketing: 0.94 },
};

@Component({
  selector: 'app-enrollments-side-menu',
  templateUrl: './enrollments-side-menu.component.html',
  imports: [MatDivider, MatIcon, MatIconButton, TranslocoPipe, CurrencyPipe],
})
export class EnrollmentsSideMenuComponent {
  @Input() statistics: EnrollmentsStatistics | null = null;
  @Input() billing: BillingState | null = null;
  @Output() closeMenu = new EventEmitter<void>();

  get utilityConsumed(): number {
    return this.billing?.utility?.consumed ?? 0;
  }

  get utilityIncluded(): number {
    return this.billing?.utility?.included ?? 0;
  }

  get marketingConsumed(): number {
    return this.billing?.marketing?.consumed ?? 0;
  }

  get marketingIncluded(): number {
    return this.billing?.marketing?.included ?? 0;
  }

  get projectedOverageAmount(): number {
    const tierKey = this.billing?.tierName?.toLowerCase() || '';
    const rates = TIER_OVERAGE_RATES[tierKey];

    const currentUtilityExceeded = this.billing?.utility?.exceeded ?? 0;
    const currentMarketingExceeded = this.billing?.marketing?.exceeded ?? 0;
    const currentUtilityAmount =
      this.billing?.utility?.exceededAmount ?? (rates ? currentUtilityExceeded * rates.utility : 0);
    const currentMarketingAmount =
      this.billing?.marketing?.exceededAmount ?? (rates ? currentMarketingExceeded * rates.marketing : 0);

    if (!rates) {
      return currentUtilityAmount + currentMarketingAmount;
    }

    // Pending enrollment messages are projected as utility traffic for the current cycle.
    const projectedUtilityExceeded = Math.max(
      0,
      this.utilityConsumed + (this.statistics?.totalPendingMessages ?? 0) - this.utilityIncluded,
    );
    const additionalUtilityExceeded = Math.max(0, projectedUtilityExceeded - currentUtilityExceeded);

    return currentUtilityAmount + currentMarketingAmount + additionalUtilityExceeded * rates.utility;
  }
}
