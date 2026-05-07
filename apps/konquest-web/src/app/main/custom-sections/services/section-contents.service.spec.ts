import { CustomSectionsAPI } from '@core/api/base/custom-sections.api';
import { SearchAPI } from '@core/api/base/search.api';
import { of } from 'rxjs';
import { LearningObjectType } from '../models/custom-sections';
import { ContentTabType } from '../models/section-contents';
import { SectionContentsService } from './section-contents.service';

describe('SectionContentsService', () => {
  let service: SectionContentsService;
  let customSectionsApiMock: jest.Mocked<CustomSectionsAPI>;
  let searchApiMock: jest.Mocked<SearchAPI>;

  beforeEach(() => {
    customSectionsApiMock = {
      patch: jest.fn(() => of(true)),
    } as unknown as jest.Mocked<CustomSectionsAPI>;

    searchApiMock = {
      get: jest.fn(() => of({ items: [] })),
    } as unknown as jest.Mocked<SearchAPI>;

    service = new SectionContentsService(customSectionsApiMock, searchApiMock);
  });

  describe('getData', () => {
    it('should return categories', (done) => {
      const [learningObjectType, activeTab, search, categories] = [
        'HIGHLIGHT.COURSE' as LearningObjectType,
        'category' as ContentTabType,
        'test',
        [
          { id: '1', name: 'test1' },
          { id: '2', name: 'test2' },
          { id: '3', name: 'name1' },
          { id: '4', name: 'name2' },
        ],
      ];

      service.getData(learningObjectType, activeTab, search, categories).subscribe((result) => {
        expect(result).toEqual([
          { id: '1', name: 'test1' },
          { id: '2', name: 'test2' },
        ]);
        done();
      });
    });

    it('should return learning objects', (done) => {
      const [learningObjectType, activeTab, search] = [
        'HIGHLIGHT.COURSE' as LearningObjectType,
        'learning-object' as ContentTabType,
        'test',
      ];

      const filter = {
        dataType: 'courses',
        mission_model: ['INTERNAL', 'EXTERNAL_PROVIDER', 'SCORM'],
        page: 1,
        per_page: 35,
        search,
        development_status: 'DONE',
      };

      service.getData(learningObjectType, activeTab, search, null).subscribe(() => {
        expect(searchApiMock.get).toHaveBeenCalledWith('/v1/global', filter);
        done();
      });
    });
  });

  describe('editSectionContents', () => {
    it('should edit a section with saved contents', (done) => {
      const [ids, section, activeTab] = [
        ['456', '999'],
        { id: '123', filters: { ID: ['123', '456'], CATEGORY_IDS: ['555', '777'] } },
        'learning-object' as ContentTabType,
      ];

      const filters = { ID: ['123', '456', '999'], CATEGORY_IDS: ['555', '777'] };

      service.editSectionContents(ids, section, activeTab).subscribe(() => {
        expect(customSectionsApiMock.patch).toHaveBeenCalledWith(`/sections/${section.id}`, { filters });
        done();
      });
    });

    it('should edit a section without saved contents', (done) => {
      const [ids, section, activeTab] = [['123', '456'], { id: '123', filters: null }, 'category' as ContentTabType];

      const filters = { CATEGORY_IDS: ['123', '456'] };

      service.editSectionContents(ids, section, activeTab).subscribe(() => {
        expect(customSectionsApiMock.patch).toHaveBeenCalledWith(`/sections/${section.id}`, { filters });
        done();
      });
    });
  });
});
