import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeDialogComponent } from '../containers/qr-code-dialog.component';
import { Ecc, QrCode } from '@keeps-platform-frontend-workspace/qr-code';
import { Clipboard } from '@angular/cdk/clipboard';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionInformationDate } from 'app/main/mission/mission.model';
import { environment } from 'environments/environment';

const CHECKPOINT_URL = environment.apps.checkpoint.url;
const CHECKPOINT_AUTH_URL = environment.apps.checkpoint.authUrl;

@Injectable({
  providedIn: 'root',
})
export class EventQrCodeService {
  constructor(
    private readonly dialog: MatDialog,
    private readonly clipboard: Clipboard,
    private readonly messageService: KpMessageService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  openQrCodeDialog() {
    this.dialog.open(QrCodeDialogComponent, { width: '360px', maxWidth: '90vw' });
  }

  createQrCode(data: string, eccLevel = Ecc.MEDIUM): QrCode {
    return QrCode.encodeText(data, eccLevel);
  }

  createCheckInUrl(eventId: string, eventName: string, eventDate: MissionInformationDate) {
    const workspace = this.workspaceService.getCurrentWorkspace();
    const workspaceId = workspace?.id;
    const workspaceColor = workspace?.custom_color;
    const start = eventDate.start_at;
    const end = eventDate.end_at;
    const dateId = eventDate.id;

    const eventData = {
      workspaceColor,
      workspaceId,
      eventId,
      eventName,
      dateId,
      start,
      end,
    };

    const jsonData = JSON.stringify(eventData);
    const encodedData = encodeURIComponent(jsonData);
    const base64Data = btoa(encodedData);

    const checkpointUrl = new URL(CHECKPOINT_URL);
    checkpointUrl.pathname = base64Data;

    const loginUrl = new URL(CHECKPOINT_AUTH_URL);
    loginUrl.searchParams.append('redirect_uri', checkpointUrl.toString());

    return loginUrl.toString();
  }

  createQrCodeSvg(qrCode: QrCode, borderWidth = 2) {
    const parts: Array<string> = [];
    for (let y = 0; y < qrCode.size; y++) {
      for (let x = 0; x < qrCode.size; x++) {
        if (qrCode.getModule(x, y)) {
          parts.push(`M${x + borderWidth},${y + borderWidth}h1v1h-1z`);
        }
      }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qrCode.size + borderWidth * 2} ${qrCode.size + borderWidth * 2}" stroke="none">
      <rect width="100%" height="100%" fill="#FFFFFF"/>
        <path d="${parts.join(' ')}" fill="#000000"/>
    </svg>`;
  }

  createDownloadLink(svgCode: string) {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  }

  copyToClipBoard(data: string) {
    this.clipboard.copy(data);
    this.messageService.success('GENERAL.COPIED_TO_CLIPBOARD');
  }
}
