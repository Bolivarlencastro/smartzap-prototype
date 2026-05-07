import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExtendDeadlineDialogComponent } from '@app/main/mission-enrollments/components/extend-deadline-dialog/extend-deadline-dialog.component';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { BellNotification } from '@core/model/notification';
import { of } from 'rxjs';
import { NotificationAPI } from '../../api';
import { DefaultNotificationStrategy } from './notification-route-strategy/default-notification-strategy';
import { MissionNotificationStrategy } from './notification-route-strategy/mission-notification-strategy';
import { NotificationService } from './notification.service';
import Chance from 'chance';
import { ExtendDeadlineDialogData } from '@core/model/enrollment.model';

describe('NotificationService', () => {
  const chance = new Chance();

  let service: NotificationService;
  let injectorMock: jest.Mocked<Injector>;
  let defaultStrategySpy: jest.SpyInstance;
  let missionStrategySpy: jest.SpyInstance;
  let readSpy: jest.SpyInstance;
  let routerMock: Partial<Router>;
  let matDialogMock: jest.Mocked<MatDialog>;
  let notificationAPIMock: jest.Mocked<NotificationAPI>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    matDialogMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    notificationAPIMock = {
      getNotifications: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<NotificationAPI>;

    messageServiceMock = {
      showMessage: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    injectorMock = {
      get: jest.fn(),
    } as unknown as jest.Mocked<Injector>;

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: Injector, useValue: injectorMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: NotificationAPI, useValue: notificationAPIMock },
        { provide: KpMessageService, useValue: messageServiceMock },
      ],
    });

    service = TestBed.inject(NotificationService);
    readSpy = jest.spyOn(service, 'readNotification').mockImplementation();
    defaultStrategySpy = jest.spyOn(DefaultNotificationStrategy.prototype, 'navigate');
    missionStrategySpy = jest.spyOn(MissionNotificationStrategy.prototype, 'navigate');
  });

  it('should read and navigate using specific strategy for known typeKey', () => {
    const notification: BellNotification = {
      id: chance.guid({ version: 4 }),
      objectPk: chance.guid({ version: 4 }),
      typeKey: 'USER_LINKED_IN_A_NEW_GROUP',
    } as BellNotification;

    injectorMock.get.mockReturnValue(new MissionNotificationStrategy(routerMock as Router) as any);

    service.select(notification);

    expect(readSpy).toHaveBeenCalledWith(notification.id);
    expect(injectorMock.get).toHaveBeenCalledWith('USER_LINKED_IN_A_NEW_GROUP');
    expect(missionStrategySpy).toHaveBeenCalled();
  });

  it('should read and navigate using default strategy for unknown typeKey', () => {
    injectorMock.get.mockReturnValue(undefined);

    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const notification: BellNotification = {
      id: chance.guid({ version: 4 }),
      objectPk: chance.guid({ version: 4 }),
      typeKey: 'UNDEFINED' as any,
    } as BellNotification;

    service.select(notification); // Pass an index that leads to an unknown typeKey

    expect(readSpy).toHaveBeenCalledWith(notification.id);
    expect(injectorMock.get).toHaveBeenCalledWith('UNDEFINED');
    expect(defaultStrategySpy).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('No action found to notification type: UNDEFINED');
  });

  it('should open extend deadline dialog with expected data', () => {
    const openSpy = jest.spyOn(matDialogMock, 'open');
    const data: ExtendDeadlineDialogData = {
      user: 'Test User',
      learningObjectName: 'Test Mission',
      startDate: '05/22/2023',
      currentGoalDate: '05/30/2023',
    };

    service.openExtendDeadlineDialog(data);

    expect(openSpy).toHaveBeenCalledWith(ExtendDeadlineDialogComponent, {
      autoFocus: false,
      width: '500px',
      disableClose: true,
      data,
    });
  });
});
