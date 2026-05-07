import { DashboardService } from './dashboard.service';
import { DevelopmentStatus, EnrollmentStatuses, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KonquestMissionAPI } from '@core/api/base/konquest-mission.api';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { CourseSearchService } from 'app/main/mission/services/courses-search.service';
import { EMPTY, of } from 'rxjs';
import { MissionModel } from 'app/main/mission/mission.model';
import { CoursesListParams, PageParams } from '@core/model/search-api';

describe('DashboardService', () => {
  let service: DashboardService;
  let missionsApiMock: jest.Mocked<KonquestMissionAPI>;
  let trailsApiMock: jest.Mocked<LearningTrailAPI>;
  let userProfileMock: jest.Mocked<UserProfileService>;
  let coursesSearchServiceMock: jest.Mocked<CourseSearchService>;

  beforeEach(() => {
    missionsApiMock = {
      fetchMissionsDashboardPriority: jest.fn().mockReturnValue(of(EMPTY)),
      fetchMissionsRecommendations: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<KonquestMissionAPI>;

    trailsApiMock = {
      getRecommendationsLearningTrails: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<LearningTrailAPI>;

    userProfileMock = {
      isSuperAdmin: jest.fn().mockReturnValue(false),
      isAdmin: jest.fn().mockReturnValue(false),
    } as unknown as jest.Mocked<UserProfileService>;

    coursesSearchServiceMock = {
      fetchMissions: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<CourseSearchService>;

    service = new DashboardService(missionsApiMock, trailsApiMock, userProfileMock, coursesSearchServiceMock);
  });

  it('it should fetch events', () => {
    service.fetchEvents();
    const expectedParams: CoursesListParams & PageParams = {
      development_status: DevelopmentStatus.DONE,
      is_active: true,
      mission_model: [MissionModel.LIVE, MissionModel.PRESENTIAL],
      exclude_enrollment_status: [EnrollmentStatuses.EXPIRED],
      page: 1,
      per_page: 5,
    };

    expect(coursesSearchServiceMock.fetchMissions).toHaveBeenCalledWith(expectedParams);
  });
});
