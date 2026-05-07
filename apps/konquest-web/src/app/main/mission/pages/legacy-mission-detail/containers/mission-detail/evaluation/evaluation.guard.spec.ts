import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Mission } from 'app/main/mission/mission.model';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { of } from 'rxjs';
import { MissionEvaluationsGuard } from './evaluation.guard';
import { MISSIONS_DETAIL_PREFIX } from 'app/shared/services';

const MOCK_ROUTE_STATE = { params: { id: '1' } } as unknown as ActivatedRouteSnapshot;
const MOCK_NAVIGATE_DETAIL = `${MISSIONS_DETAIL_PREFIX}/1`;

describe('MissionEvaluationsGuard', () => {
  let guard: MissionEvaluationsGuard;
  let missionService: jest.Mocked<MissionServiceV2>;
  let router: jest.Mocked<Router>;
  let userProfileService: jest.Mocked<UserProfileService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MissionServiceV2,
          useValue: { fetchMissionById: jest.fn() },
        },
        {
          provide: Router,
          useValue: { navigateByUrl: jest.fn() },
        },
        {
          provide: UserProfileService,
          useValue: { isCurator: jest.fn() },
        },
      ],
    });
    guard = TestBed.inject(MissionEvaluationsGuard);
    missionService = TestBed.inject(MissionServiceV2) as jest.Mocked<MissionServiceV2>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    userProfileService = TestBed.inject(UserProfileService) as jest.Mocked<UserProfileService>;
  });

  it('should activate when mission required_evaluation is true and logged user has roles', (done) => {
    missionService.fetchMissionById.mockReturnValue(of({ required_evaluation: true } as Mission));
    userProfileService.isCurator.mockReturnValue(true);

    guard.canActivate(MOCK_ROUTE_STATE).subscribe((canActivate) => {
      expect(canActivate).toBe(true);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not activate and navigate to detail when mission required_evaluation is true and logged user has no roles', (done) => {
    missionService.fetchMissionById.mockReturnValue(of({ required_evaluation: true } as Mission));
    userProfileService.isCurator.mockReturnValue(false);

    guard.canActivate(MOCK_ROUTE_STATE).subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith(MOCK_NAVIGATE_DETAIL);
      done();
    });
  });

  it('should not activate and navigate to detail when mission required_evaluation is false and logged user has roles', (done) => {
    missionService.fetchMissionById.mockReturnValue(of({ required_evaluation: false } as Mission));
    userProfileService.isCurator.mockReturnValue(true);

    guard.canActivate(MOCK_ROUTE_STATE).subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith(MOCK_NAVIGATE_DETAIL);
      done();
    });
  });

  it('should not activate and navigate to detail when mission required_evaluation is false and logged user has no roles', (done) => {
    missionService.fetchMissionById.mockReturnValue(of({ required_evaluation: false } as Mission));
    userProfileService.isCurator.mockReturnValue(false);

    guard.canActivate(MOCK_ROUTE_STATE).subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith(MOCK_NAVIGATE_DETAIL);
      done();
    });
  });
});
