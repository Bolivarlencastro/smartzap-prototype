import { TestBed } from '@angular/core/testing';
import { KontentAPI } from '@core/api';
import { LearnContent, LearnContentType } from '@core/model';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { of } from 'rxjs';
import { LearnContentService } from './learn-content.service';

class KontentAPIMock {
  post(_url: string, _data: any) {
    return of({});
  }

  postFormData(_url: string, _data: FormData) {
    return of({});
  }
}

describe('LearnContentService', () => {
  let learnContentService: LearnContentService;
  let kontentApiService: KontentAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: KontentAPI, useClass: KontentAPIMock }],
    });
    learnContentService = TestBed.inject(LearnContentService);
    kontentApiService = TestBed.inject(KontentAPI);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('createLearnContent', () => {
    it('should call http.post when type is not FILE', (done) => {
      const contentFormData: ContentFormData = {
        type: 'YOUTUBE' as LearnContentType,
        name: 'video',
        description: 'desc',
        value: 'https://youtu.be/abc123',
      };
      jest.spyOn(kontentApiService, 'post').mockReturnValue(of({} as LearnContent));

      learnContentService.createLearnContent(contentFormData, false).subscribe(() => {
        expect(kontentApiService.post).toHaveBeenCalledWith('/learn-content', {
          name: contentFormData.name,
          description: contentFormData.description,
          link: 'https://www.youtube.com/watch?v=abc123',
        });
        done();
      });
    });

    it('should call http.postFormData when type is FILE', (done) => {
      const mockFile = new File(['content'], 'file.pdf');
      const contentFormData: ContentFormData = {
        type: 'FILE' as LearnContentType,
        name: 'file',
        description: 'desc',
        value: mockFile,
      };
      jest.spyOn(kontentApiService, 'postFormData').mockReturnValue(of({} as LearnContent));

      learnContentService.createLearnContent(contentFormData, false).subscribe(() => {
        expect(kontentApiService.postFormData).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('uploadFile', () => {
    it('should append is_whatsapp_content True to FormData when messagesContentEmbed is true', (done) => {
      const mockFile = new File(['content'], 'file.pdf');
      const contentFormData: ContentFormData = {
        type: 'FILE' as LearnContentType,
        name: 'file',
        description: 'desc',
        value: mockFile,
      };
      jest.spyOn(kontentApiService, 'postFormData').mockReturnValue(of({} as LearnContent));

      learnContentService.createLearnContent(contentFormData, true).subscribe(() => {
        const formData = (kontentApiService.postFormData as jest.Mock).mock.calls[0][1] as FormData;
        expect(formData.get('is_whatsapp_content')).toBe('True');
        done();
      });
    });

    it('should append is_whatsapp_content False to FormData when messagesContentEmbed is false', (done) => {
      const mockFile = new File(['content'], 'file.pdf');
      const contentFormData: ContentFormData = {
        type: 'FILE' as LearnContentType,
        name: 'file',
        description: 'desc',
        value: mockFile,
      };
      jest.spyOn(kontentApiService, 'postFormData').mockReturnValue(of({} as LearnContent));

      learnContentService.createLearnContent(contentFormData, false).subscribe(() => {
        const formData = (kontentApiService.postFormData as jest.Mock).mock.calls[0][1] as FormData;
        expect(formData.get('is_whatsapp_content')).toBe('False');
        done();
      });
    });

    it('should append file, name and description to FormData', (done) => {
      const mockFile = new File(['content'], 'file.pdf');
      const contentFormData: ContentFormData = {
        type: 'FILE' as LearnContentType,
        name: 'my file',
        description: 'my description',
        value: mockFile,
      };
      jest.spyOn(kontentApiService, 'postFormData').mockReturnValue(of({} as LearnContent));

      learnContentService.createLearnContent(contentFormData, false).subscribe(() => {
        const formData = (kontentApiService.postFormData as jest.Mock).mock.calls[0][1] as FormData;
        expect(formData.get('file')).toBe(mockFile);
        expect(formData.get('name')).toBe(contentFormData.name);
        expect(formData.get('description')).toBe(contentFormData.description);
        done();
      });
    });
  });
});
