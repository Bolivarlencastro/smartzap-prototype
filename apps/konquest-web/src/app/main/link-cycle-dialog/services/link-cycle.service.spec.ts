import { MatDialog } from '@angular/material/dialog';
import { LinkCycleDialogComponent } from '../link-cycle-dialog.component';
import { LinkCycleService } from './link-cycle.service';
import { RegulatoryComplianceApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of, throwError } from 'rxjs';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

describe('LinkCycleService', () => {
  let service: LinkCycleService;
  let matDialogMock: jest.Mocked<MatDialog>;
  let regulatoryComplianceApiMock: jest.Mocked<RegulatoryComplianceApi>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    matDialogMock = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;
    regulatoryComplianceApiMock = {
      getCycles: jest.fn().mockReturnValue(of([])),
      renewEnrollmentCycle: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<RegulatoryComplianceApi>;
    messageServiceMock = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    service = new LinkCycleService(matDialogMock, regulatoryComplianceApiMock, messageServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog', () => {
    const spy = jest.spyOn(matDialogMock, 'open');
    service.openDialog();
    expect(spy).toHaveBeenCalledWith(LinkCycleDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });
  });

  it('should filter cycles', (done) => {
    service.getCycles('mock_search').subscribe(() => {
      expect(regulatoryComplianceApiMock.getCycles).toHaveBeenCalledWith({ search: 'mock_search', page: 1 });

      done();
    });
  });

  describe('linkEnrollmentToCycle', () => {
    it('link an enrollment to a cycle', (done) => {
      service.linkEnrollmentToCycle('mock_cycle_id', 'mock_enrollment_id').subscribe(() => {
        expect(regulatoryComplianceApiMock.renewEnrollmentCycle).toHaveBeenCalledWith(
          'mock_cycle_id',
          'mock_enrollment_id',
        );

        done();
      });
    });

    it('display a success message', (done) => {
      service.linkEnrollmentToCycle('mock_cycle_id', 'mock_enrollment_id').subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith('LINK_CYCLE.ENROLLMENT_LINKED_SUCCESSFULLY');

        done();
      });
    });

    it('display an error message on failure', (done) => {
      regulatoryComplianceApiMock.renewEnrollmentCycle.mockReturnValueOnce(throwError(() => {}));
      service.linkEnrollmentToCycle('mock_cycle_id', 'mock_enrollment_id').subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('LINK_CYCLE.ENROLLMENT_LINK_FAILURE');
          done();
        },
      });
    });
  });
});
