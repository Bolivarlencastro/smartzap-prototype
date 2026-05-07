import { BatchEnrollmentRequest, BatchEnrollmentService } from './batch-enrollment.service';
import { KonquestAPI } from '@core/api';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, of } from 'rxjs';
import { BatchEnrollmentDialogComponent } from '../components/batch-enrollment-dialog/containers/batch-enrollment-dialog/batch-enrollment-dialog.component';
import { User } from '@core/model';
import { CycleDto, RegulatoryComplianceApi, UsersV2Api } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EnrollmentConfig, EnrollmentType } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

describe('BatchEnrollmentService', () => {
  let service: BatchEnrollmentService;
  let konquestApiMock: jest.Mocked<KonquestAPI>;
  let dialogMock: jest.Mocked<MatDialog>;
  let usersApiV2Mock: jest.Mocked<UsersV2Api>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let regulatoryComplianceApiMock: jest.Mocked<RegulatoryComplianceApi>;

  beforeEach(() => {
    konquestApiMock = { post: jest.fn(), postFormData: jest.fn() } as unknown as jest.Mocked<KonquestAPI>;
    dialogMock = {
      open: jest.fn(() => ({
        afterClosed: () => EMPTY,
      })),
    } as unknown as jest.Mocked<MatDialog>;
    usersApiV2Mock = { listBasicUsers: jest.fn(() => EMPTY) } as unknown as jest.Mocked<UsersV2Api>;
    messageServiceMock = { error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    regulatoryComplianceApiMock = {
      getCycles: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<RegulatoryComplianceApi>;

    service = new BatchEnrollmentService(
      konquestApiMock,
      dialogMock,
      usersApiV2Mock,
      messageServiceMock,
      regulatoryComplianceApiMock,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should count the enrollment errors', () => {
    const mockResponse = { enrollment_errors: ['error_1', 'error_1', 'error_1', 'error_1'] };

    expect(BatchEnrollmentService.countErrors(mockResponse)).toBe(4);
  });

  describe('openDialog', () => {
    it('should open the enrollments dialog', () => {
      service.openDialog();

      expect(dialogMock.open).toHaveBeenCalledWith(BatchEnrollmentDialogComponent, {
        minWidth: '300px',
        width: '900px',
        maxWidth: '90vw',
        panelClass: ['p-0', 'm-0'],
      });
    });
  });

  describe('mapUserIdsSelection', () => {
    const mockUsers: User[] = [{ id: 'mock_id_1' }, { id: 'mock_id_2' }, { id: 'mock_id_3' }] as User[];
    it('should return an Record of the ids of the provided users', () => {
      expect(BatchEnrollmentService.mapUserIdsSelection(mockUsers)).toMatchObject({
        mock_id_1: 'mock_id_1',
        mock_id_2: 'mock_id_2',
        mock_id_3: 'mock_id_3',
      });
    });
  });

  describe('buildEnrollmentRequesPayload', () => {
    const mockLearnContentID = 'mock_content_id';
    const mockSelectedIds: Record<string, string> = { mock_id_1: 'mock_id_1', mock_id_2: 'mock_id_2' };
    const mockEnrollmentConfig: EnrollmentConfig = { enrollmentType: EnrollmentType.FREE, date: '2023-09-19' };

    it('should build the enrollment request payload for a non required mission', () => {
      const expectedPayload: BatchEnrollmentRequest = {
        missions: [mockLearnContentID],
        goal_date: '2023-09-19',
        required: false,
        users: ['mock_id_1', 'mock_id_2'],
      };

      const payload = BatchEnrollmentService.buildEnrollmentRequesPayload(
        mockLearnContentID,
        mockSelectedIds,
        'mission',
        mockEnrollmentConfig,
      );

      expect(payload).toMatchObject(expectedPayload);
    });

    it('should build the enrollment request payload for a required mission', () => {
      const expectedPayload: BatchEnrollmentRequest = {
        missions: [mockLearnContentID],
        goal_date: '2023-09-19',
        required: true,
        users: ['mock_id_1', 'mock_id_2'],
      };

      const payload = BatchEnrollmentService.buildEnrollmentRequesPayload(
        mockLearnContentID,
        mockSelectedIds,
        'mission',
        { ...mockEnrollmentConfig, enrollmentType: EnrollmentType.REQUIRED },
      );

      expect(payload).toMatchObject(expectedPayload);
    });

    it('should build the enrollment request payload for a regulatory compliance mission', () => {
      const expectedPayload: BatchEnrollmentRequest = {
        missions: [mockLearnContentID],
        goal_date: '2023-09-19',
        required: false,
        users: ['mock_id_1', 'mock_id_2'],
        regulatory_compliance_cycle: 'mock_compliance_cycle_id',
      };

      const enrollmentConfig: EnrollmentConfig = {
        ...mockEnrollmentConfig,
        enrollmentType: EnrollmentType.COMPLIANCE,
        cycle: { id: 'mock_compliance_cycle_id' } as CycleDto,
      };

      const payload = BatchEnrollmentService.buildEnrollmentRequesPayload(
        mockLearnContentID,
        mockSelectedIds,
        'mission',
        enrollmentConfig,
      );

      expect(payload).toMatchObject(expectedPayload);
    });

    it('should build the enrollment request payload for a non required learning trail', () => {
      const expectedPayload: BatchEnrollmentRequest = {
        learning_trails: [mockLearnContentID],
        goal_date: '2023-09-19',
        required: false,
        users: ['mock_id_1', 'mock_id_2'],
      };

      const payload = BatchEnrollmentService.buildEnrollmentRequesPayload(
        mockLearnContentID,
        mockSelectedIds,
        'learning-trail',
        mockEnrollmentConfig,
      );

      expect(payload).toMatchObject(expectedPayload);
    });

    it('should build the enrollment request payload for a required learning trail', () => {
      const expectedPayload: BatchEnrollmentRequest = {
        learning_trails: [mockLearnContentID],
        goal_date: '2023-09-19',
        required: true,
        users: ['mock_id_1', 'mock_id_2'],
      };

      const payload = BatchEnrollmentService.buildEnrollmentRequesPayload(
        mockLearnContentID,
        mockSelectedIds,
        'learning-trail',
        { ...mockEnrollmentConfig, enrollmentType: EnrollmentType.REQUIRED },
      );

      expect(payload).toMatchObject(expectedPayload);
    });
  });

  describe('filterUsers', () => {
    it('should call listBasicUsers', () => {
      service.filterUsers('mock_search', 1);

      expect(usersApiV2Mock.listBasicUsers).toHaveBeenCalledWith({
        page: 1,
        search: 'mock_search',
        'filter.roles.role.application.id': '$in:0abf08ea-d252-4d7c-ab45-ab3f9135c288',
      });
    });
  });

  describe('filterCycles', () => {
    it('should call getCycles', () => {
      const expectedPayload = { search: 'mock_search', page: 1 };

      service.filterCycles('mock_search');

      expect(regulatoryComplianceApiMock.getCycles).toHaveBeenCalledWith(expectedPayload);
    });
  });
});
