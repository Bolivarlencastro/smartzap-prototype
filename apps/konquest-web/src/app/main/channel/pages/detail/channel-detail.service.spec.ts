import { MatDialog } from '@angular/material/dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { ChannelService, PulseService } from '@core/api';
import { EMPTY, of, Subject, throwError } from 'rxjs';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { ChannelDetailService } from './channel-detail.service';
import { PulseUploadService } from 'app/main/channel/pages/detail/pulse-upload.service';
import { HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';

const mockContent: ContentFormData = { name: 'mock_content_name', type: 'LINK' } as ContentFormData;

describe('ChannelDetailService', () => {
  let service: ChannelDetailService;
  let dialogMock: jest.Mocked<MatDialog>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let channelServiceMock: jest.Mocked<ChannelService>;
  let pulseServiceMock: jest.Mocked<PulseService>;
  let pulseUploadService: PulseUploadService;

  beforeEach(() => {
    pulseUploadService = new PulseUploadService();
    messageServiceMock = { success: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    channelServiceMock = {
      createPulse: jest.fn().mockReturnValue(of({ id: 'mock_pulse_id' })),
    } as unknown as jest.Mocked<ChannelService>;
    pulseServiceMock = { updatePulse: jest.fn().mockReturnValue(of(EMPTY)) } as unknown as jest.Mocked<PulseService>;

    dialogMock = {
      open: jest.fn(() => ({ afterClosed: jest.fn().mockReturnValue(of(mockContent)) })),
    } as unknown as jest.Mocked<MatDialog>;

    service = new ChannelDetailService(
      dialogMock,
      messageServiceMock,
      channelServiceMock,
      pulseUploadService,
      pulseServiceMock,
    );
  });

  it('should open the pulse creation dialog', (done) => {
    service.openPulseCreateDialog().subscribe({
      next: () => {
        expect(dialogMock.open).toHaveBeenCalled();
        done();
      },
    });
  });

  describe('createPulse', () => {
    it('should initialize a new file upload with a 100% for the initial percentage when content-type is a link', (done) => {
      const addUploadSpy = jest.spyOn(pulseUploadService, 'addFileUpload');
      service.createPulse('mock_channel_id', mockContent).subscribe({
        next: () => {
          expect(addUploadSpy).toHaveBeenCalledWith(expect.any(String), mockContent.name, expect.any(Subject), 100);
          done();
        },
      });
    });

    it('should add a new file upload with a 0% for the initial percentage when content-type is a file', (done) => {
      const addUploadSpy = jest.spyOn(pulseUploadService, 'addFileUpload');
      service.createPulse('mock_channel_id', { ...mockContent, value: new File([], 'test.txt') }).subscribe({
        next: () => {
          expect(addUploadSpy).toHaveBeenCalledWith(expect.any(String), 'test.txt', expect.any(Subject), 0);
          done();
        },
      });
    });

    it('should update the pulse with the cover image url after creation', (done) => {
      service.createPulse('mock_channel_id', { ...mockContent, coverImage: 'mock_file_url' }).subscribe({
        next: () => {
          expect(pulseServiceMock.updatePulse).toHaveBeenCalledWith('mock_pulse_id', { holder_image: 'mock_file_url' });
          done();
        },
      });
    });

    it('should report the file upload progress', (done) => {
      const mockEvent: HttpProgressEvent = {
        type: HttpEventType.UploadProgress,
        loaded: 100,
        total: 200,
      };
      channelServiceMock.createPulse.mockReturnValueOnce(of(mockEvent));
      const updateUploadSpy = jest.spyOn(pulseUploadService, 'updateFileUpload');
      service
        .createPulse('mock_channel_id', mockContent)
        .pipe(
          tap({
            complete: () => {
              expect(updateUploadSpy).toHaveBeenCalledWith(expect.any(String), 50);
              done();
            },
          }),
        )
        .subscribe();
    });

    it('should report the file upload progress when the upload fails', (done) => {
      channelServiceMock.createPulse.mockReturnValueOnce(throwError(() => ''));
      const updateUploadSpy = jest.spyOn(pulseUploadService, 'updateFileUpload');
      service.createPulse('mock_channel_id', mockContent).subscribe({
        error: () => {
          expect(updateUploadSpy).toHaveBeenCalledWith(expect.any(String), 0);
          done();
        },
      });
    });
  });
});
