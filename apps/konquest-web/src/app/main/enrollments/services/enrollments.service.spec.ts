import { TestBed } from '@angular/core/testing';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EnrollmentsService } from './enrollments.service';
import { environment } from 'environments/environment';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;

  beforeEach(() => {
    workspaceServiceMock = {
      isServiceActive: jest.fn(),
    } as unknown as jest.Mocked<WorkspaceService>;

    TestBed.configureTestingModule({
      providers: [EnrollmentsService, { provide: WorkspaceService, useValue: workspaceServiceMock }],
    });

    service = TestBed.inject(EnrollmentsService);
  });

  it('should return nav links with learning trails and missions when services are available', () => {
    workspaceServiceMock.isServiceActive.mockReturnValue(true);
    const navLinks = service.getNavLinks();

    expect(navLinks.length).toBe(3);
    expect(navLinks[0]).toEqual({
      label: 'SETTING.TAB.LEARNING_TRAIL_ENROLLMENTS',
      mobileLabel: 'NAVIGATION.TRAILS',
      path: 'learning-trails',
    });
    expect(navLinks[1]).toEqual({
      label: 'SETTING.TAB.MISSION_ENROLLMENTS',
      mobileLabel: 'NAVIGATION.MISSIONS',
      path: 'missions',
    });
    expect(navLinks[2]).toEqual({
      label: 'SETTING.TAB.EVENT_ENROLLMENTS',
      mobileLabel: 'NAVIGATION.EVENTS',
      path: 'events',
    });
    expect(workspaceServiceMock.isServiceActive).toHaveBeenCalledWith(
      environment.apps.konquest.services.learning_trail.id,
    );
    expect(workspaceServiceMock.isServiceActive).toHaveBeenCalledWith(environment.apps.konquest.services.mission.id);
  });
});
