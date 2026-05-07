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
import { AsyncPipe, DatePipe } from '@angular/common';
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
  ],
  styles: [
    `
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .stat-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        padding: 20px 16px;
        text-align: center;
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

      .tracking-table-shell {
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        overflow: hidden;
      }

      .billing-table-header {
        border-bottom: 1px solid var(--mat-sys-outline-variant);
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
