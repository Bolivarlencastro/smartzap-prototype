import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, tap } from 'rxjs';
import { LinkCycleDialogComponent } from '../link-cycle-dialog.component';
import { RegulatoryComplianceApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class LinkCycleService {
  constructor(
    private _dialog: MatDialog,
    private regulatoryComplianceApi: RegulatoryComplianceApi,
    private messageService: KpMessageService,
  ) {}

  openDialog(): MatDialogRef<LinkCycleDialogComponent> {
    return this._dialog.open(LinkCycleDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });
  }

  getCycles(search: string) {
    return this.regulatoryComplianceApi.getCycles({ search, page: 1 }).pipe(map((response) => response.items));
  }

  linkEnrollmentToCycle(cycleId: string, enrollmentId: string) {
    return this.regulatoryComplianceApi.renewEnrollmentCycle(cycleId, enrollmentId).pipe(
      tap({
        next: () => this.messageService.success(marker('LINK_CYCLE.ENROLLMENT_LINKED_SUCCESSFULLY')),
        error: () => this.messageService.error(marker('LINK_CYCLE.ENROLLMENT_LINK_FAILURE')),
      }),
    );
  }
}
