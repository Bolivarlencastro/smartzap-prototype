import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';

import { ReportsGuard } from './reports.guard';

describe('ReportsGuard', () => {
  let guard: ReportsGuard;
  let userProfileSpy: jest.Mocked<UserProfileService>;
  const router = { navigate: jest.fn() };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        ReportsGuard,
        {
          provide: UserProfileService,
          useValue: {
            getApplicationRoles: jest.fn(),
            roles$: of(EMPTY),
          },
        },
        {
          provide: AuthService,
          useValue: {
            userId: 'cabbfd9e-9c3d-4d48-bef1-74370e03802a',
          },
        },
        { provide: Router, useValue: router },
      ],
    });
    guard = TestBed.inject(ReportsGuard);
    userProfileSpy = TestBed.inject(UserProfileService) as jest.Mocked<UserProfileService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not activate the route when the user is not a admin or leader', (doneFn) => {
    userProfileSpy.getApplicationRoles.mockReturnValue(['basic_analytics_user']);

    guard.canActivate().subscribe((result) => {
      expect(result).toBe(false);
      doneFn();
    });
  });

  describe('when user roles are defined', () => {
    it('should not activate the route when the user is not an admin or leader', (doneFn) => {
      userProfileSpy.getApplicationRoles.mockReturnValue(['basic_analytics_user']);

      guard.canActivate().subscribe((result) => {
        expect(result).toBe(false);
        doneFn();
      });
    });

    it('should not activate the route children when the user is not an admin or leader', (doneFn) => {
      userProfileSpy.getApplicationRoles.mockReturnValue(['basic_analytics_user']);

      guard.canActivateChild().subscribe((result) => {
        expect(result).toBe(false);
        doneFn();
      });
    });

    it('should not load the route when the user is not an admin or leader', (doneFn) => {
      userProfileSpy.getApplicationRoles.mockReturnValue(['basic_analytics_user']);

      guard.canMatch().subscribe((result) => {
        expect(result).toBe(false);
        doneFn();
      });
    });

    it('should activate the route when the user is an admin', (doneFn) => {
      userProfileSpy.getApplicationRoles.mockReturnValue(['basic_analytics_admin']);

      guard.canActivate().subscribe((result) => {
        expect(result).toBe(true);
        doneFn();
      });
    });

    it('should activate the route children when the user is an admin', (doneFn) => {
      userProfileSpy.getApplicationRoles.mockReturnValue(['basic_analytics_admin']);

      guard.canActivateChild().subscribe((result) => {
        expect(result).toBe(true);
        doneFn();
      });
    });

    it('should load the route when the user an admin', (doneFn) => {
      userProfileSpy.getApplicationRoles.mockReturnValue(['basic_analytics_admin']);

      guard.canMatch().subscribe((result) => {
        expect(result).toBe(true);
        doneFn();
      });
    });

    it('should activate the route when the user is a leader', (doneFn) => {
      userProfileSpy.getApplicationRoles.mockReturnValue(['basic_analytics_leader']);

      guard.canActivate().subscribe((result) => {
        expect(result).toBe(true);
        doneFn();
      });
    });

    it('should activate the route children when the user is a leader', (doneFn) => {
      userProfileSpy.getApplicationRoles.mockReturnValue(['basic_analytics_leader']);

      guard.canActivateChild().subscribe((result) => {
        expect(result).toBe(true);
        doneFn();
      });
    });

    it('should load the route when the user a leader', (doneFn) => {
      userProfileSpy.getApplicationRoles.mockReturnValue(['basic_analytics_leader']);

      guard.canMatch().subscribe((result) => {
        expect(result).toBe(true);
        doneFn();
      });
    });
  });
});
