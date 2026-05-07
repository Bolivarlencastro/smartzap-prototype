import { ContentManagementService } from './content-management.service';
import { CourseSearchService } from 'app/main/mission/services/courses-search.service';
import { TrailsSearchService } from 'app/main/mission/services/trails-search.service';
import { of } from 'rxjs';
import {
  CoursesListParams,
  CoursesResponse,
  PageParams,
  PageResponse,
  TrailsListParams,
  TrailsResponse,
} from '@core/model/search-api';
import { Chance } from 'chance';
import { LearnContentListFilter } from 'app/main/content-management/models/learn-content-list-filter';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionModel } from 'app/main/mission/mission.model';

describe('ContentManagementService', () => {
  let service: ContentManagementService;
  let courseSearchServiceMock: jest.Mocked<CourseSearchService>;
  let trailsSearchServiceMock: jest.Mocked<TrailsSearchService>;
  const chance = new Chance();

  beforeEach(() => {
    courseSearchServiceMock = { fetchMissions: jest.fn() } as unknown as jest.Mocked<CourseSearchService>;
    trailsSearchServiceMock = { fetchTrails: jest.fn() } as unknown as jest.Mocked<TrailsSearchService>;

    service = new ContentManagementService(courseSearchServiceMock, trailsSearchServiceMock);
  });

  describe('fetchContent', () => {
    it('should fetch trails with the correct filter', (done) => {
      const mockTrailsResponse = { items: [] } as PageResponse<TrailsResponse>;
      trailsSearchServiceMock.fetchTrails.mockReturnValueOnce(of(mockTrailsResponse));
      const filter: LearnContentListFilter = {
        language: ['pt'],
        managed: true,
        page: 1,
        per_page: 10,
        search: 'trails search',
      };
      const expectedFilter: TrailsListParams & PageParams = {
        managed: filter.managed,
        page: filter.page,
        per_page: filter.per_page,
        search: filter.search,
        language: filter.language,
      };

      service.loadLearnContent(filter, 'trails', false).subscribe({
        next: () => {
          expect(trailsSearchServiceMock.fetchTrails).toHaveBeenCalledWith(expectedFilter);
          done();
        },
      });
    });

    it('should fetch courses with the correct filter', (done) => {
      const mockCoursesResponse = { items: [] } as PageResponse<CoursesResponse>;
      courseSearchServiceMock.fetchMissions.mockReturnValueOnce(of(mockCoursesResponse));
      const filter: LearnContentListFilter = {
        managed: true,
        page: 1,
        per_page: 10,
        development_status: DevelopmentStatus.DONE,
        mission_category: [chance.guid()],
        search: 'courses search',
      };
      const expectedFilter: CoursesListParams & PageParams = {
        managed: filter.managed,
        page: filter.page,
        per_page: filter.per_page,
        search: filter.search,
        mission_category: filter.mission_category,
        development_status: filter.development_status,
        mission_model: [MissionModel.INTERNAL, MissionModel.SCORM, MissionModel.EXTERNAL_PROVIDER],
      };

      service.loadLearnContent(filter, 'courses', false).subscribe({
        next: () => {
          expect(courseSearchServiceMock.fetchMissions).toHaveBeenCalledWith(expectedFilter);
          done();
        },
      });
    });

    it('should fetch events with the correct filter', (done) => {
      const mockEventsResponse = { items: [] } as PageResponse<CoursesResponse>;
      courseSearchServiceMock.fetchMissions.mockReturnValueOnce(of(mockEventsResponse));
      const filter: LearnContentListFilter = {
        managed: true,
        page: 1,
        per_page: 10,
        development_status: DevelopmentStatus.DONE,
        mission_category: [chance.guid()],
        search: 'events search',
      };
      const expectedFilter: CoursesListParams & PageParams = {
        managed: filter.managed,
        page: filter.page,
        per_page: filter.per_page,
        search: filter.search,
        mission_category: filter.mission_category,
        development_status: filter.development_status,
        mission_model: [MissionModel.PRESENTIAL, MissionModel.LIVE],
      };

      service.loadLearnContent(filter, 'events', false).subscribe({
        next: () => {
          expect(courseSearchServiceMock.fetchMissions).toHaveBeenCalledWith(expectedFilter);
          done();
        },
      });
    });

    it('should fetch contents for content creators', (done) => {
      const mockEventsResponse = { items: [] } as PageResponse<CoursesResponse>;
      courseSearchServiceMock.fetchMissions.mockReturnValueOnce(of(mockEventsResponse));
      const filter: LearnContentListFilter = {
        managed: false,
        page: 1,
        per_page: 10,
        development_status: DevelopmentStatus.DONE,
        mission_category: [chance.guid()],
        search: 'events search',
      };
      const expectedFilter = {
        page: filter.page,
        per_page: filter.per_page,
        search: filter.search,
        mission_category: filter.mission_category,
        development_status: filter.development_status,
        mission_model: [MissionModel.PRESENTIAL, MissionModel.LIVE],
        managed: true,
      };

      service.loadLearnContent(filter, 'events', true).subscribe({
        next: () => {
          expect(courseSearchServiceMock.fetchMissions).toHaveBeenCalledWith(expectedFilter);
          done();
        },
      });
    });
  });
});
