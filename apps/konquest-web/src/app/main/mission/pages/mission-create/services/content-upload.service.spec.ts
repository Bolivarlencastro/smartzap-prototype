import { LearnContentService } from '@core/api';
import { MissionStage } from 'app/main/mission/mission.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { EMPTY, of } from 'rxjs';
import { ContentCreateService } from './content-create.service';
import { ContentUploadService } from './content-upload.service';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';

const mockMissionId = 'mock_mission_id';

describe('ContentUploadService', () => {
  let service: ContentUploadService;
  const storeMock = { dispatch: jest.fn() } as any;
  let contentCreateServiceMock: jest.Mocked<ContentCreateService>;
  let learnContentServiceMock: jest.Mocked<LearnContentService>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    contentCreateServiceMock = { createMissionStageContent: jest.fn().mockReturnValue(of(EMPTY)) } as any;
    learnContentServiceMock = { createLearnContent: jest.fn().mockReturnValue(of(EMPTY)) } as any;
    messageServiceMock = { error: jest.fn() } as any;
    service = new ContentUploadService(
      storeMock,
      contentCreateServiceMock,
      learnContentServiceMock,
      messageServiceMock,
    );

    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUpload', () => {
    const mockStage: MissionStage = { name: 'mock_stage', contents: [] };
    const mockContent: ContentFormData = { name: 'mock_content', type: 'YOUTUBE', value: '' };
    it('should create a new upload', () => {
      const mockUploadId = '4fzzzxj';

      const expectedUpload = {
        id: mockUploadId,
        loading: true,
        percentage: 0,
      };

      service.createUpload(mockStage, mockMissionId, mockContent);

      const uploads = service.uploads();
      expect(uploads).toEqual([expect.objectContaining(expectedUpload)]);
      expect(uploads).toHaveLength(1);
    });
  });
});
