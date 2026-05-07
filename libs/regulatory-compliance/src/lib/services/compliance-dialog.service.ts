import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import { ComplianceListItem } from '../models';
import { CompliancesFilterDto, RegulatoryComplianceApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Update } from '@ngrx/entity';
import { ComplianceDialogComponent } from '../containers';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

@Injectable()
export class ComplianceDialogService {
  static getBatchSelectUpdate(listItems: ComplianceListItem[], selected: boolean): Update<ComplianceListItem>[] {
    return listItems.map((item) => ({ id: item.id, changes: { selected } }));
  }

  private readonly SUCCESS_SAVE_MESSAGE = marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.SAVE.SUCCESS');
  private readonly FAILURE_SAVE_MESSAGE = marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.SAVE.FAILURE');
  private readonly FAILURE_SAVE_MESSAGE_COMPLIANCE_ALREADY_EXISTS = marker(
    'REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.SAVE.FAILURE_COMPLIANCE_ALREADY_EXISTS',
  );

  private readonly SUCCESS_DELETE_MESSAGE = marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.DELETE.SUCCESS');
  private readonly FAILURE_DELETE_MESSAGE = marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.DELETE.FAILURE');

  constructor(
    private _dialog: MatDialog,
    private messageService: KpMessageService,
    private regulatoryComplianceApi: RegulatoryComplianceApi,
  ) {}

  openDialog(): Observable<any> {
    return this._dialog
      .open(ComplianceDialogComponent, { width: '90vw', maxWidth: 500, autoFocus: 'first-heading' })
      .afterClosed();
  }

  openDeleteConfirmationDialog(multiple = false): Observable<boolean> {
    const title = multiple
      ? marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.DELETE.TITLE.PLURAL')
      : marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.DELETE.TITLE.SINGULAR');
    const message = multiple
      ? marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.DELETE.MESSAGE.PLURAL')
      : marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.DELETE.MESSAGE.SINGULAR');

    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { maxWidth: 367 });
    dialogRef.componentInstance.confirmTitle = title;
    dialogRef.componentInstance.confirmMessage = message;
    dialogRef.componentInstance.positiveButtonLabel = marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.ACTIONS.DELETE');
    dialogRef.componentInstance.negativeButtonLabel = marker('REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.ACTIONS.LEAVE');

    return dialogRef.afterClosed();
  }

  loadCompliance(filter: CompliancesFilterDto) {
    return this.regulatoryComplianceApi.getCompliances(filter);
  }

  addCompliance(name: string) {
    return this.regulatoryComplianceApi.createCompliance(name).pipe(
      tap({
        next: () => this.messageService.success(this.SUCCESS_SAVE_MESSAGE),
        error: (error) =>
          error.status === 409
            ? this.messageService.error(this.FAILURE_SAVE_MESSAGE_COMPLIANCE_ALREADY_EXISTS)
            : this.messageService.error(this.FAILURE_SAVE_MESSAGE),
      }),
    );
  }

  updateCompliance(id: string, name: string) {
    return this.regulatoryComplianceApi.updateCompliance(name, id).pipe(
      tap({
        next: () => this.messageService.success(this.SUCCESS_SAVE_MESSAGE),
        error: () => this.messageService.error(this.FAILURE_SAVE_MESSAGE),
      }),
    );
  }

  deleteCompliance(id: string): Observable<any> {
    return this.regulatoryComplianceApi.deleteCompliance(id).pipe(
      tap({
        next: () => this.messageService.success(this.SUCCESS_DELETE_MESSAGE),
        error: () => this.messageService.error(this.FAILURE_DELETE_MESSAGE),
      }),
    );
  }

  batchDeleteCompliance(ids: string[]) {
    return this.regulatoryComplianceApi.batchDeleteCompliances(ids).pipe(
      tap({
        next: () => this.messageService.success(this.SUCCESS_DELETE_MESSAGE),
        error: () => this.messageService.error(this.FAILURE_DELETE_MESSAGE),
      }),
    );
  }
}
