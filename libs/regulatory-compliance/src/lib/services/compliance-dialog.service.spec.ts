import { ComplianceDialogService } from './compliance-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, of, throwError } from 'rxjs';
import { mockCompliances } from './compliance-dialog-mock-data';
import { ComplianceListItem } from '../models';
import { Update } from '@ngrx/entity';
import { ComplianceDialogComponent } from '../containers';
import {
  ComplianceDto,
  CompliancesFilterDto,
  RegulatoryComplianceApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

const mockCompliance: ComplianceDto = { id: 'mock_compliance_id', name: 'Mock Name' };

describe('ComplianceDialogService', () => {
  let service: ComplianceDialogService;
  let mockDialog: jest.Mocked<MatDialog>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let regulatoryComplianceApiMock: jest.Mocked<RegulatoryComplianceApi>;

  beforeEach(() => {
    mockDialog = {
      open: jest.fn(() => ({
        afterClosed: jest.fn(() => of(true)),
        componentInstance: {},
      })),
    } as undefined as jest.Mocked<MatDialog>;

    messageServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    regulatoryComplianceApiMock = {
      getCompliances: jest.fn().mockReturnValue(of(EMPTY)),
      deleteCompliance: jest.fn().mockReturnValue(of(EMPTY)),
      createCompliance: jest.fn().mockReturnValue(of(mockCompliance)),
      updateCompliance: jest.fn().mockReturnValue(of(mockCompliance)),
    } as unknown as jest.Mocked<RegulatoryComplianceApi>;

    service = new ComplianceDialogService(mockDialog, messageServiceMock, regulatoryComplianceApiMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openDialog', () => {
    it('should open the compliance dialog', () => {
      service.openDialog();

      expect(mockDialog.open).toHaveBeenCalledWith(ComplianceDialogComponent, {
        width: '90vw',
        maxWidth: 500,
        autoFocus: 'first-heading',
      });
    });
  });

  describe('loadCompliance', () => {
    it('should return call getCompliances in the regulatory compliances api', () => {
      const filter: CompliancesFilterDto = { search: '', page: 1, perPage: 10 };

      service.loadCompliance(filter);

      expect(regulatoryComplianceApiMock.getCompliances).toHaveBeenCalledWith(filter);
    });
  });

  describe('addCompliance', () => {
    it('create a new compliance', (done) => {
      service.addCompliance('mock_compliance').subscribe((result) => {
        expect(result).toEqual(mockCompliance);

        done();
      });
    });

    it('should display an success message when saved successfully', (done) => {
      service.addCompliance('mock_compliance').subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith(
          'REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.SAVE.SUCCESS',
        );

        done();
      });
    });

    it('should display an error message when saving fails', (done) => {
      regulatoryComplianceApiMock.createCompliance.mockReturnValueOnce(throwError(() => 'Mock Error'));

      service.addCompliance('mock_compliance').subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith(
            'REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.SAVE.FAILURE',
          );

          done();
        },
      });
    });
  });

  describe('updateCompliance', () => {
    it('update a compliance', (done) => {
      service.updateCompliance('mock_compliance_id', 'New name').subscribe((result) => {
        expect(result).toEqual(mockCompliance);

        done();
      });
    });

    it('should display an success message when updated successfully', (done) => {
      service.updateCompliance('mock_compliance_id', 'New name').subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith(
          'REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.SAVE.SUCCESS',
        );

        done();
      });
    });

    it('should display an error message when updating fails', (done) => {
      regulatoryComplianceApiMock.updateCompliance.mockReturnValueOnce(throwError(() => 'Mock Error'));

      service.updateCompliance('mock_compliance_id', 'New name').subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith(
            'REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.SAVE.FAILURE',
          );

          done();
        },
      });
    });
  });

  describe('deleteCompliance', () => {
    it('delete a compliance', (done) => {
      service.deleteCompliance('mock_compliance_id').subscribe(() => {
        expect(regulatoryComplianceApiMock.deleteCompliance).toHaveBeenCalledWith('mock_compliance_id');

        done();
      });
    });

    it('should display an success message when deleted successfully', (done) => {
      service.deleteCompliance('mock_compliance_id').subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith(
          'REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.DELETE.SUCCESS',
        );

        done();
      });
    });

    it('should display an error message when deletion fails', (done) => {
      regulatoryComplianceApiMock.deleteCompliance.mockReturnValueOnce(throwError(() => 'Mock Error'));

      service.deleteCompliance('mock_compliance_id').subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith(
            'REGULATORY_COMPLIANCE.COMPLIANCE_DIALOG.MESSAGES.DELETE.FAILURE',
          );

          done();
        },
      });
    });
  });

  describe('openDeleteConfirmationDialog', () => {
    it('should open the confirmation dialog', () => {
      service.openDeleteConfirmationDialog();

      expect(mockDialog.open).toHaveBeenCalledWith(KpConfirmDialogComponent, { maxWidth: 367 });
    });

    it('should return an observable of the dialog result', (done) => {
      service.openDeleteConfirmationDialog().subscribe((result) => {
        expect(result).toBe(true);

        done();
      });
    });
  });

  describe('getBatchSelectUpdate', () => {
    it('should return a list of Updates defining the selected property', () => {
      const expectedResults: Update<ComplianceListItem>[] = [
        { id: mockCompliances.at(0).id, changes: { selected: true } },
        { id: mockCompliances.at(1).id, changes: { selected: true } },
      ];

      const result = ComplianceDialogService.getBatchSelectUpdate(
        [
          {
            ...mockCompliances.at(0),
            selected: false,
          },
          { ...mockCompliances.at(1), selected: false },
        ],
        true,
      );

      expect(result).toMatchObject(expectedResults);
    });
  });
});
