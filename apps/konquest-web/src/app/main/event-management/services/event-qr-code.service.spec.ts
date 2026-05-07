import { EventQrCodeService } from './event-qr-code.service';
import { MatDialog } from '@angular/material/dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Clipboard } from '@angular/cdk/clipboard';
import { QrCodeDialogComponent } from 'app/main/event-management/containers/qr-code-dialog.component';
import { Ecc, QrCode } from '@keeps-platform-frontend-workspace/qr-code';
import { WorkspaceBasicDto, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Chance } from 'chance';
import { MissionInformationDate } from 'app/main/mission/mission.model';

jest.mock('@keeps-platform-frontend-workspace/qr-code', () => ({
  ...jest.requireActual('@keeps-platform-frontend-workspace/qr-code'),
  QrCode: {
    encodeText: jest.fn(),
  },
}));

describe('EventQrCodeService', () => {
  const chance = new Chance();

  let service: EventQrCodeService;
  let dialogMock: jest.Mocked<MatDialog>;
  let clipboardMock: jest.Mocked<Clipboard>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    dialogMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;
    clipboardMock = {
      copy: jest.fn(),
    } as unknown as jest.Mocked<Clipboard>;
    messageServiceMock = {
      success: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;
    workspaceServiceMock = {
      getCurrentWorkspace: jest.fn(),
    } as unknown as jest.Mocked<WorkspaceService>;

    service = new EventQrCodeService(dialogMock, clipboardMock, messageServiceMock, workspaceServiceMock);
  });

  it('should open the QR Code dialog', () => {
    service.openQrCodeDialog();
    expect(dialogMock.open).toHaveBeenCalledWith(QrCodeDialogComponent, { width: '360px', maxWidth: '90vw' });
  });

  it('should create a QR code for the provided data', () => {
    service.createQrCode('mock_data');

    expect(QrCode.encodeText).toHaveBeenCalledWith('mock_data', Ecc.MEDIUM);
  });

  it('should create an SVG string from a QR Code instance', () => {
    const mockQrCode = { size: 21, getModule: jest.fn().mockReturnValue(true) } as unknown as QrCode;
    const expectedSvgString = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 25 25" stroke="none">
      <rect width="100%" height="100%" fill="#FFFFFF"/>
        <path d="M2,2h1v1h-1z M3,2h1v1h-1z M4,2h1v1h-1z M5,2h1v1h-1z M6,2h1v1h-1z M7,2h1v1h-1z M8,2h1v1h-1z M9,2h1v1h-1z M10,2h1v1h-1z M11,2h1v1h-1z M12,2h1v1h-1z M13,2h1v1h-1z M14,2h1v1h-1z M15,2h1v1h-1z M16,2h1v1h-1z M17,2h1v1h-1z M18,2h1v1h-1z M19,2h1v1h-1z M20,2h1v1h-1z M21,2h1v1h-1z M22,2h1v1h-1z M2,3h1v1h-1z M3,3h1v1h-1z M4,3h1v1h-1z M5,3h1v1h-1z M6,3h1v1h-1z M7,3h1v1h-1z M8,3h1v1h-1z M9,3h1v1h-1z M10,3h1v1h-1z M11,3h1v1h-1z M12,3h1v1h-1z M13,3h1v1h-1z M14,3h1v1h-1z M15,3h1v1h-1z M16,3h1v1h-1z M17,3h1v1h-1z M18,3h1v1h-1z M19,3h1v1h-1z M20,3h1v1h-1z M21,3h1v1h-1z M22,3h1v1h-1z M2,4h1v1h-1z M3,4h1v1h-1z M4,4h1v1h-1z M5,4h1v1h-1z M6,4h1v1h-1z M7,4h1v1h-1z M8,4h1v1h-1z M9,4h1v1h-1z M10,4h1v1h-1z M11,4h1v1h-1z M12,4h1v1h-1z M13,4h1v1h-1z M14,4h1v1h-1z M15,4h1v1h-1z M16,4h1v1h-1z M17,4h1v1h-1z M18,4h1v1h-1z M19,4h1v1h-1z M20,4h1v1h-1z M21,4h1v1h-1z M22,4h1v1h-1z M2,5h1v1h-1z M3,5h1v1h-1z M4,5h1v1h-1z M5,5h1v1h-1z M6,5h1v1h-1z M7,5h1v1h-1z M8,5h1v1h-1z M9,5h1v1h-1z M10,5h1v1h-1z M11,5h1v1h-1z M12,5h1v1h-1z M13,5h1v1h-1z M14,5h1v1h-1z M15,5h1v1h-1z M16,5h1v1h-1z M17,5h1v1h-1z M18,5h1v1h-1z M19,5h1v1h-1z M20,5h1v1h-1z M21,5h1v1h-1z M22,5h1v1h-1z M2,6h1v1h-1z M3,6h1v1h-1z M4,6h1v1h-1z M5,6h1v1h-1z M6,6h1v1h-1z M7,6h1v1h-1z M8,6h1v1h-1z M9,6h1v1h-1z M10,6h1v1h-1z M11,6h1v1h-1z M12,6h1v1h-1z M13,6h1v1h-1z M14,6h1v1h-1z M15,6h1v1h-1z M16,6h1v1h-1z M17,6h1v1h-1z M18,6h1v1h-1z M19,6h1v1h-1z M20,6h1v1h-1z M21,6h1v1h-1z M22,6h1v1h-1z M2,7h1v1h-1z M3,7h1v1h-1z M4,7h1v1h-1z M5,7h1v1h-1z M6,7h1v1h-1z M7,7h1v1h-1z M8,7h1v1h-1z M9,7h1v1h-1z M10,7h1v1h-1z M11,7h1v1h-1z M12,7h1v1h-1z M13,7h1v1h-1z M14,7h1v1h-1z M15,7h1v1h-1z M16,7h1v1h-1z M17,7h1v1h-1z M18,7h1v1h-1z M19,7h1v1h-1z M20,7h1v1h-1z M21,7h1v1h-1z M22,7h1v1h-1z M2,8h1v1h-1z M3,8h1v1h-1z M4,8h1v1h-1z M5,8h1v1h-1z M6,8h1v1h-1z M7,8h1v1h-1z M8,8h1v1h-1z M9,8h1v1h-1z M10,8h1v1h-1z M11,8h1v1h-1z M12,8h1v1h-1z M13,8h1v1h-1z M14,8h1v1h-1z M15,8h1v1h-1z M16,8h1v1h-1z M17,8h1v1h-1z M18,8h1v1h-1z M19,8h1v1h-1z M20,8h1v1h-1z M21,8h1v1h-1z M22,8h1v1h-1z M2,9h1v1h-1z M3,9h1v1h-1z M4,9h1v1h-1z M5,9h1v1h-1z M6,9h1v1h-1z M7,9h1v1h-1z M8,9h1v1h-1z M9,9h1v1h-1z M10,9h1v1h-1z M11,9h1v1h-1z M12,9h1v1h-1z M13,9h1v1h-1z M14,9h1v1h-1z M15,9h1v1h-1z M16,9h1v1h-1z M17,9h1v1h-1z M18,9h1v1h-1z M19,9h1v1h-1z M20,9h1v1h-1z M21,9h1v1h-1z M22,9h1v1h-1z M2,10h1v1h-1z M3,10h1v1h-1z M4,10h1v1h-1z M5,10h1v1h-1z M6,10h1v1h-1z M7,10h1v1h-1z M8,10h1v1h-1z M9,10h1v1h-1z M10,10h1v1h-1z M11,10h1v1h-1z M12,10h1v1h-1z M13,10h1v1h-1z M14,10h1v1h-1z M15,10h1v1h-1z M16,10h1v1h-1z M17,10h1v1h-1z M18,10h1v1h-1z M19,10h1v1h-1z M20,10h1v1h-1z M21,10h1v1h-1z M22,10h1v1h-1z M2,11h1v1h-1z M3,11h1v1h-1z M4,11h1v1h-1z M5,11h1v1h-1z M6,11h1v1h-1z M7,11h1v1h-1z M8,11h1v1h-1z M9,11h1v1h-1z M10,11h1v1h-1z M11,11h1v1h-1z M12,11h1v1h-1z M13,11h1v1h-1z M14,11h1v1h-1z M15,11h1v1h-1z M16,11h1v1h-1z M17,11h1v1h-1z M18,11h1v1h-1z M19,11h1v1h-1z M20,11h1v1h-1z M21,11h1v1h-1z M22,11h1v1h-1z M2,12h1v1h-1z M3,12h1v1h-1z M4,12h1v1h-1z M5,12h1v1h-1z M6,12h1v1h-1z M7,12h1v1h-1z M8,12h1v1h-1z M9,12h1v1h-1z M10,12h1v1h-1z M11,12h1v1h-1z M12,12h1v1h-1z M13,12h1v1h-1z M14,12h1v1h-1z M15,12h1v1h-1z M16,12h1v1h-1z M17,12h1v1h-1z M18,12h1v1h-1z M19,12h1v1h-1z M20,12h1v1h-1z M21,12h1v1h-1z M22,12h1v1h-1z M2,13h1v1h-1z M3,13h1v1h-1z M4,13h1v1h-1z M5,13h1v1h-1z M6,13h1v1h-1z M7,13h1v1h-1z M8,13h1v1h-1z M9,13h1v1h-1z M10,13h1v1h-1z M11,13h1v1h-1z M12,13h1v1h-1z M13,13h1v1h-1z M14,13h1v1h-1z M15,13h1v1h-1z M16,13h1v1h-1z M17,13h1v1h-1z M18,13h1v1h-1z M19,13h1v1h-1z M20,13h1v1h-1z M21,13h1v1h-1z M22,13h1v1h-1z M2,14h1v1h-1z M3,14h1v1h-1z M4,14h1v1h-1z M5,14h1v1h-1z M6,14h1v1h-1z M7,14h1v1h-1z M8,14h1v1h-1z M9,14h1v1h-1z M10,14h1v1h-1z M11,14h1v1h-1z M12,14h1v1h-1z M13,14h1v1h-1z M14,14h1v1h-1z M15,14h1v1h-1z M16,14h1v1h-1z M17,14h1v1h-1z M18,14h1v1h-1z M19,14h1v1h-1z M20,14h1v1h-1z M21,14h1v1h-1z M22,14h1v1h-1z M2,15h1v1h-1z M3,15h1v1h-1z M4,15h1v1h-1z M5,15h1v1h-1z M6,15h1v1h-1z M7,15h1v1h-1z M8,15h1v1h-1z M9,15h1v1h-1z M10,15h1v1h-1z M11,15h1v1h-1z M12,15h1v1h-1z M13,15h1v1h-1z M14,15h1v1h-1z M15,15h1v1h-1z M16,15h1v1h-1z M17,15h1v1h-1z M18,15h1v1h-1z M19,15h1v1h-1z M20,15h1v1h-1z M21,15h1v1h-1z M22,15h1v1h-1z M2,16h1v1h-1z M3,16h1v1h-1z M4,16h1v1h-1z M5,16h1v1h-1z M6,16h1v1h-1z M7,16h1v1h-1z M8,16h1v1h-1z M9,16h1v1h-1z M10,16h1v1h-1z M11,16h1v1h-1z M12,16h1v1h-1z M13,16h1v1h-1z M14,16h1v1h-1z M15,16h1v1h-1z M16,16h1v1h-1z M17,16h1v1h-1z M18,16h1v1h-1z M19,16h1v1h-1z M20,16h1v1h-1z M21,16h1v1h-1z M22,16h1v1h-1z M2,17h1v1h-1z M3,17h1v1h-1z M4,17h1v1h-1z M5,17h1v1h-1z M6,17h1v1h-1z M7,17h1v1h-1z M8,17h1v1h-1z M9,17h1v1h-1z M10,17h1v1h-1z M11,17h1v1h-1z M12,17h1v1h-1z M13,17h1v1h-1z M14,17h1v1h-1z M15,17h1v1h-1z M16,17h1v1h-1z M17,17h1v1h-1z M18,17h1v1h-1z M19,17h1v1h-1z M20,17h1v1h-1z M21,17h1v1h-1z M22,17h1v1h-1z M2,18h1v1h-1z M3,18h1v1h-1z M4,18h1v1h-1z M5,18h1v1h-1z M6,18h1v1h-1z M7,18h1v1h-1z M8,18h1v1h-1z M9,18h1v1h-1z M10,18h1v1h-1z M11,18h1v1h-1z M12,18h1v1h-1z M13,18h1v1h-1z M14,18h1v1h-1z M15,18h1v1h-1z M16,18h1v1h-1z M17,18h1v1h-1z M18,18h1v1h-1z M19,18h1v1h-1z M20,18h1v1h-1z M21,18h1v1h-1z M22,18h1v1h-1z M2,19h1v1h-1z M3,19h1v1h-1z M4,19h1v1h-1z M5,19h1v1h-1z M6,19h1v1h-1z M7,19h1v1h-1z M8,19h1v1h-1z M9,19h1v1h-1z M10,19h1v1h-1z M11,19h1v1h-1z M12,19h1v1h-1z M13,19h1v1h-1z M14,19h1v1h-1z M15,19h1v1h-1z M16,19h1v1h-1z M17,19h1v1h-1z M18,19h1v1h-1z M19,19h1v1h-1z M20,19h1v1h-1z M21,19h1v1h-1z M22,19h1v1h-1z M2,20h1v1h-1z M3,20h1v1h-1z M4,20h1v1h-1z M5,20h1v1h-1z M6,20h1v1h-1z M7,20h1v1h-1z M8,20h1v1h-1z M9,20h1v1h-1z M10,20h1v1h-1z M11,20h1v1h-1z M12,20h1v1h-1z M13,20h1v1h-1z M14,20h1v1h-1z M15,20h1v1h-1z M16,20h1v1h-1z M17,20h1v1h-1z M18,20h1v1h-1z M19,20h1v1h-1z M20,20h1v1h-1z M21,20h1v1h-1z M22,20h1v1h-1z M2,21h1v1h-1z M3,21h1v1h-1z M4,21h1v1h-1z M5,21h1v1h-1z M6,21h1v1h-1z M7,21h1v1h-1z M8,21h1v1h-1z M9,21h1v1h-1z M10,21h1v1h-1z M11,21h1v1h-1z M12,21h1v1h-1z M13,21h1v1h-1z M14,21h1v1h-1z M15,21h1v1h-1z M16,21h1v1h-1z M17,21h1v1h-1z M18,21h1v1h-1z M19,21h1v1h-1z M20,21h1v1h-1z M21,21h1v1h-1z M22,21h1v1h-1z M2,22h1v1h-1z M3,22h1v1h-1z M4,22h1v1h-1z M5,22h1v1h-1z M6,22h1v1h-1z M7,22h1v1h-1z M8,22h1v1h-1z M9,22h1v1h-1z M10,22h1v1h-1z M11,22h1v1h-1z M12,22h1v1h-1z M13,22h1v1h-1z M14,22h1v1h-1z M15,22h1v1h-1z M16,22h1v1h-1z M17,22h1v1h-1z M18,22h1v1h-1z M19,22h1v1h-1z M20,22h1v1h-1z M21,22h1v1h-1z M22,22h1v1h-1z" fill="#000000"/>
    </svg>`;

    const svgString = service.createQrCodeSvg(mockQrCode);

    expect(svgString).toEqual(expectedSvgString);
  });

  it('should create an download link for an SVG blob', () => {
    const svgCode = 'mock_svg';
    const createUrlMock = jest.fn().mockReturnValue('created_url');
    const blobMock = jest.fn();
    global.URL.createObjectURL = createUrlMock;
    global.Blob = blobMock;

    service.createDownloadLink(svgCode);

    expect(blobMock).toHaveBeenCalledWith([svgCode], { type: 'image/svg+xml' });
  });

  it('should copy to the clipboard', () => {
    service.copyToClipBoard('mock_text');

    expect(clipboardMock.copy).toHaveBeenCalledWith('mock_text');
    expect(messageServiceMock.success).toHaveBeenCalledWith('GENERAL.COPIED_TO_CLIPBOARD');
  });

  it('should create the checking URL for an event', () => {
    const workspaceId = chance.guid();
    const eventId = chance.guid();
    const workspaceColor = chance.color();

    workspaceServiceMock.getCurrentWorkspace.mockReturnValueOnce({
      id: workspaceId,
      custom_color: workspaceColor,
    } as unknown as WorkspaceBasicDto);

    const mockEventDate = {
      id: chance.guid(),
      start_at: '2025-10-31T12:00:00-03:00',
      end_at: '2025-10-31T13:00:00-03:00',
    } as MissionInformationDate;

    const expectedData = {
      dateId: mockEventDate.id,
      end: '2025-10-31T13:00:00-03:00',
      eventId: eventId,
      eventName: 'event_name',
      start: '2025-10-31T12:00:00-03:00',
      workspaceColor: workspaceColor,
      workspaceId: workspaceId,
    };

    const authUrl = service.createCheckInUrl(eventId, 'event_name', mockEventDate);
    const redirectUrl = new URL(authUrl).searchParams.get('redirect_uri');

    const encodedPath = new URL(redirectUrl).pathname.substring(1);
    const decodedData = JSON.parse(decodeURIComponent(atob(encodedPath)));
    expect(decodedData).toEqual(expectedData);
  });
});
