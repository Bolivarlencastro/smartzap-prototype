import { MatDialog } from '@angular/material/dialog';
import { MissionAPI, UserService } from '@core/api';
import { WorkspaceApi, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionTransferStep, MissionTransferType } from 'app/main/mission-transfer/models';
import { Mission } from 'app/main/mission/mission.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { EMPTY, of, throwError } from 'rxjs';
import { MissionTransferActions } from '../store';
import { MissionTransferService, TransferDto } from './mission-transfer.service';

const superAdminRoleId = 'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6';
const adminRoleId = '297a88de-c34b-4661-be8a-7090fa9a89e5';
const contentCreatorRoleId = '97f4a026-f727-4e23-bdf9-971fec7ce20e';
const userRoleId = 'a6d23aea-807e-4374-964e-c725b817742d';

const mockMission: Mission = {
  id: '1234',
  name: 'Teste',
};

const mockWorkspaceID = '123456';

describe('MissionTransferService', () => {
  let service: MissionTransferService;
  let userServiceSpy: jest.Mocked<UserService>;
  let messageServiceSpy: jest.Mocked<KpMessageService>;
  let missionApiSpy: jest.Mocked<MissionAPI>;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let dialogSpy: jest.Mocked<MatDialog>;
  let closeSpy: jest.Mock;
  let workspaceApiMock: jest.Mocked<WorkspaceApi>;

  beforeEach(() => {
    userServiceSpy = {
      fetchByQuery: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<UserService>;

    messageServiceSpy = { success: jest.fn(), error: jest.fn() } as any;
    missionApiSpy = {
      transferMission: jest.fn().mockReturnValue(of(EMPTY)),
      duplicateMission: jest.fn().mockReturnValue(of(EMPTY)),
      shareMission: jest.fn().mockReturnValue(of(EMPTY)),
    } as any;
    workspaceServiceMock = { currentWorkspaceId: mockWorkspaceID } as any;
    closeSpy = jest.fn();
    dialogSpy = { open: jest.fn().mockReturnValue({ close: closeSpy }) } as any;
    workspaceApiMock = {
      getWorkspacesWithQuery: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<WorkspaceApi>;

    service = new MissionTransferService(
      dialogSpy,
      userServiceSpy,
      missionApiSpy,
      messageServiceSpy,
      workspaceServiceMock,
      workspaceApiMock,
    );
  });

  it('should open the dialog', () => {
    service.openDialog();

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should close the dialog', () => {
    service.openDialog();
    service.closeDialog();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should filter recipients', (done) => {
    const mockSearchTerm = 'test_admin';
    const expectedQueryParams = {
      'filter.roles.role.id': `$in:${[superAdminRoleId, adminRoleId, contentCreatorRoleId, userRoleId]}`,
      limit: 15,
      search: mockSearchTerm,
      'filter.status': '$eq:true',
    };

    service.filterRecipients(mockSearchTerm, MissionTransferType.SHARE).subscribe(() => {
      expect(userServiceSpy.fetchByQuery).toHaveBeenCalledWith(expectedQueryParams, undefined);
      done();
    });
  });

  it('should load the current user workspaces with the correct params', (done) => {
    const expectedParams = {
      select: 'id,name,iconUrl',
      'filter.serviceWorkspaces.status': true,
      'filter.userRoleWorkspaces.role.applicationId': `$eq:0abf08ea-d252-4d7c-ab45-ab3f9135c288`,
      'filter.userRoleWorkspaces.role.id': `$in:${[superAdminRoleId, adminRoleId, contentCreatorRoleId, userRoleId]}`,
    };

    service.loadUserWorkspaces(MissionTransferType.SHARE).subscribe(() => {
      expect(workspaceApiMock.getWorkspacesWithQuery).toHaveBeenCalledWith(expectedParams);
      done();
    });
  });

  describe('executeTransfer', () => {
    const targetWorkspaceId = '654321';
    const newOwnerId = '98765';
    const mockError = { detail: 'detail_message' };

    describe('Same Workspace Tests', () => {
      const payload: TransferDto = {
        missionId: mockMission.id,
        transferType: MissionTransferType.TRANSFER,
        newOwnerId,
      };
      it('should transfer mission to same workspace', (done) => {
        service.executeTransfer(payload).subscribe(() => {
          expect(missionApiSpy.transferMission).toHaveBeenCalledWith(mockMission.id, mockWorkspaceID, newOwnerId);
          expect(messageServiceSpy.success).toHaveBeenCalledWith('MISSION.TRANSFER_DIALOG.SUCCESS.TRANSFER');
          done();
        });
      });

      it('should display an error message', (done) => {
        missionApiSpy.transferMission.mockReturnValue(throwError(() => mockError));

        service.executeTransfer(payload).subscribe({
          complete: () => {
            expect(messageServiceSpy.error).toHaveBeenCalledTimes(1);
            expect(messageServiceSpy.error).toHaveBeenCalledWith(mockError.detail);
            done();
          },
        });
      });
    });

    describe('Other Workspace Tests', () => {
      const payload: TransferDto = {
        missionId: mockMission.id,
        transferType: MissionTransferType.TRANSFER,
        newOwnerId,
        targetWorkspaceId,
      };
      it('should transfer mission to another workspace', (done) => {
        service.executeTransfer(payload).subscribe(() => {
          expect(missionApiSpy.transferMission).toHaveBeenCalledWith(mockMission.id, targetWorkspaceId, newOwnerId);
          expect(messageServiceSpy.success).toHaveBeenCalledWith('MISSION.TRANSFER_DIALOG.SUCCESS.TRANSFER');
          done();
        });
      });

      it('should display an error message', (done) => {
        missionApiSpy.transferMission.mockReturnValue(throwError(() => mockError));

        service.executeTransfer(payload).subscribe({
          complete: () => {
            expect(messageServiceSpy.error).toHaveBeenCalledTimes(1);
            expect(messageServiceSpy.error).toHaveBeenCalledWith(mockError.detail);
            done();
          },
        });
      });
    });

    describe('Duplicate Mission Tests', () => {
      const payload: TransferDto = {
        missionId: mockMission.id,
        transferType: MissionTransferType.DUPLICATE,
        newOwnerId,
        targetWorkspaceId,
      };

      it('should duplicate mission', (done) => {
        service.executeTransfer(payload).subscribe(() => {
          expect(missionApiSpy.duplicateMission).toHaveBeenCalledWith(mockMission.id, targetWorkspaceId, newOwnerId);
          expect(messageServiceSpy.success).toHaveBeenCalledWith('MISSION.TRANSFER_DIALOG.SUCCESS.DUPLICATE');
          done();
        });
      });

      it('should display an error message', (done) => {
        missionApiSpy.duplicateMission.mockReturnValue(throwError(() => mockError));

        service.executeTransfer(payload).subscribe({
          complete: () => {
            expect(messageServiceSpy.error).toHaveBeenCalledWith(mockError.detail);
            done();
          },
        });
      });
    });

    describe('Share Mission Tests', () => {
      const payload: TransferDto = {
        missionId: mockMission.id,
        transferType: MissionTransferType.SHARE,
        targetWorkspaceId,
      };

      it('should share mission', (done) => {
        service.executeTransfer(payload).subscribe(() => {
          expect(missionApiSpy.shareMission).toHaveBeenCalledWith(mockMission.id, targetWorkspaceId);
          expect(messageServiceSpy.success).toHaveBeenCalledWith('MISSION.TRANSFER_DIALOG.SUCCESS.SHARE');
          done();
        });
      });

      it('should display an error message', (done) => {
        missionApiSpy.shareMission.mockReturnValue(throwError(() => mockError));

        service.executeTransfer(payload).subscribe({
          complete: () => {
            expect(messageServiceSpy.error).toHaveBeenCalledWith(mockError.detail);
            done();
          },
        });
      });
    });
  });

  describe('getNextAction', () => {
    it(`should return ${MissionTransferActions.setStep.type} action with ${MissionTransferStep.CONFIRMATION} step when current step is ${MissionTransferStep.SELECT_RECIPIENT} and hasRecipient is true`, () => {
      const currentStep = MissionTransferStep.SELECT_RECIPIENT;
      const hasRecipient = true;
      const transferType = MissionTransferType.TRANSFER;

      const result = MissionTransferService.getNextAction(currentStep, hasRecipient, transferType);

      const { step } = result as any;
      expect(result.type).toEqual(MissionTransferActions.setStep.type);
      expect(step).toEqual(MissionTransferStep.CONFIRMATION);
    });

    it(`should return ${MissionTransferActions.executeTransfer.type} action  when current step is ${MissionTransferStep.CONFIRMATION} and hasRecipient is true`, () => {
      const currentStep = MissionTransferStep.CONFIRMATION;
      const hasRecipient = true;
      const transferType = MissionTransferType.TRANSFER;

      const result = MissionTransferService.getNextAction(currentStep, hasRecipient, transferType);

      expect(result.type).toEqual(MissionTransferActions.executeTransfer.type);
    });

    it(`should return ${MissionTransferActions.setStep.type} action with ${MissionTransferStep.SELECT_RECIPIENT} if hasRecipient is false and transferType is different from ${MissionTransferType.SHARE}`, () => {
      const currentStep = MissionTransferStep.SELECT_RECIPIENT;
      const hasRecipient = false;
      const transferType = MissionTransferType.TRANSFER;

      const result = MissionTransferService.getNextAction(currentStep, hasRecipient, transferType);

      const { step } = result as any;
      expect(result.type).toEqual(MissionTransferActions.setStep.type);
      expect(step).toEqual(MissionTransferStep.SELECT_RECIPIENT);
    });

    it(`should return ${MissionTransferActions.setStep.type} action with ${MissionTransferStep.CONFIRMATION} step when current step is ${MissionTransferStep.SELECT_RECIPIENT} and transferType is ${MissionTransferType.SHARE}`, () => {
      const currentStep = MissionTransferStep.SELECT_RECIPIENT;
      const hasRecipient = false;
      const transferType = MissionTransferType.SHARE;

      const result = MissionTransferService.getNextAction(currentStep, hasRecipient, transferType);

      const { step } = result as any;
      expect(result.type).toEqual(MissionTransferActions.setStep.type);
      expect(step).toEqual(MissionTransferStep.CONFIRMATION);
    });
  });

  describe('getPreviousAction', () => {
    it(`should return ${MissionTransferActions.closeDialog.type} action when current step is ${MissionTransferStep.SELECT_RECIPIENT}`, () => {
      const currentStep = MissionTransferStep.SELECT_RECIPIENT;

      const result = MissionTransferService.getPreviousAction(currentStep);

      expect(result.type).toEqual(MissionTransferActions.closeDialog.type);
    });

    it(`should return ${MissionTransferActions.setStep.type} action with ${MissionTransferStep.SELECT_RECIPIENT} when current step is ${MissionTransferStep.CONFIRMATION}`, () => {
      const currentStep = MissionTransferStep.CONFIRMATION;

      const result = MissionTransferService.getPreviousAction(currentStep);

      const { step } = result as any;
      expect(result.type).toEqual(MissionTransferActions.setStep.type);
      expect(step).toEqual(MissionTransferStep.SELECT_RECIPIENT);
    });
  });
});
