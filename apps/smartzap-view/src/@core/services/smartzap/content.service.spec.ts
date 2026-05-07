import { SmartzapApi } from '@core/api';
import { EMPTY, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;
  let smartzapApiMock: jest.Mocked<SmartzapApi>;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(() => {
    smartzapApiMock = {
      get: jest.fn(() => of(EMPTY)),
      post: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<SmartzapApi>;

    authServiceMock = {
      userId: '789',
    } as unknown as jest.Mocked<AuthService>;

    service = new ContentService(smartzapApiMock, authServiceMock);
  });

  it('should fetchContent', (done) => {
    service.fetchContent('789').subscribe(() => {
      expect(smartzapApiMock.get).toHaveBeenCalledWith('/view/content/789');
      done();
    });
  });

  describe('createAnswerer', () => {
    it('should create answerer with options for non-text input type', (done) => {
      const questionId = '123';
      const optionId = ['1123', '1124'];
      const expectedBody = {
        user_id: '789',
        questions: [
          {
            id: questionId,
            options: optionId,
          },
        ],
      };

      service.createAnswerer({ questionId, optionId }).subscribe(() => {
        expect(smartzapApiMock.post).toHaveBeenCalledWith('/view/answers', expectedBody);
        done();
      });
    });

    it('should create answerer with text_response for text input type', (done) => {
      const questionId = '123';
      const optionId = ['User typed text'];
      const isTextInputType = true;
      const expectedBody = {
        user_id: '789',
        questions: [
          {
            id: questionId,
            text_response: optionId[0],
          },
        ],
      };

      service.createAnswerer({ questionId, optionId, isTextInputType }).subscribe(() => {
        expect(smartzapApiMock.post).toHaveBeenCalledWith('/view/answers', expectedBody);
        done();
      });
    });
  });
});
