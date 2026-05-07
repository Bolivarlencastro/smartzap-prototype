import { TestBed } from '@angular/core/testing';
import {
  CoursesFilterModel,
  PushManagerApi,
  PushTemplate,
  SmartzapAdminAPI,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { of } from 'rxjs';
import { CreationService } from './creation.service';

const mockPushTemplates: PushTemplate[] = [
  {
    id: 't1',
    name: 'template_one',
    content_sid: '',
    title: 'Template One',
    body_preview: 'Hello {{name}}',
    variables: [{ name: 'name', position: 1, required: true }],
    category: '',
    language: '',
    is_active: true,
    cost_per_message: '',
  },
];

describe('CreationService', () => {
  let service: CreationService;
  let pushManagerApiMock: jest.Mocked<PushManagerApi>;
  let smartzapApiMock: jest.Mocked<SmartzapAdminAPI>;

  beforeEach(() => {
    pushManagerApiMock = {
      fetchTemplates: jest.fn(() => of({ itens: mockPushTemplates, total: 1 })),
    } as unknown as jest.Mocked<PushManagerApi>;

    smartzapApiMock = {
      fetchCourses: jest.fn(() => of({ result: [] })),
    } as unknown as jest.Mocked<SmartzapAdminAPI>;

    TestBed.configureTestingModule({
      providers: [
        CreationService,
        { provide: PushManagerApi, useValue: pushManagerApiMock },
        { provide: SmartzapAdminAPI, useValue: smartzapApiMock },
      ],
    });

    service = TestBed.inject(CreationService);
  });

  it('should mapear itens da resposta de fetchTemplates', (done) => {
    service.fetchTemplates().subscribe((value) => {
      expect(value).toEqual(mockPushTemplates);
      done();
    });
  });

  it('should call fetchCourses', (done) => {
    const filter: CoursesFilterModel = { page: 1, per_page: 50, name__ilike: '1' };

    service.fetchCourses(filter).subscribe(() => {
      expect(smartzapApiMock.fetchCourses).toHaveBeenCalledWith(filter);
      done();
    });
  });
});
