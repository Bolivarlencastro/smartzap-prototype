import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { ClassroomFacade } from '../../facades';
import { Observable } from 'rxjs';
import { KpSafeUrlPipe } from '@keeps-platform-frontend-workspace/ui/kp-safe-url';

@Component({
  selector: 'kp-certificate',
  imports: [CommonModule, MatButton, MatIcon, TranslocoPipe, MatAnchor, KpSafeUrlPipe],
  template: `
    @if (certificateUrl$ | async; as certificateUrl) {
      <iframe class="certificate-iframe" [src]="certificateUrl | kpSafeUrl"></iframe>
      <div class="certificate-footer">
        <div class="flex gap-2 items-center">
          <mat-icon>lock_open</mat-icon>
          <p class="font-medium">{{ 'CLASSROOM.CERTIFICATE.SUCCESS_LABEL' | transloco }}</p>
        </div>
        <div class="flex gap-2 items-center justify-between flex-wrap">
          <a [href]="certificateUrl | kpSafeUrl" target="_blank" download mat-stroked-button color="primary">
            <mat-icon>download</mat-icon>
            <span class="ml-2">{{ 'CLASSROOM.CERTIFICATE.DOWNLOAD' | transloco }}</span>
          </a>
          <button mat-stroked-button color="primary" (click)="shareCertificate()">
            <mat-icon>share</mat-icon>
            <span class="ml-2">{{ 'CLASSROOM.CERTIFICATE.SHARE' | transloco }}</span>
          </button>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      height: var(--classroom-fixed-height);
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto;
      position: relative;
      border-radius: inherit;
      overflow: hidden;
      padding: 8px 8px 16px 8px;
      gap: 16px;
    }

    .certificate-iframe {
      aspect-ratio: auto;
      height: 100%;
      border-radius: inherit;
    }

    .certificate-footer {
      display: grid;
      gap: 8px 16px;
      grid-template-rows: repeat(2, 1fr);
      grid-template-columns: 1fr;
    }

    @media (min-width: 1280px) {
      .certificate-footer {
        grid-template-rows: 1fr;
        grid-template-columns: 1fr auto;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateComponent {
  protected readonly certificateUrl$: Observable<string>;

  constructor(private classroomFacade: ClassroomFacade) {
    this.certificateUrl$ = classroomFacade.certificateUrl$;
    this.classroomFacade.loadCertificate();
  }

  shareCertificate() {
    this.classroomFacade.shareCertificate();
  }
}
