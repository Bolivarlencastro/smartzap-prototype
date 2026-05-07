import { TestBed } from '@angular/core/testing';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { of } from 'rxjs';
import { LearnContentsService } from './learn-contents.service';
import { LearnContentsApi } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('LearnContentsService', () => {
  let service: LearnContentsService;
  let http: jest.Mocked<LearnContentsApi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        LearnContentsService,
        { provide: LearnContentsApi, useValue: { saveCoverWithSize: jest.fn() } },
        { provide: KpMessageService, useValue: { error: jest.fn() } },
      ],
    }).compileComponents();

    service = TestBed.inject(LearnContentsService);
    http = TestBed.inject(LearnContentsApi) as jest.Mocked<LearnContentsApi>;
  });

  it('should call postFormData', (done) => {
    http.saveCoverWithSize.mockReturnValue(of({ url: '' }));
    const image = new File([], 'image.png');

    service.getCoverUrl(image, 100, 100).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(http.saveCoverWithSize).toHaveBeenCalledWith(image, 100, 100);
      done();
    });
  });
});
