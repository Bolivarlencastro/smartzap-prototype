import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Mission, MissionInformationDate, MissionModel } from '@app/main/mission/mission.model';
import { KonquestAPI } from '@core/api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { EventManagementAction } from 'app/main/event-management/models/actions';
import { EventQrCodeService } from 'app/main/event-management/services/event-qr-code.service';
import { of } from 'rxjs';
import { ImportListDialogComponent } from '../containers/import-list-dialog/import-list-dialog.component';
import { EventManagementActionsService } from './event-management-actions.service';

describe('EventManagementActionsService', () => {
  let service: EventManagementActionsService;
  let eventQrCodeServiceMock: jest.Mocked<EventQrCodeService>;
  let routerMock: jest.Mocked<Router>;
  let konquestApiMock: jest.Mocked<KonquestAPI>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let warnSpy: jest.SpyInstance;
  let matDialogMock: jest.Mocked<MatDialog>;

  const mockEvent = {
    id: '123',
    mission_model: MissionModel.PRESENTIAL,
    name: 'Test Event',
  } as Mission;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    eventQrCodeServiceMock = { openQrCodeDialog: jest.fn() } as unknown as jest.Mocked<EventQrCodeService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    konquestApiMock = {
      post: jest.fn(() => of({})),
    } as unknown as jest.Mocked<KonquestAPI>;

    messageServiceMock = {
      success: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    matDialogMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    service = new EventManagementActionsService(
      eventQrCodeServiceMock,
      routerMock,
      konquestApiMock,
      messageServiceMock,
      matDialogMock,
    );
  });

  it('should handle the qr-code action', () => {
    service.executeAction('qr-code', null);

    expect(eventQrCodeServiceMock.openQrCodeDialog).toHaveBeenCalled();
  });

  it('should handle the edit action', () => {
    service.executeAction('edit', mockEvent);

    expect(routerMock.navigate).toHaveBeenCalledWith([`/events/create/${mockEvent.id}/info`]);
  });

  describe('finishEvent', () => {
    it('should handle the finish action for presential event', () => {
      const postSpy = jest.spyOn(konquestApiMock, 'post');

      service.executeAction('finish', mockEvent);

      expect(postSpy).toHaveBeenCalledWith(`/missions/presential/${mockEvent.id}/complete`, {});
    });

    it('should handle the finish action for live event', () => {
      const liveEvent = {
        ...mockEvent,
        mission_model: MissionModel.LIVE,
      } as Mission;

      const postSpy = jest.spyOn(konquestApiMock, 'post');

      service.executeAction('finish', liveEvent);

      expect(postSpy).toHaveBeenCalledWith(`/missions/live/${liveEvent.id}/complete`, {});
    });

    it('should successfully finish a event and navigate', () => {
      service.executeAction('finish', mockEvent);

      expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.SUCCESSFULLY_COMPLETED');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/management/events']);
    });
  });

  it('should handle the import-list action', () => {
    const openSpy = jest.spyOn(matDialogMock, 'open');

    service.executeAction('import-list', mockEvent, [{ id: '123' }, { id: '456' }] as MissionInformationDate[]);

    expect(openSpy).toHaveBeenCalledWith(ImportListDialogComponent, {
      autoFocus: 'dialog',
      data: { eventId: mockEvent.id, dates: [{ id: '123' }, { id: '456' }] },
    });
  });

  it('should handle unknown management actions', () => {
    service.executeAction('unknown-action' as EventManagementAction, null);
    expect(warnSpy).toHaveBeenCalledWith('Unknown event management action: unknown-action');
  });
});
