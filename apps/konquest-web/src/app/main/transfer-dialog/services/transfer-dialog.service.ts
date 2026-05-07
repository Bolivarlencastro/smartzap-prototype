import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChannelApi, UserService } from '@core/api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TransferDialogComponent } from '../components/transfer-dialog/transfer-dialog.component';
import { Recipient, TransferContentType, TransferDialogData, TransferStep } from '../models';
import { TransferDialogActions } from '../store/actions';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { WorkspaceService, User, MyAccountV2Pagination } from '@keeps-platform-frontend-workspace/kp-keeps';

@Injectable({ providedIn: 'root' })
export class TransferDialogService {
  private _dialogRef: MatDialogRef<TransferDialogComponent> | undefined;

  static getNextAction(currentStep: TransferStep, hasRecipient: boolean) {
    const actionMap = {
      [TransferStep.SELECT_RECIPIENT]: TransferDialogActions.setCurrentStep({ step: TransferStep.CONFIRMATION }),
      [TransferStep.CONFIRMATION]: TransferDialogActions.executeTransfer(),
      noRecipientSelected: TransferDialogActions.setCurrentStep({ step: TransferStep.SELECT_RECIPIENT }),
    };

    if (!hasRecipient) {
      return actionMap.noRecipientSelected;
    }

    return actionMap[currentStep];
  }

  static getPreviousAction(currentStep: TransferStep) {
    const actionMap = {
      [TransferStep.SELECT_RECIPIENT]: TransferDialogActions.closeDialog(),
      [TransferStep.CONFIRMATION]: TransferDialogActions.setCurrentStep({ step: TransferStep.SELECT_RECIPIENT }),
    };

    return actionMap[currentStep];
  }

  static mapToRecipient(response: MyAccountV2Pagination<User>): Recipient[] {
    if (!response) {
      return [];
    }
    const { data } = response;
    return data?.map(({ id, name, avatar }) => ({ id, name, avatar })) || [];
  }

  constructor(
    private _dialog: MatDialog,
    private _userService: UserService,
    private _channelApi: ChannelApi,
    private _learningTrailApi: LearningTrailAPI,
    private _messageService: KpMessageService,
    private _workspaceService: WorkspaceService,
  ) {}

  openDialog(data: TransferDialogData): void {
    this._dialogRef = this._dialog.open(TransferDialogComponent, {
      minWidth: '300px',
      width: '40vw',
      data,
    });
  }

  closeDialog(): void {
    this._dialogRef?.close();
    this._dialogRef = undefined;
  }

  filterRecipients(searchTerm: string): Observable<Recipient[]> {
    // Roles for admins, super admins and content curators
    const recipientRolesIDs = [
      '297a88de-c34b-4661-be8a-7090fa9a89e5',
      'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
      '97f4a026-f727-4e23-bdf9-971fec7ce20e',
    ];

    const queryParams = {
      'filter.roles.role.id': `$in:${recipientRolesIDs}`,
      limit: 15,
      search: searchTerm,
      'filter.status': '$eq:true',
    };
    return this._userService.fetchByQuery(queryParams).pipe(map(TransferDialogService.mapToRecipient));
  }

  executeTransfer(transferDialogData: TransferDialogData, recipient: Recipient): Observable<any> {
    const contentId = transferDialogData.transferContent.id;
    const contentType = transferDialogData.contentType;

    const transferMap = {
      [TransferContentType.CHANNEL]: this.transferChannel(contentId, recipient.id),
      [TransferContentType.LEARNING_TRAIL]: this.transferLearningTrail(contentId, recipient.id),
    };

    return transferMap[contentType];
  }

  private transferChannel(channelId: string, newOwnerId: string): Observable<any> {
    return this._channelApi.transferChannel(channelId, newOwnerId).pipe(
      tap({
        next: () => this._messageService.success(marker('TRANSFER_DIALOG.SUCCESS.CHANNEL')),
        error: (error) => this._messageService.error(error.detail),
      }),
    );
  }

  private transferLearningTrail(trailId: string, newOwnerId: string): Observable<any> {
    const workspaceId = this._workspaceService.currentWorkspaceId;
    return this._learningTrailApi.transferLearningTrial(trailId, newOwnerId, workspaceId).pipe(
      tap({
        next: () => this._messageService.success(marker('TRANSFER_DIALOG.SUCCESS.LEARNING_TRAIL')),
        error: (error) => this._messageService.error(error.detail),
      }),
    );
  }
}
