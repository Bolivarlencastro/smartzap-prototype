import { ContentService } from './content.service';
import { KontentApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';

describe('ContentService', () => {
  let service: ContentService;
  let kontentApiMock: jest.Mocked<KontentApi>;

  beforeEach(() => {
    kontentApiMock = {
      fetchLearnContentById: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<KontentApi>;

    service = new ContentService(kontentApiMock);
  });

  it('should fetch a learn content by Id', () => {
    service.loadContent('mock_id');
    expect(kontentApiMock.fetchLearnContentById).toHaveBeenCalledWith('mock_id');
  });
});
