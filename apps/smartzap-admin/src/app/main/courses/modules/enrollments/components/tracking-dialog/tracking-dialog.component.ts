import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Enrollment } from 'app/main/courses/model';
import { RenewAccess } from 'app/main/courses/model/tracking';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe, DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { KpStatusChipComponent } from '@keeps-platform-frontend-workspace/ui/kp-status-chip';
import { MatTooltip } from '@angular/material/tooltip';
import { TrackingListComponent } from '../tracking-list/tracking-list.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpEnrollmentStatusColorPipe } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-status-color';
import { KpNormalizePercentPipe } from '@keeps-platform-frontend-workspace/ui/kp-normalize-percent';

@Component({
  selector: 'app-tracking-dialog',
  templateUrl: './tracking-dialog.component.html',
  styleUrls: ['./tracking-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    MatIconButton,
    MatDialogClose,
    MatIcon,
    MatDialogContent,
    KpStatusChipComponent,
    MatTooltip,
    TrackingListComponent,
    AsyncPipe,
    UpperCasePipe,
    DecimalPipe,
    DatePipe,
    TranslocoPipe,
    KpEnrollmentStatusColorPipe,
    KpNormalizePercentPipe,
  ],
})
export class TrackingDialogComponent implements OnInit, OnDestroy {
  public enrollment!: Enrollment | null;
  public datasource$!: Observable<any[]> | null;
  public isLoading$!: Observable<boolean> | null;
  public isVisibilitySendLink!: boolean | null;
  public lastAccess!: string;
  public destroyEvent = new EventEmitter<any>();
  public renewAccessSelected = new EventEmitter<RenewAccess>();

  ngOnInit(): void {
    this.setLastAccess();
  }

  ngOnDestroy(): void {
    this.destroyEvent.emit();
    this.datasource$ = null;
    this.enrollment = null;
    this.isLoading$ = null;
    this.isVisibilitySendLink = null;
  }

  public sendRenewAccessSelected(renewAccess: RenewAccess): void {
    this.renewAccessSelected.emit(renewAccess);
  }

  private setLastAccess(): void {
    this.datasource$?.pipe(takeUntil(this.destroyEvent.asObservable())).subscribe((trackings) => {
      this.lastAccess = [...trackings].sort((a, b) =>
        (b.last_access || '').localeCompare(a.last_access || ''),
      )[0]?.last_access;
    });
  }
}
