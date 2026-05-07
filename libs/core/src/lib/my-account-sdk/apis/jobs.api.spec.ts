import { JobsApi } from './jobs.api';
import { MyAccountV2Client } from './my-account-v2.client';

describe('JobsApiService', () => {
  let service: JobsApi;
  let myAccountClientMock: jest.Mocked<MyAccountV2Client>;

  beforeEach(() => {
    myAccountClientMock = { get: jest.fn() } as any;
    service = new JobsApi(myAccountClientMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchJobs', () => {
    it('should get jobs with search param', () => {
      service.fetchJobs('mock_search');

      expect(myAccountClientMock.get).toHaveBeenCalledWith('/jobs', { search: 'mock_search' });
    });

    it('should get jobs without search param', () => {
      service.fetchJobs();

      expect(myAccountClientMock.get).toHaveBeenCalledWith('/jobs', {});
    });
  });

  describe('fetchJobFunctions', () => {
    it('should get jobFunctions with search param', () => {
      service.fetchJobFunctions('mock_search');

      expect(myAccountClientMock.get).toHaveBeenCalledWith('/job-functions', { search: 'mock_search' });
    });

    it('should get jobFunctions without search param', () => {
      service.fetchJobFunctions();

      expect(myAccountClientMock.get).toHaveBeenCalledWith('/job-functions', {});
    });
  });
});
