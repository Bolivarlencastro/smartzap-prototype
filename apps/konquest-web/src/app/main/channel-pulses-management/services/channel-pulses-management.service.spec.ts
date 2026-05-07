import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LearnContentService } from '@core/api';
import { LearnContentAPI } from '@core/api/learn-content.api';
import { PulseAPI } from '@core/api/pulse.api';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { PulsesSearchService } from '@core/api/pulses-search.service';
import { of } from 'rxjs';
import { ChannelPulsesManagementService } from './channel-pulses-management.service';
import { Pulse } from '@core/model/pulse.model';
import { PulseCardDto } from '@keeps-platform-frontend-workspace/ui/kp-pulse-card';
import { PageResponse } from '@core/model/search-api';
import { ChannelAPI } from 'app/main/channel/channel.api';
import { Channel } from 'app/main/channel/channel.model';

const mockPulse = {
  id: 'p-1',
  name: 'Test Pulse',
  pulse_type: { id: 'pt-video', name: 'Video' },
  learn_content_uuid: 'lc-uuid-1',
  description: 'desc',
} as Pulse;

describe('ChannelPulsesManagementService', () => {
  let service: ChannelPulsesManagementService;
  let channelAPI: jest.Mocked<ChannelAPI>;
  let pulseAPI: jest.Mocked<PulseAPI>;
  let dialog: jest.Mocked<MatDialog>;
  let learnContentAPI: jest.Mocked<LearnContentAPI>;
  let learnContentService: jest.Mocked<LearnContentService>;
  let messageService: jest.Mocked<KpMessageService>;
  let pulsesSearchService: jest.Mocked<PulsesSearchService>;

  beforeEach(() => {
    channelAPI = { getChannel: jest.fn() } as unknown as jest.Mocked<ChannelAPI>;
    pulseAPI = {
      getPulse: jest.fn(),
      editPulse: jest.fn(),
      deletePulse: jest.fn(),
      updatePulseContent: jest.fn(),
    } as unknown as jest.Mocked<PulseAPI>;
    dialog = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;
    learnContentAPI = { getLearnContent: jest.fn() } as unknown as jest.Mocked<LearnContentAPI>;
    learnContentService = {
      uploadFileWithoutMonitoring: jest.fn(),
      createLearnContentFromLink: jest.fn(),
    } as unknown as jest.Mocked<LearnContentService>;
    messageService = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    pulsesSearchService = { fetchChannelPulses: jest.fn() } as unknown as jest.Mocked<PulsesSearchService>;

    TestBed.configureTestingModule({
      providers: [
        ChannelPulsesManagementService,
        { provide: ChannelAPI, useValue: channelAPI },
        { provide: PulseAPI, useValue: pulseAPI },
        { provide: MatDialog, useValue: dialog },
        { provide: LearnContentAPI, useValue: learnContentAPI },
        { provide: LearnContentService, useValue: learnContentService },
        { provide: KpMessageService, useValue: messageService },
        { provide: PulsesSearchService, useValue: pulsesSearchService },
      ],
    });

    service = TestBed.inject(ChannelPulsesManagementService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('fetchChannelPulses', () => {
    it('should map ChannelPulseCardDto fields to PulseManagementItem and forward total', (done) => {
      const dto: PulseCardDto = {
        id: 'p-1',
        name: 'Pulse 1',
        pulse_type: { id: 'pt-1', name: 'Video' },
        creator_name: 'Admin',
        created_date: '2024-01-01',
        is_active: true,
        channel_name: 'Ch',
        cover_image: 'img.png',
        stats: { duration: 0 },
      };
      const response: PageResponse<PulseCardDto> = { items: [dto], total: 1 };
      pulsesSearchService.fetchChannelPulses.mockReturnValue(of(response));

      service.fetchChannelPulses('ch-1', { page: 1, per_page: 25 }).subscribe(({ pulses, total }) => {
        expect(total).toBe(1);
        expect(pulses).toHaveLength(1);
        expect(pulses[0]).toEqual({
          id: dto.id,
          name: dto.name,
          pulse_type: dto.pulse_type,
          creator_name: dto.creator_name,
          created_date: dto.created_date,
          is_active: dto.is_active,
        });
        done();
      });
    });
  });

  describe('getChannel', () => {
    it('should delegate to channelAPI.getChannel', (done) => {
      const mockChannel = { id: 'ch-1', name: 'Test Channel' } as Channel;
      channelAPI.getChannel.mockReturnValue(of(mockChannel));

      service.getChannel('ch-1').subscribe((channel) => {
        expect(channelAPI.getChannel).toHaveBeenCalledWith('ch-1');
        expect(channel).toEqual(mockChannel);
        done();
      });
    });
  });

  describe('getPulse', () => {
    it('should delegate to pulseAPI.getPulse', (done) => {
      pulseAPI.getPulse.mockReturnValue(of(mockPulse));

      service.getPulse('p-1').subscribe((pulse) => {
        expect(pulseAPI.getPulse).toHaveBeenCalledWith('p-1');
        expect(pulse).toEqual(mockPulse);
        done();
      });
    });
  });

  describe('openPulseEditDialog', () => {
    it('should open PulseEditComponent with pulse data and return afterClosed()', (done) => {
      const dialogResult = { name: 'New Name', description: 'New Desc', coverImage: 'img.png' };
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(dialogResult)),
      } as unknown as MatDialogRef<unknown>;
      dialog.open.mockReturnValue(mockDialogRef);
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });

      service.openPulseEditDialog(mockPulse).subscribe((result) => {
        expect(dialog.open).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ data: { pulse: mockPulse } }),
        );
        expect(result).toEqual(dialogResult);
        done();
      });
    });
  });

  describe('updatePulse', () => {
    it('should call pulseAPI.editPulse and show PULSES.SUCCESSFULLY_EDITED on success', (done) => {
      pulseAPI.editPulse.mockReturnValue(of(mockPulse));
      const payload = { name: 'New', description: 'Desc', holder_image: 'img.png' };

      service.updatePulse('p-1', payload).subscribe(() => {
        expect(pulseAPI.editPulse).toHaveBeenCalledWith('p-1', payload);
        expect(messageService.success).toHaveBeenCalledWith('PULSES.SUCCESSFULLY_EDITED');
        done();
      });
    });
  });

  describe('editPulseContent (content path)', () => {
    it('should call learnContentAPI.getLearnContent and open ContentEditDialogComponent', (done) => {
      const learnContent = { url: 'http://content.url', id: 'lc-1' } as any;
      const contentForm = { type: 'LINK', name: 'Content', value: 'http://link.url' } as any;
      const uploadedContent = { id: 'lc-uploaded' } as any;
      const mockDialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(contentForm)),
      } as unknown as MatDialogRef<unknown>;

      learnContentAPI.getLearnContent.mockReturnValue(of(learnContent));
      dialog.open.mockReturnValue(mockDialogRef);
      learnContentService.createLearnContentFromLink = jest.fn().mockReturnValue(of(uploadedContent));
      pulseAPI.updatePulseContent = jest.fn().mockReturnValue(of(mockPulse));

      service.editPulseContent(mockPulse).subscribe(() => {
        expect(learnContentAPI.getLearnContent).toHaveBeenCalledWith(mockPulse.learn_content_uuid);
        expect(dialog.open).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('toggleActivation', () => {
    it('should call pulseAPI.editPulse with inverted is_active and show success message', (done) => {
      pulseAPI.editPulse.mockReturnValue(of(mockPulse));

      service.toggleActivation('p-1', false).subscribe(() => {
        expect(pulseAPI.editPulse).toHaveBeenCalledWith('p-1', { is_active: false });
        expect(messageService.success).toHaveBeenCalledWith('PULSE.TOGGLE_ACTIVATION_SUCCESS');
        done();
      });
    });
  });

  describe('deletePulse', () => {
    it('should call pulseAPI.deletePulse and show DELETE_SUCCESS message', (done) => {
      pulseAPI.deletePulse.mockReturnValue(of(undefined));

      service.deletePulse('p-1').subscribe(() => {
        expect(pulseAPI.deletePulse).toHaveBeenCalledWith('p-1');
        expect(messageService.success).toHaveBeenCalledWith('PULSE.DELETE_SUCCESS');
        done();
      });
    });
  });

  describe('openDeleteConfirmDialog', () => {
    it('should open KpConfirmDialogComponent with correct title/message/button labels', (done) => {
      const mockRef = {
        componentInstance: {} as any,
        afterClosed: jest.fn().mockReturnValue(of(true)),
      } as unknown as MatDialogRef<unknown>;
      dialog.open.mockReturnValue(mockRef);

      service.openDeleteConfirmDialog().subscribe((result) => {
        expect(dialog.open).toHaveBeenCalledWith(expect.any(Function), { maxWidth: '350px' });
        expect((mockRef as any).componentInstance.confirmTitle).toBe('PULSE.DETAIL.DELETE_PULSE_TITLE');
        expect((mockRef as any).componentInstance.confirmMessage).toBe('PULSE.DETAIL.DELETE_PULSE');
        expect((mockRef as any).componentInstance.positiveButtonLabel).toBe('GENERAL.DELETE');
        expect(result).toBe(true);
        done();
      });
    });
  });

  describe('showMutationError', () => {
    it('should call messageService.error with PULSE.EDIT_CONTENT_FAILURE', () => {
      service.showMutationError();
      expect(messageService.error).toHaveBeenCalledWith('PULSE.EDIT_CONTENT_FAILURE');
    });
  });
});
