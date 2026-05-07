import { CheckInService } from './check-in.service';
import { SessionData } from '../models/session-data';
import { Chance } from 'chance';
import { CoursesApi, ThemingService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { SupportMaterialsService } from './support-materials.service';

describe('CheckInService', () => {
  let service: CheckInService;
  let themingServiceMock: jest.Mocked<ThemingService>;
  let coursesApiMock: jest.Mocked<CoursesApi>;
  let supportMaterialsServiceMock: jest.Mocked<SupportMaterialsService>;
  const chance = new Chance();

  beforeEach(() => {
    themingServiceMock = { setThemeColor: jest.fn() } as unknown as jest.Mocked<ThemingService>;
    coursesApiMock = { autoCheckIn: jest.fn().mockReturnValue(of(EMPTY)) } as unknown as jest.Mocked<CoursesApi>;
    supportMaterialsServiceMock = {
      loadSupportMaterials: jest.fn(),
    } as unknown as jest.Mocked<SupportMaterialsService>;
    TestBed.configureTestingModule({
      providers: [
        { provide: ThemingService, useValue: themingServiceMock },
        { provide: CoursesApi, useValue: coursesApiMock },
        { provide: SupportMaterialsService, useValue: supportMaterialsServiceMock },
      ],
    });

    service = TestBed.inject(CheckInService);
  });

  it('should set the session data and update the theme color', () => {
    const mockSessionData: SessionData = {
      dateId: chance.guid(),
      workspaceColor: chance.color(),
      eventId: chance.guid(),
      user: chance.guid(),
      eventName: chance.name(),
      start: chance.date().toISOString(),
      end: chance.date().toISOString(),
      workspaceId: chance.guid(),
    };

    service.setSessionData(mockSessionData);

    expect(service.sessionData()).toEqual(mockSessionData);
    expect(themingServiceMock.setThemeColor).toHaveBeenCalledWith(mockSessionData.workspaceColor, false);
  });

  it('should perform the user check in', () => {
    const eventDate = chance.guid();

    service.autoCheckIn(eventDate);

    expect(service.checkInStatus()).toEqual('success');
  });

  it('should load the support materials when the check in succeeds', () => {
    const eventDate = chance.guid();
    const eventId = chance.guid();
    service.setSessionData({ eventId, dateId: eventDate } as SessionData);

    service.autoCheckIn(eventDate);

    expect(supportMaterialsServiceMock.loadSupportMaterials).toHaveBeenCalledWith(eventId);
  });

  it('should set the error code when the check in fails', () => {
    const eventDate = chance.guid();
    coursesApiMock.autoCheckIn.mockReturnValue(throwError(() => ({ error: { detail: 'date_not_found' } })));

    service.autoCheckIn(eventDate);

    expect(service.checkInStatus()).toEqual('date_not_found');
  });
});
