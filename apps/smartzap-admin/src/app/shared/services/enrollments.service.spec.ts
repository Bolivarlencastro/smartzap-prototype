import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { SmartzapAPI } from '@core/api';
import { EnrollmentsService } from './enrollments.service';

describe('EnrollmentsService', () => {
  let enrollmentsService: EnrollmentsService;
  let smartzapApiMock: jest.Mocked<SmartzapAPI>;

  beforeEach(() => {
    smartzapApiMock = {
      get: jest.fn(() => of(EMPTY)),
      post: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<SmartzapAPI>;

    TestBed.configureTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: SmartzapAPI,
          useValue: smartzapApiMock,
        },
      ],
    });
    enrollmentsService = TestBed.inject(EnrollmentsService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('buildSort', () => {
    const cases: any[] = [
      [undefined, '-created'],
      [null, '-created'],
      ['asc', 'name'],
      ['desc', '-name'],
    ];

    test.each(cases)('should return the correct value when direction is %p', (direction, expectedValue) => {
      const result = enrollmentsService.buildSort({ field: 'name', direction });
      expect(result).toBe(expectedValue);
    });
  });

  describe('fetchEnrollments', () => {
    it('should fetch enrollments', (done) => {
      const pagination = { page: 1, per_page: 10 };
      const responseMock = {
        count: 0,
        page: 1,
        per_page: 10,
        total_pages: 0,
        result: [],
      };
      smartzapApiMock.get.mockReturnValueOnce(of(responseMock));

      enrollmentsService.fetchEnrollments({ pagination }).subscribe((result) => {
        expect(smartzapApiMock.get).toHaveBeenCalledWith('/enrollment', {
          page: pagination.page.toString(),
          per_page: pagination.per_page.toString(),
        });
        expect(result).toEqual({
          page: {
            count: responseMock.count,
            page: responseMock.page,
            per_page: responseMock.per_page,
            total_pages: responseMock.total_pages,
          },
          collection: responseMock.result,
        });
        done();
      });
    });

    it('should fetch enrollments with sort', (done) => {
      const pagination = { page: 1, per_page: 10 };
      const sort = enrollmentsService.buildSort({ field: 'name', direction: 'asc' });
      const responseMock = {
        count: 0,
        page: 1,
        per_page: 10,
        total_pages: 0,
        result: [],
      };
      smartzapApiMock.get.mockReturnValueOnce(of(responseMock));

      enrollmentsService.fetchEnrollments({ pagination, sort }).subscribe(() => {
        expect(smartzapApiMock.get).toHaveBeenCalledWith('/enrollment', {
          page: pagination.page.toString(),
          per_page: pagination.per_page.toString(),
          sort,
        });
        done();
      });
    });
  });

  describe('fetchTracking', () => {
    it('should fetch enrollment tracking', (done) => {
      const enrollmentId = 'enrollmentId';

      enrollmentsService.fetchTracking(enrollmentId).subscribe(() => {
        expect(smartzapApiMock.get).toHaveBeenCalledWith(`/enrollment/${enrollmentId}/tracking`);
        done();
      });
    });
  });

  describe('renewContentAccess', () => {
    it('should request renew content access', (done) => {
      const contentId = 'contentId';
      const enrollmentId = 'enrollmentId';

      enrollmentsService.renewContentAccess({ contentId, enrollmentId }).subscribe(() => {
        expect(smartzapApiMock.post).toHaveBeenCalledWith(
          `/content/${contentId}/enrollment/${enrollmentId}/renew-access`,
          null,
        );
        done();
      });
    });
  });

  describe('countSentMessages', () => {
    it('should request sent messages count', (done) => {
      const params = {};

      enrollmentsService.countSentMessages().subscribe(() => {
        expect(smartzapApiMock.get).toHaveBeenCalledWith('/schedule/sent-messages-count', params);
        done();
      });
    });

    it('should request sent messages count with params', (done) => {
      const startDate = '2022-01-01';
      const endDate = '2022-12-31';
      const params = { send_date__gte: startDate, send_date__lte: endDate };

      enrollmentsService.countSentMessages({ startDate, endDate }).subscribe(() => {
        expect(smartzapApiMock.get).toHaveBeenCalledWith('/schedule/sent-messages-count', params);
        done();
      });
    });
  });

  describe('countPendingMessages', () => {
    it('should request pending messages count', (done) => {
      enrollmentsService.countPendingMessages().subscribe(() => {
        expect(smartzapApiMock.get).toHaveBeenCalledWith('/enrollment/messages-pending-count');
        done();
      });
    });
  });

  describe('countTotalUsers', () => {
    it('should request total users count', (done) => {
      enrollmentsService.countTotalUsers().subscribe(() => {
        expect(smartzapApiMock.get).toHaveBeenCalledWith('/user/count');
        done();
      });
    });
  });

  describe('countEnrollmentsByStatus', () => {
    it('should request enrollments by status count', (done) => {
      enrollmentsService.countEnrollmentsByStatus().subscribe(() => {
        expect(smartzapApiMock.get).toHaveBeenCalledWith('/enrollment/status-count');
        done();
      });
    });
  });
});
