import { HttpEventType } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChannelService, PulseService } from '@core/api';
import {
  CONTENT_DIALOG_APP,
  CONTENT_DIALOG_MODULE,
  KpContentFormDialogComponent,
} from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { ChannelAPI } from 'app/main/channel/channel.api';
import { PulseUploadService } from 'app/main/channel/pages/detail/pulse-upload.service';
import { of, Subject, throwError } from 'rxjs';
import { ChannelPulsesCreateService } from './channel-pulses-create.service';
import { Pulse } from '@core/model/pulse.model';

const mockPulse = { id: 'p-1', name: 'Test Pulse' } as Pulse;

describe('ChannelPulsesCreateService', () => {
  let service: ChannelPulsesCreateService;
  let dialog: jest.Mocked<MatDialog>;
  let channelService: jest.Mocked<ChannelService>;
  let pulseUploadService: jest.Mocked<PulseUploadService>;
  let pulseService: jest.Mocked<PulseService>;
  let messageService: jest.Mocked<KpMessageService>;
  let channelAPI: jest.Mocked<ChannelAPI>;

  beforeEach(() => {
    dialog = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;
    channelService = { createPulse: jest.fn() } as unknown as jest.Mocked<ChannelService>;
    pulseUploadService = {
      getRandomUploadId: jest.fn().mockReturnValue('upload-id-1'),
      addFileUpload: jest.fn(),
      updateFileUpload: jest.fn(),
    } as unknown as jest.Mocked<PulseUploadService>;
    pulseService = { updatePulse: jest.fn() } as unknown as jest.Mocked<PulseService>;
    messageService = { success: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    channelAPI = { postPulseQuiz: jest.fn() } as unknown as jest.Mocked<ChannelAPI>;

    TestBed.configureTestingModule({
      providers: [
        ChannelPulsesCreateService,
        { provide: MatDialog, useValue: dialog },
        { provide: ChannelService, useValue: channelService },
        { provide: PulseUploadService, useValue: pulseUploadService },
        { provide: PulseService, useValue: pulseService },
        { provide: KpMessageService, useValue: messageService },
        { provide: ChannelAPI, useValue: channelAPI },
      ],
    });

    service = TestBed.inject(ChannelPulsesCreateService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('openPulseCreateDialog', () => {
    it('should open KpContentFormDialogComponent with KONQUEST app and PULSE module', (done) => {
      const contentFormData = { type: 'VIDEO', name: 'My Video', value: new File([], 'video.mp4') } as any;
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(contentFormData)),
      } as unknown as MatDialogRef<unknown>;
      dialog.open.mockReturnValue(mockDialogRef);

      service.openPulseCreateDialog().subscribe((result) => {
        expect(dialog.open).toHaveBeenCalledWith(
          KpContentFormDialogComponent,
          expect.objectContaining({
            panelClass: 'content-form-dialog',
            autoFocus: 'dialog',
            data: {
              app: CONTENT_DIALOG_APP.KONQUEST,
              moduleName: CONTENT_DIALOG_MODULE.PULSE,
            },
          }),
        );
        expect(result).toEqual(contentFormData);
        done();
      });
    });
  });

  describe('createPulse', () => {
    describe('file upload', () => {
      const file = new File(['content'], 'video.mp4');
      const pulseForm: any = { type: 'VIDEO', name: 'My Video', value: file };

      it('should call addFileUpload with file name and initial percentage 0', () => {
        channelService.createPulse.mockReturnValue(of(mockPulse));

        service.createPulse('ch-1', pulseForm).subscribe();

        expect(pulseUploadService.addFileUpload).toHaveBeenCalledWith(
          'upload-id-1',
          'video.mp4',
          expect.any(Subject),
          0,
        );
      });

      it('should emit on expandPanel$ synchronously when called', () => {
        channelService.createPulse.mockReturnValue(of(mockPulse));
        let emitted = false;
        service.expandPanel$.subscribe(() => (emitted = true));

        service.createPulse('ch-1', pulseForm).subscribe();

        expect(emitted).toBe(true);
      });

      it('should call channelService.createPulse with channelId and pulseForm', () => {
        channelService.createPulse.mockReturnValue(of(mockPulse));

        service.createPulse('ch-1', pulseForm).subscribe();

        expect(channelService.createPulse).toHaveBeenCalledWith('ch-1', pulseForm);
      });

      it('should show PULSES.SUCCESSFULLY_ADDED message on success', (done) => {
        channelService.createPulse.mockReturnValue(of(mockPulse));

        service.createPulse('ch-1', pulseForm).subscribe(() => {
          expect(messageService.success).toHaveBeenCalledWith('PULSES.SUCCESSFULLY_ADDED');
          done();
        });
      });

      it('should call pulseService.updatePulse when coverImage is present', (done) => {
        const pulseFormWithCover: any = { ...pulseForm, coverImage: 'base64img' };
        const updatedPulse = { ...mockPulse, holder_image: 'base64img' } as Pulse;
        channelService.createPulse.mockReturnValue(of(mockPulse));
        pulseService.updatePulse.mockReturnValue(of(updatedPulse));

        service.createPulse('ch-1', pulseFormWithCover).subscribe((result) => {
          expect(pulseService.updatePulse).toHaveBeenCalledWith('p-1', { holder_image: 'base64img' });
          expect(result).toEqual(updatedPulse);
          done();
        });
      });

      it('should return original pulse when no coverImage', (done) => {
        channelService.createPulse.mockReturnValue(of(mockPulse));

        service.createPulse('ch-1', pulseForm).subscribe((result) => {
          expect(pulseService.updatePulse).not.toHaveBeenCalled();
          expect(result).toEqual(mockPulse);
          done();
        });
      });

      it('should filter out events without id (HttpUploadProgressEvent)', (done) => {
        const progressEvent = { type: HttpEventType.UploadProgress, loaded: 50, total: 100 };
        channelService.createPulse.mockReturnValue(of(progressEvent as any, mockPulse));

        let emitCount = 0;
        service.createPulse('ch-1', pulseForm).subscribe({
          next: () => emitCount++,
          complete: () => {
            expect(emitCount).toBe(1);
            done();
          },
        });
      });

      it('should call updateFileUpload with calculated percentage on UploadProgress event', (done) => {
        const progressEvent = { type: HttpEventType.UploadProgress, loaded: 50, total: 100 };
        channelService.createPulse.mockReturnValue(of(progressEvent as any, mockPulse));

        service.createPulse('ch-1', pulseForm).subscribe({
          complete: () => {
            expect(pulseUploadService.updateFileUpload).toHaveBeenCalledWith('upload-id-1', 50);
            done();
          },
        });
      });

      it('should cap upload percentage at 90 for progress events', (done) => {
        const progressEvent = { type: HttpEventType.UploadProgress, loaded: 100, total: 100 };
        channelService.createPulse.mockReturnValue(of(progressEvent as any, mockPulse));

        service.createPulse('ch-1', pulseForm).subscribe({
          complete: () => {
            expect(pulseUploadService.updateFileUpload).toHaveBeenCalledWith('upload-id-1', 90);
            done();
          },
        });
      });

      it('should call updateFileUpload with 100 on stream completion', (done) => {
        channelService.createPulse.mockReturnValue(of(mockPulse));

        service.createPulse('ch-1', pulseForm).subscribe({
          complete: () => {
            expect(pulseUploadService.updateFileUpload).toHaveBeenCalledWith('upload-id-1', 100);
            done();
          },
        });
      });

      it('should call updateFileUpload with 0 on error', (done) => {
        channelService.createPulse.mockReturnValue(throwError(() => new Error('upload failed')));

        service.createPulse('ch-1', pulseForm).subscribe({
          error: () => {
            expect(pulseUploadService.updateFileUpload).toHaveBeenCalledWith('upload-id-1', 0);
            done();
          },
        });
      });
    });

    describe('non-file upload (link)', () => {
      const pulseForm: any = { type: 'LINK', name: 'My Link', value: 'https://youtube.com/xyz' };

      it('should use pulseForm.name as upload name and initial percentage 100', () => {
        channelService.createPulse.mockReturnValue(of(mockPulse));

        service.createPulse('ch-1', pulseForm).subscribe();

        expect(pulseUploadService.addFileUpload).toHaveBeenCalledWith(
          'upload-id-1',
          'My Link',
          expect.any(Subject),
          100,
        );
      });
    });
  });

  describe('postPulseQuiz', () => {
    it('should delegate to channelAPI.postPulseQuiz', (done) => {
      const payload = { name: 'Quiz', exam: { questions: [] } } as any;
      channelAPI.postPulseQuiz.mockReturnValue(of(mockPulse));

      service.postPulseQuiz(payload, 'ch-1').subscribe((result) => {
        expect(channelAPI.postPulseQuiz).toHaveBeenCalledWith(payload, 'ch-1');
        expect(result).toEqual(mockPulse);
        done();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete expandPanel$', (done) => {
      service.expandPanel$.subscribe({ complete: () => done() });
      service.ngOnDestroy();
    });
  });
});
