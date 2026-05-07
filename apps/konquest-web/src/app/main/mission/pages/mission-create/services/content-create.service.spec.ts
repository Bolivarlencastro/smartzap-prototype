import { KonquestMissionStageAPI, LearnContentService } from '@core/api';
import { MissionStageContent } from 'app/main/mission/models';
import { EMPTY, of } from 'rxjs';
import { ContentCreateService } from './content-create.service';

describe('ContentCreateService', () => {
  let service: ContentCreateService;
  let stageApiMock: jest.Mocked<KonquestMissionStageAPI>;
  let learnContentServiceMock: jest.Mocked<LearnContentService>;

  beforeEach(() => {
    stageApiMock = { createContent: jest.fn().mockReturnValue(of(EMPTY)) } as any;
    learnContentServiceMock = { fetchLearnContentType: jest.fn().mockReturnValue(of(EMPTY)) } as any;
    service = new ContentCreateService(stageApiMock, learnContentServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createMissionStageContent', () => {
    const mockStageContent: MissionStageContent = {
      content_type: '',
      learn_content_uuid: 'mock_uuid',
      order: 0,
      stage: '',
      name: '',
      content_type_id: 'mock_content_type_id',
    };
    it('should call createContent', (done) => {
      service.createMissionStageContent(mockStageContent).subscribe(() => {
        expect(stageApiMock.createContent).toHaveBeenCalledWith(mockStageContent);
        done();
      });
    });

    it('should call fetchLearnContentType', (done) => {
      service.createMissionStageContent(mockStageContent).subscribe(() => {
        expect(learnContentServiceMock.fetchLearnContentType).toHaveBeenCalledWith(mockStageContent.content_type_id);
        done();
      });
    });
  });
});
