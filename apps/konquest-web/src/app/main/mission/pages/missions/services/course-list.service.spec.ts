import { TestBed } from '@angular/core/testing';
import { QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { CourseSearchService } from 'app/main/mission/services/courses-search.service';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { throwError } from 'rxjs';
import { CourseListService } from './course-list.service';

describe('CourseListService', () => {
  let service: CourseListService;
  let courseSearchServiceMock: jest.Mocked<CourseSearchService>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    courseSearchServiceMock = {
      fetchMissions: jest.fn(),
    } as unknown as jest.Mocked<CourseSearchService>;

    messageServiceMock = {
      error: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    TestBed.configureTestingModule({
      providers: [
        CourseListService,
        { provide: CourseSearchService, useValue: courseSearchServiceMock },
        { provide: MissionServiceV2, useValue: {} },
        { provide: KpMessageService, useValue: messageServiceMock },
      ],
    });

    service = TestBed.inject(CourseListService);
  });

  it('should call errorHandler when an error occurs', async () => {
    const mockError = new Error('Error fetching missions');
    courseSearchServiceMock.fetchMissions.mockReturnValue(throwError(() => mockError));

    const filter = { page: 1, per_page: 10, type: 'all', search: '' } as any;
    const screenType = 'missions';

    await expect(service.fetchMissions(filter, screenType).toPromise()).rejects.toThrow();

    expect(messageServiceMock.error).toHaveBeenCalledWith(CourseListService.DEFAULT_ERROR_MESSAGE);
  });

  it('should build the filter correctly', () => {
    const filter = {
      page: 2,
      per_page: 5,
      type: 'all',
      search: 'test',
      categories: ['cat1'],
      languages: ['pt-BR'],
      providers: ['alura'],
    };
    const screenType = 'missions';
    const result = (service as any).getMissionsFilter(filter, screenType);

    expect(result).toEqual({
      page: 2,
      per_page: 5,
      search: 'test',
      mission_model: ['INTERNAL', 'EXTERNAL_PROVIDER', 'SCORM'],
      mission_category: ['cat1'],
      language: ['pt-BR'],
      provider: ['alura'],
      development_status: 'DONE',
      is_active: true,
    });
  });

  it('should build the filter correctly when quick filter is "MINE"', () => {
    const filter = {
      page: 2,
      per_page: 5,
      type: QuickFilterType.MINE,
      search: 'test',
      categories: ['cat1'],
      languages: ['pt-BR'],
      providers: ['alura'],
    };
    const screenType = 'missions';
    const result = (service as any).getMissionsFilter(filter, screenType);

    expect(result).toEqual({
      page: 2,
      per_page: 5,
      search: 'test',
      mission_model: ['INTERNAL', 'EXTERNAL_PROVIDER', 'SCORM'],
      mission_category: ['cat1'],
      language: ['pt-BR'],
      provider: ['alura'],
      managed: true,
    });
  });

  it('should build the filter correctly when screen type is "events"', () => {
    const filter = {
      page: 2,
      per_page: 5,
      type: 'all',
      search: 'test',
      categories: ['cat1'],
      languages: ['pt-BR'],
      providers: ['alura'],
    };
    const screenType = 'events';
    const result = (service as any).getMissionsFilter(filter, screenType);

    expect(result).toEqual({
      page: 2,
      per_page: 5,
      search: 'test',
      mission_model: ['LIVE', 'PRESENTIAL'],
      mission_category: ['cat1'],
      language: ['pt-BR'],
    });
  });
});
