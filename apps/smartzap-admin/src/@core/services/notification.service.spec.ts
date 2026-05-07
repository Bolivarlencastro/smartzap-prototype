import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';
import {
  NotificationService,
  SmartzapNotification,
  SmartZapNotificationType,
  KpNotificationSmartzapModel,
} from './notification.service';
import { SmartzapAPI } from '../api';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const mockResponse: SmartzapNotification[] = [
  {
    id: '1',
    content: 'https://example.com/report.pdf',
    created: '2023-07-15T10:00:00.000Z',
    updated: '2023-07-15T10:30:00.000Z',
    type: {
      action: SmartZapNotificationType.REPORT_DOWNLOAD,
      created_date: '',
      deleted: false,
      deleted_date: '',
      id: '',
      image: '',
      object_type: '',
      updated_date: '',
    },
    created_date: '',
    deleted: false,
    deleted_date: '',
    message: 'Notification 1',
    messages: {
      title: '',
      description: '',
      title_values: {},
    },
    notification_type: {
      action: '',
      created_date: '',
      deleted: false,
      deleted_date: '',
      id: '',
      image: '',
      object_type: '',
      updated_date: '',
    },
    object: '',
    read: false,
    updated_date: '',
    url: null,
    user_receiving: {
      avatar: '',
      country: '',
      ein: '',
      email: '',
      email_verified: false,
      id: '',
      job: '',
      language_id: '',
      last_access_date: '',
      name: '',
      phone: '',
      related_user_leader: '',
      status: false,
      time_zone: '',
    },
    workspace: '',
  },
  {
    id: '2',
    content: 'course2',
    created: '2023-07-15T11:00:00.000Z',
    updated: '2023-07-15T11:30:00.000Z',
    type: {
      action: SmartZapNotificationType.COURSE_REDIRECT,
      created_date: '',
      deleted: false,
      deleted_date: '',
      id: '',
      image: '',
      object_type: '',
      updated_date: '',
    },
    created_date: '',
    deleted: false,
    deleted_date: '',
    message: 'Notification 2',
    messages: {
      title: '',
      description: '',
      title_values: {},
    },
    notification_type: {
      action: '',
      created_date: '',
      deleted: false,
      deleted_date: '',
      id: '',
      image: '',
      object_type: '',
      updated_date: '',
    },
    object: '',
    read: false,
    updated_date: '',
    url: null,
    user_receiving: {
      avatar: '',
      country: '',
      ein: '',
      email: '',
      email_verified: false,
      id: '',
      job: '',
      language_id: '',
      last_access_date: '',
      name: '',
      phone: '',
      related_user_leader: '',
      status: false,
      time_zone: '',
    },
    workspace: '',
  },
];

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: jest.Mocked<SmartzapAPI>;
  let translateServiceMock: jest.Mocked<TranslocoService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    const apiMock = { get: jest.fn(), patch: jest.fn(), post: jest.fn() };
    const translateMock = { translate: jest.fn() };
    const routerMockFn = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      imports: [TranslocoModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        NotificationService,
        { provide: SmartzapAPI, useValue: apiMock },
        { provide: TranslocoService, useValue: translateMock },
        { provide: Router, useValue: routerMockFn },
      ],
    });

    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(SmartzapAPI) as jest.Mocked<SmartzapAPI>;
    translateServiceMock = TestBed.inject(TranslocoService) as jest.Mocked<TranslocoService>;
    routerMock = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should fetch notifications', () => {
    const expectedResponse: KpNotificationSmartzapModel[] = [
      {
        id: '1',
        title: 'Translated Notification 1',
        updated_date: '2023-07-15T07:30:00.000Z',
        entity: mockResponse[0],
      },
      {
        id: '2',
        title: 'Translated Notification 2',
        updated_date: '2023-07-15T08:30:00.000Z',
        entity: mockResponse[1],
      },
    ];

    httpMock.get.mockReturnValue(of({ result: mockResponse }));
    translateServiceMock.translate.mockImplementation((key: string) => `Translated ${key}`);

    service.fetchNotifications().subscribe((notifications) => {
      expect(notifications).toEqual(expectedResponse);
    });

    expect(httpMock.get).toHaveBeenCalledWith('/user/notification', { read: false });
    expect(translateServiceMock.translate).toHaveBeenCalledTimes(2);
    expect(translateServiceMock.translate).toHaveBeenCalledWith(`REPORTS.${mockResponse[0].message}`);
    expect(translateServiceMock.translate).toHaveBeenCalledWith(`REPORTS.${mockResponse[1].message}`);
  });

  it('should read notification', () => {
    const notificationId = '1';
    httpMock.patch.mockReturnValue(of({}));

    service.readNotification(notificationId).subscribe(() => {
      expect(httpMock.patch).toHaveBeenCalledWith(`/user/notification/${notificationId}`, { read: true });
    });
  });

  it('should select notification - REPORT_DOWNLOAD', () => {
    const windowSpy = (window.open = jest.fn());
    const notification = {
      id: '1',
      title: 'Translated Notification',
      updated_date: '2023-07-15T10:00:00.000Z',
      entity: mockResponse[0],
    };

    service.selectNotification(notification);

    expect(windowSpy).toHaveBeenCalledWith(notification.entity.content, '_blank');
  });

  it('should select notification - default', () => {
    const notification: KpNotificationSmartzapModel = {
      id: '1',
      title: 'Translated Notification',
      updated_date: '2023-07-15T10:00:00.000Z',
      entity: mockResponse[1],
    };

    service.selectNotification(notification);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/', 'courses', 'course2']);
  });

  it('should clear all notifications', () => {
    httpMock.post.mockReturnValue(of({}));

    service.clearAllNotifications().subscribe(() => {
      expect(httpMock.post).toHaveBeenCalledWith('/user/notification/batch-read', null);
    });
  });
});
