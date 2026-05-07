import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MissionModel } from '@app/main/mission/mission.model';
import { KonquestAPI } from '@core/api';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { of } from 'rxjs';
import { AddNoteComponent } from '../components/add-note/add-note.component';
import { EventManagementUserActionsService } from './event-management-user-actions.service';

describe('EventManagementUserActionsService', () => {
  let service: EventManagementUserActionsService;
  let konquestApiMock: jest.Mocked<KonquestAPI>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let dialogMock: jest.Mocked<MatDialog>;

  let addNoteDialogRefMock: jest.Mocked<MatDialogRef<AddNoteComponent>>;
  let confirmDialogRefMock: jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;

  beforeEach(() => {
    konquestApiMock = {
      post: jest.fn(() => of({})),
      delete: jest.fn(() => of({})),
    } as unknown as jest.Mocked<KonquestAPI>;

    messageServiceMock = {
      success: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    dialogMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    addNoteDialogRefMock = {
      afterClosed: jest.fn(() => of('New note text')),
    } as unknown as jest.Mocked<MatDialogRef<AddNoteComponent>>;

    confirmDialogRefMock = {
      afterClosed: jest.fn(() => of(true)),
      componentInstance: {
        confirmTitle: null,
        confirmMessage: null,
        positiveButtonLabel: null,
      },
    } as unknown as jest.Mocked<MatDialogRef<KpConfirmDialogComponent>>;

    service = new EventManagementUserActionsService(konquestApiMock, messageServiceMock, dialogMock);
  });

  describe('Add Note', () => {
    const cases: any[] = [
      [MissionModel.PRESENTIAL, 'presential'],
      [MissionModel.LIVE, 'live'],
    ];

    test.each(cases)(
      'for %p model, should open AddNoteComponent dialog and make API call for single presence',
      (model, expectedValue, done) => {
        const presenceId = '123';
        const observation = 'Test note';
        const dialogResult = 'New note text';

        dialogMock.open.mockReturnValue(addNoteDialogRefMock);

        service.addNote(presenceId, observation, model, null).subscribe(() => {
          expect(dialogMock.open).toHaveBeenCalledWith(AddNoteComponent, {
            width: '400px',
            data: observation,
          });

          expect(konquestApiMock.post).toHaveBeenCalledWith(
            `/mission-enrollments/${expectedValue}-attendances/123/check`,
            {
              observation: dialogResult,
            },
          );

          expect(messageServiceMock.success).toHaveBeenCalledWith('EVENT_MANAGEMENT.ADD_NOTE.SUCCESS_MESSAGE');

          done();
        });
      },
    );

    test.each(cases)(
      'for %p model, should open AddNoteComponent dialog and make API call for multiple presences',
      (model, expectedValue, done) => {
        const presenceId = ['123', '456'];
        const dialogResult = 'New note text';

        dialogMock.open.mockReturnValue(addNoteDialogRefMock);

        service.addNote(presenceId, null, model, true).subscribe(() => {
          expect(dialogMock.open).toHaveBeenCalledWith(AddNoteComponent, {
            width: '400px',
            data: null,
          });

          expect(konquestApiMock.post).toHaveBeenCalledWith(
            `/mission-enrollments/${expectedValue}-attendances/batch-check`,
            {
              observation: dialogResult,
              attendance_ids: presenceId,
            },
          );

          expect(messageServiceMock.success).toHaveBeenCalledWith('EVENT_MANAGEMENT.ADD_NOTE.SUCCESS_MESSAGE');

          done();
        });
      },
    );
  });

  describe('Toggle Presence', () => {
    const cases: any[] = [
      [MissionModel.PRESENTIAL, 'presential'],
      [MissionModel.LIVE, 'live'],
    ];

    test.each(cases)('for %p model, should make API call for single presence', (model, expectedValue, done) => {
      const presenceId = '123';
      const presented = true;

      service.togglePresence(presented, presenceId, model, null).subscribe(() => {
        expect(konquestApiMock.post).toHaveBeenCalledWith(
          `/mission-enrollments/${expectedValue}-attendances/${presenceId}/check`,
          {
            presented,
          },
        );

        expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.ATTENDANCE_LIST.UPDATE_PRESENTED_SUCCESS');

        done();
      });
    });

    test.each(cases)('for %p model, should make API call for multiple presences', (model, expectedValue, done) => {
      const presenceId = ['123', '456'];
      const presented = true;

      service.togglePresence(presented, presenceId, model, true).subscribe(() => {
        expect(konquestApiMock.post).toHaveBeenCalledWith(
          `/mission-enrollments/${expectedValue}-attendances/batch-check`,
          {
            presented,
            attendance_ids: presenceId,
          },
        );

        expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.ATTENDANCE_LIST.UPDATE_PRESENTED_SUCCESS');

        done();
      });
    });
  });

  describe('Send Invite', () => {
    it('should make API call to send invite', (done) => {
      const enrollment_ids = ['123', '456'];

      service.sendInvite(enrollment_ids).subscribe(() => {
        expect(konquestApiMock.post).toHaveBeenCalledWith(`/mission-enrollments/batch-resend-invite`, {
          enrollment_ids,
        });
        expect(messageServiceMock.success).toHaveBeenCalledWith('EVENT_MANAGEMENT.SEND_INVITE.SUCCESS_MESSAGE');

        done();
      });
    });
  });

  describe('Remove User', () => {
    it('should make API call to remove a single user', (done) => {
      const id = '123';

      dialogMock.open.mockReturnValue(confirmDialogRefMock);

      service.removeUser(id, null).subscribe(() => {
        expect(dialogMock.open).toHaveBeenCalledWith(KpConfirmDialogComponent, {
          maxWidth: '350px',
        });

        expect(konquestApiMock.delete).toHaveBeenCalledWith(`/mission-enrollments/${id}`);

        expect(messageServiceMock.success).toHaveBeenCalledWith('EVENT_MANAGEMENT.REMOVE_USER.SUCCESS_MESSAGE');

        done();
      });
    });

    it('should make API call to remove multiple users', (done) => {
      const enrollment_ids = ['123', '456'];

      dialogMock.open.mockReturnValue(confirmDialogRefMock);

      service.removeUser(enrollment_ids, true).subscribe(() => {
        expect(dialogMock.open).toHaveBeenCalledWith(KpConfirmDialogComponent, {
          maxWidth: '350px',
        });

        expect(konquestApiMock.post).toHaveBeenCalledWith('/mission-enrollments/batch-delete', { enrollment_ids });

        expect(messageServiceMock.success).toHaveBeenCalledWith('EVENT_MANAGEMENT.REMOVE_USER.SUCCESS_MESSAGE');

        done();
      });
    });
  });
});
