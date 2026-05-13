import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
  MatDialogClose,
} from '@angular/material/dialog';
import { State as Billing } from 'app/shared/store/reducers/billing.reducer';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'billing-dialog',
  templateUrl: './billing-dialog.component.html',
  imports: [
    CdkScrollable,
    MatDialogContent,
    MatDialogTitle,
    MatDialogClose,
    MatIconButton,
    MatIcon,
    TranslocoPipe,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
  ],
  styles: [
    `
      .summary-grid,
      .stats-grid {
        display: grid;
        gap: 16px;
      }

      .summary-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .stat-card {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 8px;
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        padding: 20px 16px;
        text-align: left;
      }

      .stat-card-label {
        font-size: 13px;
        font-weight: 600;
        color: rgb(107 114 128);
      }

      .stat-card-value {
        font-size: 24px;
        font-weight: 700;
      }

      .stat-card-sub {
        font-size: 13px;
        color: rgb(107 114 128);
      }

      .stat-card-meta {
        display: grid;
        width: 100%;
        gap: 10px;
        margin-top: 6px;
      }

      .stat-card-meta-row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        font-size: 14px;
      }

      .stat-card-meta-label {
        color: rgb(107 114 128);
      }

      .stat-card-meta-value {
        font-weight: 600;
      }

      .stat-card-meta-value.is-alert {
        color: rgb(220 38 38);
      }

      .tracking-table-shell {
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        overflow: hidden;
      }

      .billing-table-header {
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }

      @media (max-width: 768px) {
        .summary-grid,
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BillingDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public billing$: Observable<Billing>,
    public dialogRef: MatDialogRef<BillingDialogComponent>,
  ) {}
}
