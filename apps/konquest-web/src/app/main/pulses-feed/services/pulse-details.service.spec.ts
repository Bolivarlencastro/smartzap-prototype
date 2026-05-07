import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KontentLearnContentAPI } from '@core/api/base/kontent-learn-content.api';
import { KonquestAPI } from '@core/api/base/konquest.api';
import { PulseAPI } from '@core/api/pulse.api';
import { RouteDialogService } from 'app/shared/services';
import { of, Subject } from 'rxjs';
import { PulseDetailsComponent } from '../containers/pulse-details/pulse-details.component';
import { PulseDetailsService } from './pulse-details.service';

jest.mock('../containers/pulse-details/pulse-details.component', () => ({
  PulseDetailsComponent: class PulseDetailsComponent {},
}));

describe('PulseDetailsService', () => {
  let service: PulseDetailsService;
  let pulseApiMock: jest.Mocked<PulseAPI>;
  let kontentLearnContentApiMock: jest.Mocked<KontentLearnContentAPI>;
  let konquestApiMock: jest.Mocked<KonquestAPI>;
  let dialogMock: jest.Mocked<MatDialog>;
  let routeDialogServiceMock: jest.Mocked<RouteDialogService>;
  let routerMock: jest.Mocked<Router>;
  let afterClosedSubject: Subject<void>;
  let dialogRefMock: jest.Mocked<MatDialogRef<PulseDetailsComponent>>;

  beforeEach(() => {
    afterClosedSubject = new Subject<void>();
    dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(afterClosedSubject.asObservable()),
    } as unknown as jest.Mocked<MatDialogRef<PulseDetailsComponent>>;

    pulseApiMock = {
      getPulse: jest.fn(),
      getPulseComments: jest.fn(),
    } as unknown as jest.Mocked<PulseAPI>;

    kontentLearnContentApiMock = {
      get: jest.fn(),
    } as unknown as jest.Mocked<KontentLearnContentAPI>;

    konquestApiMock = {
      get: jest.fn(),
    } as unknown as jest.Mocked<KonquestAPI>;

    dialogMock = {
      open: jest.fn().mockReturnValue(dialogRefMock),
    } as unknown as jest.Mocked<MatDialog>;

    routeDialogServiceMock = {
      onDialogClosed: jest.fn(),
    } as unknown as jest.Mocked<RouteDialogService>;

    routerMock = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        PulseDetailsService,
        { provide: PulseAPI, useValue: pulseApiMock },
        { provide: KontentLearnContentAPI, useValue: kontentLearnContentApiMock },
        { provide: KonquestAPI, useValue: konquestApiMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: RouteDialogService, useValue: routeDialogServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(PulseDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadPulseDetails', () => {
    const pulseId = 'pulse-1';
    const channelId = 'channel-1';

    const mockPulse = {
      id: pulseId,
      learn_content_uuid: 'content-uuid-1',
      channels: [{ id: channelId, name: 'Channel One', category: 'category' }],
    };

    const mockComments = { results: [{ id: 'c1', comment: 'Great pulse' }] };
    const mockContent = { id: 'content-uuid-1', title: 'Some Content' };
    const mockChannel = { id: channelId, name: 'Channel One' };

    beforeEach(() => {
      pulseApiMock.getPulse.mockReturnValue(of(mockPulse) as any);
      pulseApiMock.getPulseComments.mockReturnValue(of(mockComments) as any);
      kontentLearnContentApiMock.get.mockReturnValue(of(mockContent) as any);
      konquestApiMock.get.mockReturnValue(of(mockChannel) as any);
    });

    it('should call pulseApi.getPulse with the given pulseId', () => {
      service.loadPulseDetails(pulseId).subscribe();
      expect(pulseApiMock.getPulse).toHaveBeenCalledWith(pulseId);
    });

    it('should call pulseApi.getPulseComments with correct params', () => {
      service.loadPulseDetails(pulseId).subscribe();
      expect(pulseApiMock.getPulseComments).toHaveBeenCalledWith({
        pulse_id: pulseId,
        ordering: '-created_date',
      });
    });

    it('should call kontentLearnContentApi.get with the learn_content_uuid', () => {
      service.loadPulseDetails(pulseId).subscribe();
      expect(kontentLearnContentApiMock.get).toHaveBeenCalledWith(mockPulse.learn_content_uuid);
    });

    it('should call konquestApi.get with the channel endpoint when channelId exists', () => {
      service.loadPulseDetails(pulseId).subscribe();
      expect(konquestApiMock.get).toHaveBeenCalledWith(`/channels/${channelId}`);
    });

    it('should return PulseDetailsData with pulse, comments, content, and channel', () => {
      let result: any;
      service.loadPulseDetails(pulseId).subscribe((res) => (result = res));

      expect(result).toEqual({
        pulse: mockPulse,
        comments: mockComments.results,
        content: mockContent,
        channel: mockChannel,
      });
    });

    it('should return empty array for comments when results is undefined', () => {
      pulseApiMock.getPulseComments.mockReturnValue(of({ results: undefined }) as any);

      let result: any;
      service.loadPulseDetails(pulseId).subscribe((res) => (result = res));

      expect(result.comments).toEqual([]);
    });

    it('should pass null as channel when pulse has no channels', () => {
      pulseApiMock.getPulse.mockReturnValue(of({ ...mockPulse, channels: [] }) as any);

      let result: any;
      service.loadPulseDetails(pulseId).subscribe((res) => (result = res));

      expect(konquestApiMock.get).not.toHaveBeenCalled();
      expect(result.channel).toBeNull();
    });

    it('should pass null as channel when pulse channels array is undefined', () => {
      pulseApiMock.getPulse.mockReturnValue(of({ ...mockPulse, channels: undefined }) as any);

      let result: any;
      service.loadPulseDetails(pulseId).subscribe((res) => (result = res));

      expect(konquestApiMock.get).not.toHaveBeenCalled();
      expect(result.channel).toBeNull();
    });
  });

  describe('openDialog', () => {
    it('should open a MatDialog with PulseDetailsComponent and correct config', () => {
      service.openDialog();

      expect(dialogMock.open).toHaveBeenCalledWith(PulseDetailsComponent, {
        autoFocus: 'dialog',
        panelClass: 'pulse-dialog-container',
      });
    });

    it('should not call routeDialogService.onDialogClosed when the dialog closes', () => {
      service.openDialog();

      afterClosedSubject.next();

      expect(routeDialogServiceMock.onDialogClosed).not.toHaveBeenCalled();
    });

    it('should not open a second dialog if one is already open', () => {
      service.openDialog();
      service.openDialog();
      expect(dialogMock.open).toHaveBeenCalledTimes(1);
    });

    it('should allow reopening the dialog after it has been closed', () => {
      service.openDialog();
      afterClosedSubject.next();
      service.openDialog();
      expect(dialogMock.open).toHaveBeenCalledTimes(2);
    });
  });

  describe('onDialogDestroyed', () => {
    it('should call routeDialogService.onDialogClosed', () => {
      service.onDialogDestroyed();

      expect(routeDialogServiceMock.onDialogClosed).toHaveBeenCalled();
    });

    it('should navigate to the trail when rollbackTrailId is provided', () => {
      service.onDialogDestroyed('trail-123');

      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/T/trail-123');
    });

    it('should not navigate when rollbackTrailId is undefined', () => {
      service.onDialogDestroyed(undefined);

      expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});
