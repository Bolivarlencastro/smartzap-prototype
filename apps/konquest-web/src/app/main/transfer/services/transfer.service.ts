import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KonquestAPI } from '@core/api';
import { Pagination } from '@keeps-platform-frontend-workspace/kp-keeps';
import { FuseLoadingService } from '@keeps-platform-frontend-workspace/layout';
import { TranslocoService } from '@jsverse/transloco';
import { FetchTransfersParams } from 'app/main/transfer/models/fetch-transfer-params';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, switchMap } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Transfer } from '../models/transfer.model';
import { TransferFilter } from 'app/main/transfer/models/transfer-filter';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpFilterSelectOption } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

@Injectable()
export class TransferService {
  constructor(
    private _http: KonquestAPI,
    private _dialog: MatDialog,
    private _fuseLoadingService: FuseLoadingService,
    private _messageService: KpMessageService,
    private _translateService: TranslocoService,
  ) {}

  private readonly basePath = '/missions';

  fetch(params: FetchTransfersParams): Observable<Pagination<Transfer>> {
    return this._http.get<Pagination<Transfer>>(`${this.basePath}/transactions`, params);
  }

  confirmCancel(id: string): Observable<void> {
    const dialogRef = this._dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', maxWidth: 512 });
    dialogRef.componentInstance.confirmTitle = 'TRANSFER.CANCEL.TITLE';
    dialogRef.componentInstance.confirmMessage = 'TRANSFER.CANCEL.MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel = 'TRANSFER.ACTION_BUTTON';
    dialogRef.componentInstance.negativeButtonLabel = 'TRANSFER.CANCEL.NEGATIVE_BUTTON';

    return dialogRef.afterClosed().pipe(
      filter((value) => value === true),
      switchMap(() => this.delete(id)),
    );
  }

  delete(id: string): Observable<void> {
    this._fuseLoadingService.show();
    return this._http.delete<void>(`${this.basePath}/transactions/${id}`).pipe(
      tap({
        next: () => {
          this._fuseLoadingService.hide();
          this._messageService.success(this._translateService.translate('TRANSFER.CANCEL.SUCCESS'));
        },
        error: () => {
          this._fuseLoadingService.hide();
          this._messageService.error(this._translateService.translate('TRANSFER.CANCEL.ERROR'));
        },
      }),
    );
  }

  static mapAutocompleteOptions(filter: any): TransferFilter {
    return {
      ...filter,
      source__in: filter.source__in?.map((option: KpFilterSelectOption) => option.value).join(',') || null,
      receiver__in: filter.receiver__in?.map((option: KpFilterSelectOption) => option.value).join(',') || null,
    };
  }
}
