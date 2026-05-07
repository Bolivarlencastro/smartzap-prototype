import { Injectable } from '@angular/core';
import { KonquestAPI } from '@core/api/base';
import { KeepsError } from '@core/model/error.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { MatDialog } from '@angular/material/dialog';
import { CertificatePreviewDialogComponent } from 'app/shared/components/certificate-preview-dialog.component';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(
    private _konquestApi: KonquestAPI,
    private _messageService: KpMessageService,
    private dialog: MatDialog,
  ) {}

  generateLearningTrailCertificate(enrollmentId: string): Observable<any> {
    return this._konquestApi
      .post<{ certificate_url: string }>(`/learning-trail-enrollments/${enrollmentId}/certificates`, {})
      .pipe(
        catchError((error) => {
          if (error.customMessage === 'API.ERRORS.USER_ENROLLMENT_PERFORMANCE_LOWER_THEN_MIN') {
            return this.errorHandler(error, error.customMessage);
          }
          return this.errorHandler(error, 'REPORT.REDEEM_CERTIFICATE');
        }),
      );
  }

  generateCourseCertificate(enrollmentId: string): Observable<{ certificate_url: string }> {
    return this._konquestApi
      .post<{ certificate_url: string }>(`/mission-enrollments/${enrollmentId}/certificates`, {})
      .pipe(
        catchError((error) => {
          if (error.customMessage === 'API.ERRORS.USER_ENROLLMENT_PERFORMANCE_LOWER_THEN_MIN') {
            return this.errorHandler(error, error.customMessage);
          }
          return this.errorHandler(error, 'REPORT.REDEEM_CERTIFICATE');
        }),
      );
  }

  openCertificate(url: string): void {
    if (!url) {
      return;
    }

    this.dialog.open(CertificatePreviewDialogComponent, {
      data: url,
      width: '70vw',
      height: '80vh',
      minWidth: '400px',
      minHeight: '300px',
    });
  }

  private errorHandler(error: KeepsError, message: string): Observable<never> {
    this._messageService.error(message);
    return throwError(() => error);
  }
}
