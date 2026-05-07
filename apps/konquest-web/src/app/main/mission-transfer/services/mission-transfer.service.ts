import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MissionAPI, UserService } from '@core/api';
import {
  MyAccountV2Pagination,
  User,
  WorkspaceApi,
  WorkspaceBasicDto,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { TransferDialogFilterRecipient } from 'app/shared/components/transfer-dialog-filter/transfer-dialog-filter-recipient';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MissionTransferDialogComponent } from '../components/mission-transfer-dialog/mission-transfer-dialog.component';
import { MissionTransferStep, MissionTransferType } from '../models';
import { MissionTransferActions } from '../store';
import { environment } from 'environments/environment';

export interface TransferDto {
  missionId: string;
  transferType: MissionTransferType;
  newOwnerId?: string;
  targetWorkspaceId?: string;
}

@Injectable()
export class MissionTransferService {
  private _dialogRef!: MatDialogRef<MissionTransferDialogComponent> | undefined;

  static getNextAction(
    currentStep: MissionTransferStep,
    hasRecipient: boolean,
    transferType: MissionTransferType | null,
  ) {
    const actionMap = {
      [MissionTransferStep.SELECT_RECIPIENT]: MissionTransferActions.setStep({
        step: MissionTransferStep.CONFIRMATION,
      }),
      [MissionTransferStep.CONFIRMATION]: MissionTransferActions.executeTransfer(),
      noRecipientSelected: MissionTransferActions.setStep({ step: MissionTransferStep.SELECT_RECIPIENT }),
    };

    if (!hasRecipient && transferType !== MissionTransferType.SHARE) {
      return actionMap.noRecipientSelected;
    }

    return actionMap[currentStep];
  }

  static getPreviousAction(currentStep: MissionTransferStep) {
    const actionMap = {
      [MissionTransferStep.SELECT_RECIPIENT]: MissionTransferActions.closeDialog(),
      [MissionTransferStep.CONFIRMATION]: MissionTransferActions.setStep({
        step: MissionTransferStep.SELECT_RECIPIENT,
      }),
    };

    return actionMap[currentStep];
  }

  static mapToRecipient(response: MyAccountV2Pagination<User>): TransferDialogFilterRecipient[] {
    if (!response?.data) {
      return [];
    }
    return response.data?.map(({ id, name, avatar }) => ({ id, name, avatar }));
  }

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _userService: UserService,
    private readonly _missionApi: MissionAPI,
    private readonly _messageService: KpMessageService,
    private readonly _workspaceService: WorkspaceService,
    private readonly _workspaceApi: WorkspaceApi,
  ) {}

  openDialog(): void {
    this._dialogRef = this._dialog.open(MissionTransferDialogComponent, {
      minWidth: '300px',
      width: '40vw',
    });
  }

  closeDialog(): void {
    this._dialogRef?.close();
    this._dialogRef = undefined;
  }

  filterRecipients(
    searchTerm: string,
    transferType: MissionTransferType | null,
    workspaceId?: string,
  ): Observable<TransferDialogFilterRecipient[]> {
    const queryParams = {
      'filter.roles.role.id': `$in:${this.getFilterRoles(transferType)}`,
      limit: 15,
      search: searchTerm,
      'filter.status': '$eq:true',
    };

    return this._userService.fetchByQuery(queryParams, workspaceId).pipe(map(MissionTransferService.mapToRecipient));
  }

  loadUserWorkspaces(transferType: MissionTransferType | null): Observable<WorkspaceBasicDto[]> {
    const currentWorkspaceID = this._workspaceService.currentWorkspaceId;
    const konquestAppId = environment.apps.konquest.id;
    const roleIds = this.getFilterRoles(transferType);

    const params = {
      select: 'id,name,iconUrl',
      'filter.serviceWorkspaces.status': true,
      'filter.userRoleWorkspaces.role.applicationId': `$eq:${konquestAppId}`,
      'filter.userRoleWorkspaces.role.id': `$in:${roleIds}`,
    };

    return this._workspaceApi
      .getWorkspacesWithQuery(params)
      .pipe(map((result) => result?.data?.filter((workspace) => workspace.id !== currentWorkspaceID)));
  }

  executeTransfer(transferDto: TransferDto): Observable<any> {
    const workspace = transferDto.targetWorkspaceId ?? this._workspaceService.currentWorkspaceId;
    const transferMap = new Map<string, Observable<any>>();
    transferMap.set(
      MissionTransferType.TRANSFER,
      this.transferMission(transferDto.missionId, workspace, transferDto.newOwnerId),
    );
    transferMap.set(
      MissionTransferType.DUPLICATE,
      this.duplicateMission(transferDto.missionId, workspace, transferDto.newOwnerId),
    );
    transferMap.set(MissionTransferType.SHARE, this.shareMission(transferDto.missionId, workspace));
    return transferMap.get(transferDto.transferType);
  }

  private transferMission(missionId: string, targetWorkspaceId: string, newOwnerId: string): Observable<any> {
    return this._missionApi.transferMission(missionId, targetWorkspaceId, newOwnerId).pipe(
      tap(() => this._messageService.success('MISSION.TRANSFER_DIALOG.SUCCESS.TRANSFER')),
      catchError((error) => this.handleErro(error)),
    );
  }

  private duplicateMission(missionId: string, targetWorkspaceId: string, newOwnerId: string): Observable<any> {
    return this._missionApi.duplicateMission(missionId, targetWorkspaceId, newOwnerId).pipe(
      tap(() => this._messageService.success('MISSION.TRANSFER_DIALOG.SUCCESS.DUPLICATE')),
      catchError((error) => this.handleErro(error)),
    );
  }

  private shareMission(missionId: string, targetWorkspaceId: string): Observable<any> {
    return this._missionApi.shareMission(missionId, targetWorkspaceId).pipe(
      tap(() => this._messageService.success('MISSION.TRANSFER_DIALOG.SUCCESS.SHARE')),
      catchError((error) => this.handleErro(error)),
    );
  }

  private handleErro(error: any): any {
    this._messageService.error(error?.detail ?? error);
    return of(error);
  }

  private getFilterRoles(transferType: MissionTransferType | null): string[] {
    const superAdminRoleId = 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6';
    const adminRoleId = '297a88de-c34b-4661-be8a-7090fa9a89e5';
    const contentCreatorRoleId = '97f4a026-f727-4e23-bdf9-971fec7ce20e';
    const userRoleId = 'a6d23aea-807e-4374-964e-c725b817742d';

    const transferRoleMap: Record<MissionTransferType, string[]> = {
      [MissionTransferType.DUPLICATE]: [superAdminRoleId, adminRoleId, contentCreatorRoleId],
      [MissionTransferType.TRANSFER]: [superAdminRoleId, adminRoleId, contentCreatorRoleId],
      [MissionTransferType.SHARE]: [superAdminRoleId, adminRoleId, contentCreatorRoleId, userRoleId],
    };

    return (transferType && transferRoleMap[transferType]) || [''];
  }
}
