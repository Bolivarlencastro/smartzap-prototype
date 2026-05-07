import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { BehaviorSubject } from 'rxjs';
import { AdminAccessGuard } from './admin-access.guard';

class UserProfileStoreServiceMock {
  roles$ = new BehaviorSubject(['mock_role']).asObservable();

  getApplicationRoles(): string[] {
    return [];
  }

  hasRequiredRoles(): boolean {
    return true;
  }
}

describe('AdminAccessGuard', () => {
  let adminAccessGuard: AdminAccessGuard;
  let userProfileServiceV2: UserProfileService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserProfileService,
          useClass: UserProfileStoreServiceMock,
        },
      ],
    });
    adminAccessGuard = TestBed.inject(AdminAccessGuard);
    userProfileServiceV2 = TestBed.inject(UserProfileService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('canActivate', () => {
    it('should allow to activate when user has required role', (done) => {
      jest.spyOn(router, 'navigate').mockImplementation().mockImplementation();

      adminAccessGuard.canActivate().subscribe((response) => {
        expect(router.navigate).not.toHaveBeenCalled();
        expect(response).toBe(true);
        done();
      });
    });

    it('should not allow to activate and navigate to unauthorized page when user does not have required role', (done) => {
      jest.spyOn(userProfileServiceV2, 'hasRequiredRoles').mockReturnValue(false);
      jest.spyOn(router, 'navigate').mockImplementation();

      adminAccessGuard.canActivate().subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/unauthorized-access']);
        done();
      });
    });
  });

  describe('canActivateChild', () => {
    it('should allow to activate child when user has required role', (done) => {
      jest.spyOn(router, 'navigate').mockImplementation();

      adminAccessGuard.canActivateChild().subscribe((response) => {
        expect(router.navigate).not.toHaveBeenCalled();
        expect(response).toBe(true);
        done();
      });
    });

    it('should not allow to activate child and navigate to unauthorized page when user does not have required role', (done) => {
      jest.spyOn(userProfileServiceV2, 'hasRequiredRoles').mockReturnValue(false);
      jest.spyOn(router, 'navigate').mockImplementation();

      adminAccessGuard.canActivateChild().subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/unauthorized-access']);
        done();
      });
    });
  });

  describe('canLoad', () => {
    it('should allow to load when user has required role', (done) => {
      jest.spyOn(router, 'navigate').mockImplementation();

      adminAccessGuard.canLoad().subscribe((response) => {
        expect(router.navigate).not.toHaveBeenCalled();
        expect(response).toBe(true);
        done();
      });
    });

    it('should not allow to load and navigate to unauthorized page when user does not have required role', (done) => {
      jest.spyOn(userProfileServiceV2, 'hasRequiredRoles').mockReturnValue(false);
      jest.spyOn(router, 'navigate').mockImplementation();

      adminAccessGuard.canLoad().subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/unauthorized-access']);
        done();
      });
    });
  });
});
