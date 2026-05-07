import { KonquestAPI } from '@core/api/base';
import { EMPTY, of } from 'rxjs';
import { LearningTrailAPI } from './learning-trail.api';

describe('LearningTrailAPI', () => {
  const konquestApiMock: jest.Mocked<KonquestAPI> = {
    post: jest.fn(() => of(EMPTY)),
    get: jest.fn(),
    postFormData: jest.fn(() => of(EMPTY)),
  } as unknown as jest.Mocked<KonquestAPI>;

  const BASE_PATH = '/learning-trails';
  let service: LearningTrailAPI;

  beforeEach(() => {
    service = new LearningTrailAPI(konquestApiMock, null);
  });

  describe('transferLearningTrial', () => {
    it('should make the transfer request', (done) => {
      const expectedPayload = {
        target_workspace: 'mock_workspace_id',
        user_creator: 'mock_owner_id',
      };

      service.transferLearningTrial('mock_trail_id', 'mock_owner_id', 'mock_workspace_id').subscribe(() => {
        expect(konquestApiMock.post).toHaveBeenCalledWith('/learning-trails/mock_trail_id/transfer', expectedPayload);

        done();
      });
    });
  });

  it('should return the learningTrial contents', () => {
    const [id, filters] = ['mock_trail_id', { search: 'test' }];
    konquestApiMock.get.mockReturnValueOnce(of({ results: { Mission: [], Pulse: [] } }));
    service.getLearningTrailContents(id, filters);
    expect(konquestApiMock.get).toHaveBeenCalledWith(`${BASE_PATH}/${id}/available-contents`, filters);
  });

  describe('postLearningTrailImage', () => {
    const cases: any[] = [
      ['holder_image', '1920', '640'],
      ['thumb_image', '1920', '1080'],
    ];

    test.each(cases)('should append file and dimensions to formData: %p', (imageType, width, height) => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('width', width);
      formData.append('height', height);
      const postSpy = jest.spyOn(konquestApiMock, 'postFormData');

      service.postLearningTrailImage({ file, imageType }).subscribe();

      expect(postSpy).toHaveBeenCalledWith('/learn-contents/cover-images-by-size', formData);
    });
  });
});
