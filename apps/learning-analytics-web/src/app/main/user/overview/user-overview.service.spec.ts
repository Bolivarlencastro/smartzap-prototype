import { AnalyticsApiFilter, LearnAnalyticsApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { TranslocoService } from '@jsverse/transloco';
import { EMPTY, of } from 'rxjs';
import { UsersOverviewService } from './users-overview.service';

describe('UsersOverviewService', () => {
  let service: UsersOverviewService;
  let translateService: jest.Mocked<TranslocoService>;
  let learnAnalyticsService: jest.Mocked<LearnAnalyticsApi>;

  beforeEach(() => {
    translateService = { translate: jest.fn() } as unknown as jest.Mocked<TranslocoService>;
    learnAnalyticsService = {
      fetchUsersList: jest.fn(() => of(EMPTY)),
      fetchTotalUsers: jest.fn(() => of(EMPTY)),
      fetchActiveUsers: jest.fn(() => of(EMPTY)),
      fetchUserEnrollmentsDistribution: jest.fn(() => of(EMPTY)),
      fetchEngagementRate: jest.fn(() => of(EMPTY)),
      fetchAverageContentConsumedPerUser: jest.fn(() => of(EMPTY)),
      fetchUsersCreators: jest.fn(() => of(EMPTY)),
      fetchTopEnrollmentCategories: jest.fn(() => of(EMPTY)),
      fetchTopContentConsumed: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<LearnAnalyticsApi>;

    service = new UsersOverviewService(translateService, learnAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all fetch methods', () => {
    const filters: AnalyticsApiFilter = { start_date: '2024-01-01' };
    const fetchTotalUsersSpy = jest.spyOn(service, 'fetchTotalUsers');
    const fetchActiveUsersSpy = jest.spyOn(service, 'fetchActiveUsers');
    const fetchEnrollmentDistributionSpy = jest.spyOn(service, 'fetchEnrollmentDistribution');
    const fetchEngagementRateSpy = jest.spyOn(service, 'fetchEngagementRate');
    const fetchAverageContentConsumedPerUserSpy = jest.spyOn(service, 'fetchAverageContentConsumedPerUser');
    const fetchUsersCreatorsSpy = jest.spyOn(service, 'fetchUsersCreators');
    const fetchAverageActiveUsersPerDaySpy = jest.spyOn(service, 'fetchAverageActiveUsersPerDay');
    const fetchTopEnrollmentCategoriesSpy = jest.spyOn(service, 'fetchTopEnrollmentCategories');
    const fetchTopContentConsumedSpy = jest.spyOn(service, 'fetchTopContentConsumed');

    service.fetchAllForInterval(filters);

    expect(fetchTotalUsersSpy).toHaveBeenCalledWith(filters);
    expect(fetchActiveUsersSpy).toHaveBeenCalledWith(filters);
    expect(fetchEnrollmentDistributionSpy).toHaveBeenCalledWith(filters);
    expect(fetchEngagementRateSpy).toHaveBeenCalled();
    expect(fetchAverageContentConsumedPerUserSpy).toHaveBeenCalledWith(filters);
    expect(fetchUsersCreatorsSpy).toHaveBeenCalledWith(filters);
    expect(fetchAverageActiveUsersPerDaySpy).toHaveBeenCalledWith(filters);
    expect(fetchTopEnrollmentCategoriesSpy).toHaveBeenCalledWith(filters);
    expect(fetchTopContentConsumedSpy).toHaveBeenCalledWith(filters);
  });
});
