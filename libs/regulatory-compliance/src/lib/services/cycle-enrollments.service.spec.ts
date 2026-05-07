import { CycleEnrollmentsService } from './cycle-enrollments.service';
import {
  EnrollmentsCyclesFilter,
  EnrollmentsCyclesFilterDto,
  RegulatoryComplianceApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, of, throwError } from 'rxjs';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

describe('CycleEnrollmentsService', () => {
  let service: CycleEnrollmentsService;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let dialogMock: jest.Mocked<MatDialog>;
  let regulatoryComplianceApiMock: jest.Mocked<RegulatoryComplianceApi>;

  beforeEach(() => {
    messageServiceMock = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    dialogMock = {
      open: jest.fn(() => ({
        afterClosed: jest.fn(() => of(true)),
        componentInstance: {},
      })),
    } as unknown as jest.Mocked<MatDialog>;

    regulatoryComplianceApiMock = {
      renewEnrollmentCycle: jest.fn().mockReturnValue(of(EMPTY)),
      getEnrollmentsCycles: jest.fn().mockReturnValue(of(EMPTY)),
      disableEnrollmentCycle: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<RegulatoryComplianceApi>;

    service = new CycleEnrollmentsService(messageServiceMock, dialogMock, regulatoryComplianceApiMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadEnrollments', () => {
    it('should call getEnrollmentsCycles in the regulatory compliance api', () => {
      const mockFilter: EnrollmentsCyclesFilter = { search: 'mock_search', page: 1, perPage: 10 };
      const expectedFilter: EnrollmentsCyclesFilterDto = { search: 'mock_search', page: 1, limit: 10 };

      service.loadEnrollments(mockFilter);

      expect(regulatoryComplianceApiMock.getEnrollmentsCycles).toHaveBeenCalledWith(expectedFilter);
    });
  });

  describe('renewCycle', () => {
    it('should call renewEnrollmentCycle in the regulatory compliance api', () => {
      service.renewEnrollment('mock_cycle_id', 'mock_enrollment_id');

      expect(regulatoryComplianceApiMock.renewEnrollmentCycle).toHaveBeenCalledWith(
        'mock_cycle_id',
        'mock_enrollment_id',
      );
    });

    it('should display a success message', (done) => {
      service.renewEnrollment('mock_cycle_id', 'mock_enrollment_id').subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith(
          'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.MESSAGES.RENEW_SUCCESS',
        );

        done();
      });
    });

    it('should display an error message on failure', (done) => {
      const mockErrorMessage = 'Mock error message';
      regulatoryComplianceApiMock.renewEnrollmentCycle.mockReturnValueOnce(
        throwError(() => ({ error: { message: mockErrorMessage } })),
      );

      service.renewEnrollment('mock_cycle_id', 'mock_enrollment_id').subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith(mockErrorMessage);
          done();
        },
      });
    });
  });

  describe('inactivateCycle', () => {
    it('should call disableEnrollmentCycle in the regulatory compliance api', () => {
      service.inactivateCycle('mock_cycle_id');

      expect(regulatoryComplianceApiMock.disableEnrollmentCycle).toHaveBeenCalledWith('mock_cycle_id');
    });

    it('should display a success message', (done) => {
      service.inactivateCycle('mock_cycle_id').subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith(
          'REGULATORY_COMPLIANCE.CYCLE_MANAGEMENT.MESSAGES.INACTIVATE_SUCCESS',
        );

        done();
      });
    });
  });

  it('should open confirmation the confirmation dialog', () => {
    service.openConfirmationDialog('renew');

    expect(dialogMock.open).toHaveBeenCalledWith(KpConfirmDialogComponent, {
      autoFocus: 'dialog',
      width: '360px',
    });
  });
});
