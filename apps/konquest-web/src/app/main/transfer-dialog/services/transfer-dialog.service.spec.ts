import { MatDialog } from '@angular/material/dialog';
import { ChannelApi, UserService } from '@core/api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { EMPTY, of, throwError } from 'rxjs';
import { Recipient, TransferContent, TransferContentType, TransferDialogData, TransferStep } from '../models';
import { TransferDialogActions } from '../store/actions';
import { TransferDialogService } from './transfer-dialog.service';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearningTrailAPI } from '@core/api/learning-trail.api';

const recipientRolesIDs = [
  '297a88de-c34b-4661-be8a-7090fa9a89e5',
  'c2a0da89-311d-4e4f-bf7b-c49d7c15f2b6',
  '97f4a026-f727-4e23-bdf9-971fec7ce20e',
];

const mockTransferContent: TransferContent = {
  id: '123456',
  name: 'transfer_content',
};

const mockRecipient: Recipient = {
  id: '1245',
  name: 'test_recipient',
  avatar: '',
};

describe('TransferService', () => {
  let service: TransferDialogService;
  let userServiceSpy: jest.Mocked<UserService>;
  let messageServiceSpy: jest.Mocked<KpMessageService>;
  let channelApiSpy: jest.Mocked<ChannelApi>;
  let dialogSpy: jest.Mocked<MatDialog>;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let learningTrailApiMock: jest.Mocked<LearningTrailAPI>;
  let closeSpy: jest.Mock;

  beforeEach(() => {
    userServiceSpy = { fetchByQuery: jest.fn().mockReturnValue(of(EMPTY)) } as any;
    messageServiceSpy = { success: jest.fn(), error: jest.fn() } as any;
    channelApiSpy = { transferChannel: jest.fn().mockReturnValue(of(EMPTY)) } as any;
    closeSpy = jest.fn();
    dialogSpy = { open: jest.fn().mockReturnValue({ close: closeSpy }) } as any;
    learningTrailApiMock = {
      transferLearningTrial: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<LearningTrailAPI>;
    workspaceServiceMock = { currentWorkspaceId: 'mock_workspace_id' } as unknown as jest.Mocked<WorkspaceService>;

    service = new TransferDialogService(
      dialogSpy,
      userServiceSpy,
      channelApiSpy,
      learningTrailApiMock,
      messageServiceSpy,
      workspaceServiceMock,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open the dialog', () => {
    const transferDialogData: TransferDialogData = {
      transferContent: mockTransferContent,
      contentType: TransferContentType.CHANNEL,
    };

    service.openDialog(transferDialogData);

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should close the dialog', () => {
    const transferDialogData: TransferDialogData = {
      transferContent: mockTransferContent,
      contentType: TransferContentType.CHANNEL,
    };

    service.openDialog(transferDialogData);
    service.closeDialog();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should filter recipients', (done) => {
    const mockSearchTerm = 'test_admin';
    const expectedQueryParams = {
      'filter.roles.role.id': `$in:${recipientRolesIDs}`,
      limit: 15,
      search: mockSearchTerm,
      'filter.status': '$eq:true',
    };

    service.filterRecipients(mockSearchTerm).subscribe(() => {
      expect(userServiceSpy.fetchByQuery).toHaveBeenCalledWith(expectedQueryParams);
      done();
    });
  });

  describe('executeTransfer', () => {
    describe('Channel', () => {
      const transferDialogData: TransferDialogData = {
        transferContent: mockTransferContent,
        contentType: TransferContentType.CHANNEL,
      };

      it('should transfer Channels', (done) => {
        service.executeTransfer(transferDialogData, mockRecipient).subscribe(() => {
          expect(channelApiSpy.transferChannel).toHaveBeenCalledWith(mockTransferContent.id, mockRecipient.id);
          done();
        });
      });

      it('should display success message', (done) => {
        service.executeTransfer(transferDialogData, mockRecipient).subscribe(() => {
          expect(messageServiceSpy.success).toHaveBeenCalledWith('TRANSFER_DIALOG.SUCCESS.CHANNEL');
          done();
        });
      });

      it('should display failure message', (done) => {
        const mockError = { detail: 'detail_message' };
        channelApiSpy.transferChannel.mockReturnValue(throwError(mockError));

        service.executeTransfer(transferDialogData, mockRecipient).subscribe(
          () => {},
          () => {
            expect(messageServiceSpy.error).toHaveBeenCalledWith(mockError.detail);
            done();
          },
        );
      });
    });

    describe('Learning Trail', () => {
      const transferDialogData: TransferDialogData = {
        transferContent: mockTransferContent,
        contentType: TransferContentType.LEARNING_TRAIL,
      };

      it('should transfer learning trails', (done) => {
        service.executeTransfer(transferDialogData, mockRecipient).subscribe(() => {
          expect(learningTrailApiMock.transferLearningTrial).toHaveBeenCalledWith(
            mockTransferContent.id,
            mockRecipient.id,
            'mock_workspace_id',
          );
          done();
        });
      });

      it('should display success message', (done) => {
        service.executeTransfer(transferDialogData, mockRecipient).subscribe(() => {
          expect(messageServiceSpy.success).toHaveBeenCalledWith('TRANSFER_DIALOG.SUCCESS.LEARNING_TRAIL');
          done();
        });
      });
    });
  });

  describe('getNextAction', () => {
    it(`should return ${TransferDialogActions.setCurrentStep.type} action with ${TransferStep.CONFIRMATION} step when current step is ${TransferStep.SELECT_RECIPIENT} and hasRecipient is true`, () => {
      const currentStep = TransferStep.SELECT_RECIPIENT;
      const hasRecipient = true;

      const result = TransferDialogService.getNextAction(currentStep, hasRecipient);

      const { step } = result as any;
      expect(result.type).toEqual(TransferDialogActions.setCurrentStep.type);
      expect(step).toEqual(TransferStep.CONFIRMATION);
    });

    it(`should return ${TransferDialogActions.executeTransfer.type} action  when current step is ${TransferStep.CONFIRMATION} and hasRecipient is true`, () => {
      const currentStep = TransferStep.CONFIRMATION;
      const hasRecipient = true;

      const result = TransferDialogService.getNextAction(currentStep, hasRecipient);

      expect(result.type).toEqual(TransferDialogActions.executeTransfer.type);
    });

    it(`should return ${TransferDialogActions.setCurrentStep.type} action with ${TransferStep.SELECT_RECIPIENT} if hasRecipient is false`, () => {
      const currentStep = TransferStep.SELECT_RECIPIENT;
      const hasRecipient = false;

      const result = TransferDialogService.getNextAction(currentStep, hasRecipient);

      const { step } = result as any;
      expect(result.type).toEqual(TransferDialogActions.setCurrentStep.type);
      expect(step).toEqual(TransferStep.SELECT_RECIPIENT);
    });
  });

  describe('getPreviousAction', () => {
    it(`should return ${TransferDialogActions.closeDialog.type} action when current step is ${TransferStep.SELECT_RECIPIENT}`, () => {
      const currentStep = TransferStep.SELECT_RECIPIENT;

      const result = TransferDialogService.getPreviousAction(currentStep);

      expect(result.type).toEqual(TransferDialogActions.closeDialog.type);
    });

    it(`should return ${TransferDialogActions.setCurrentStep.type} action with ${TransferStep.SELECT_RECIPIENT} when current step is ${TransferStep.CONFIRMATION}`, () => {
      const currentStep = TransferStep.CONFIRMATION;

      const result = TransferDialogService.getPreviousAction(currentStep);

      const { step } = result as any;
      expect(result.type).toEqual(TransferDialogActions.setCurrentStep.type);
      expect(step).toEqual(TransferStep.SELECT_RECIPIENT);
    });
  });
});
