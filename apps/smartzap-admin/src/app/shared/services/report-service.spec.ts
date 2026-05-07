import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SmartzapAPI } from '@core/api';
import { of, throwError } from 'rxjs';
import { ReportService } from './report-service';
import { ReportType } from 'app/shared/model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { KpWarnDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-warn-dialog';
import { UsersConsumptionFilterDialogComponent } from 'app/shared/dialogs/users-consumption-filter-dialog/users-consumption-filter-dialog.component';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: jest.Mocked<SmartzapAPI>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let dialogMock: jest.Mocked<MatDialog>;
  let filterDialogRefMock: Pick<MatDialogRef<UsersConsumptionFilterDialogComponent>, 'afterClosed'>;
  let warnDialogRefMock: { componentInstance: Record<string, unknown> };

  beforeEach(() => {
    httpMock = { get: jest.fn().mockReturnValue(of({})) } as unknown as jest.Mocked<SmartzapAPI>;
    messageServiceMock = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    filterDialogRefMock = { afterClosed: jest.fn().mockReturnValue(of({})) };
    warnDialogRefMock = { componentInstance: {} };

    dialogMock = {
      open: jest
        .fn()
        .mockImplementation((component) =>
          component === KpWarnDialogComponent ? warnDialogRefMock : filterDialogRefMock,
        ),
    } as unknown as jest.Mocked<MatDialog>;

    service = new ReportService(httpMock, messageServiceMock, dialogMock);
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  describe('downloadReport', () => {
    const courseId = 'mock_id';

    describe('for non-USERS_CONSUMPTION report types', () => {
      const cases: { type: ReportType; id?: string; expectedPath: string }[] = [
        { type: 'USERS', expectedPath: '/stats/user/csv' },
        { type: 'PROGRESS', id: courseId, expectedPath: `/stats/course/${courseId}/enrollment/in-progress/csv` },
        { type: 'COMPLETED', id: courseId, expectedPath: `/stats/course/${courseId}/enrollment/completed/csv` },
        { type: 'QUIZZES', id: courseId, expectedPath: `/stats/course/${courseId}/quizzes/csv` },
        { type: 'ACTIVITY', id: courseId, expectedPath: `/stats/course/${courseId}/activity/csv` },
      ];

      test.each(cases)('should call the correct API path for $type', ({ type, id, expectedPath }) => {
        service.downloadReport(type, id).subscribe();
        expect(httpMock.get).toHaveBeenCalledWith(expectedPath, undefined);
      });

      it('should open the warn dialog on success', () => {
        service.downloadReport('USERS', undefined).subscribe();
        expect(dialogMock.open).toHaveBeenCalledWith(KpWarnDialogComponent);
      });

      it('should set warn dialog title, description and icon', () => {
        service.downloadReport('USERS', undefined).subscribe();
        expect(warnDialogRefMock.componentInstance['dialogTitle']).toBe('REPORTS.DIALOG_TITLE');
        expect(warnDialogRefMock.componentInstance['dialogDescription']).toBe('REPORTS.WARN');
        expect(warnDialogRefMock.componentInstance['icon']).toBe('notifications_none');
      });

      it('should call messageService.error on API failure', () => {
        httpMock.get.mockReturnValueOnce(throwError(() => new Error('api error')));
        service.downloadReport('USERS', undefined).subscribe({ error: () => {} });
        expect(messageServiceMock.error).toHaveBeenCalledWith('REPORTS.PROCESSING_ERROR');
      });
    });

    describe('for USERS_CONSUMPTION', () => {
      it('should open the filter dialog with correct config', () => {
        service.downloadReport('USERS_CONSUMPTION', courseId).subscribe();
        expect(dialogMock.open).toHaveBeenCalledWith(UsersConsumptionFilterDialogComponent, {
          minWidth: '400px',
          maxWidth: '90vw',
          autoFocus: 'dialog',
        });
      });

      it('should not call API when dialog is cancelled (null result)', () => {
        (filterDialogRefMock.afterClosed as jest.Mock).mockReturnValueOnce(of(null));
        service.downloadReport('USERS_CONSUMPTION', courseId).subscribe();
        expect(httpMock.get).not.toHaveBeenCalled();
      });

      it('should not call API when dialog is dismissed (undefined result)', () => {
        (filterDialogRefMock.afterClosed as jest.Mock).mockReturnValueOnce(of(undefined));
        service.downloadReport('USERS_CONSUMPTION', courseId).subscribe();
        expect(httpMock.get).not.toHaveBeenCalled();
      });

      it('should call API without params when dialog closes with empty filters', () => {
        (filterDialogRefMock.afterClosed as jest.Mock).mockReturnValueOnce(of({}));
        service.downloadReport('USERS_CONSUMPTION', courseId).subscribe();
        expect(httpMock.get).toHaveBeenCalledWith(`/stats/course/${courseId}/consumption/csv`, undefined);
      });

      it('should call API with joined status param when statuses are selected', () => {
        (filterDialogRefMock.afterClosed as jest.Mock).mockReturnValueOnce(of({ status: ['COMPLETED', 'STARTED'] }));
        service.downloadReport('USERS_CONSUMPTION', courseId).subscribe();
        expect(httpMock.get).toHaveBeenCalledWith(`/stats/course/${courseId}/consumption/csv`, {
          status: 'COMPLETED,STARTED',
        });
      });

      it('should call API with concluded_after param when only start date is set', () => {
        const date = new Date(2024, 5, 1); // June 1, 2024 in local time
        (filterDialogRefMock.afterClosed as jest.Mock).mockReturnValueOnce(of({ concluded_after: date }));
        service.downloadReport('USERS_CONSUMPTION', courseId).subscribe();
        expect(httpMock.get).toHaveBeenCalledWith(`/stats/course/${courseId}/consumption/csv`, {
          concluded_after: '2024-06-01',
        });
      });

      it('should call API with concluded_before param when only end date is set', () => {
        const date = new Date(2024, 5, 30); // June 30, 2024 in local time
        (filterDialogRefMock.afterClosed as jest.Mock).mockReturnValueOnce(of({ concluded_before: date }));
        service.downloadReport('USERS_CONSUMPTION', courseId).subscribe();
        expect(httpMock.get).toHaveBeenCalledWith(`/stats/course/${courseId}/consumption/csv`, {
          concluded_before: '2024-06-30',
        });
      });

      it('should call API with all params when all filters are set', () => {
        const startDate = new Date(2024, 0, 1); // January 1, 2024 in local time
        const endDate = new Date(2024, 11, 31); // December 31, 2024 in local time
        (filterDialogRefMock.afterClosed as jest.Mock).mockReturnValueOnce(
          of({ status: ['COMPLETED'], concluded_after: startDate, concluded_before: endDate }),
        );
        service.downloadReport('USERS_CONSUMPTION', courseId).subscribe();
        expect(httpMock.get).toHaveBeenCalledWith(`/stats/course/${courseId}/consumption/csv`, {
          status: 'COMPLETED',
          concluded_after: '2024-01-01',
          concluded_before: '2024-12-31',
        });
      });

      it('should open the warn dialog on success', () => {
        service.downloadReport('USERS_CONSUMPTION', courseId).subscribe();
        expect(dialogMock.open).toHaveBeenCalledWith(KpWarnDialogComponent);
      });
    });
  });
});
