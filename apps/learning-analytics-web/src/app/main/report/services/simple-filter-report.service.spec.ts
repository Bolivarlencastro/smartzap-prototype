import { SimpleFilterReportService } from './simple-filter-report.service';
import { KonquestApiClient, SmartzapAPI } from '@core/api';
import { AuthService, MyAccountV2Client, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { of } from 'rxjs';
import { ReportType } from 'app/main/report/enums/report';

describe('SimpleFilterReportService', () => {
  let service: SimpleFilterReportService;
  let konquestApi: jest.Mocked<KonquestApiClient>;
  const myAccountApi: jest.Mocked<MyAccountV2Client> = null as jest.Mocked<MyAccountV2Client>;
  const smartzapApi: jest.Mocked<SmartzapAPI> = null as jest.Mocked<SmartzapAPI>;
  const userProfileService: jest.Mocked<UserProfileService> = null as jest.Mocked<UserProfileService>;
  const authService: jest.Mocked<AuthService> = null as jest.Mocked<AuthService>;

  beforeEach(() => {
    konquestApi = { get: jest.fn().mockReturnValue(of({ results: [] })) } as unknown as jest.Mocked<KonquestApiClient>;
    service = new SimpleFilterReportService(konquestApi, myAccountApi, smartzapApi, userProfileService, authService);
  });

  describe('fetchListOptions', () => {
    it(`should fetch channels for reportType ${ReportType.MISSION_QUIZ}`, (done) => {
      const filter = { reportType: ReportType.MISSION_QUIZ, search: '' };
      const expectedParams = { search: '', per_page: 50, ordering: 'name', with_quizzes: true };

      service.fetchListOptions(filter).subscribe(() => {
        expect(konquestApi.get).toHaveBeenCalledWith('/missions', expectedParams);
        done();
      });
    });
  });
});
