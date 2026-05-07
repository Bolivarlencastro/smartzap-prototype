import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ComplianceListDto,
  CycleCreateDto,
  Job,
  JobFunction,
  JobsApi,
  LearningObjectsListDto,
  RegulatoryComplianceApi,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { CycleCreateComponent } from '../containers';
import { CycleCreateService } from './cycle-create.service';
import { EMPTY, of } from 'rxjs';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpAutocompleteOption } from '@keeps-platform-frontend-workspace/ui/kp-autocomplete';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

const MOCK_JOBS: Job[] = [{ id: 'mock_job_id', name: 'mock_job_name' }];
const MOCK_JOBS_FUNCTIONS: JobFunction[] = [{ id: 'mock_job_function_id', name: 'mock_job_function_name' }];
const MOCK_COMPLIANCES: ComplianceListDto = {
  items: [
    {
      name: 'mock_compliance',
      id: 'mock_compliance_id',
    },
  ],
} as ComplianceListDto;
const MOCK_LEARNING_OBJECTS: LearningObjectsListDto = {
  items: [
    {
      name: 'mock_learning_object',
      id: 'mock_learning_object_id',
      learningObjectTypeId: 'mock_learning_object_type_id',
    },
  ],
} as unknown as LearningObjectsListDto;

describe('RegulatoryComplianceService', () => {
  let service: CycleCreateService;

  let matDialogMock: jest.Mocked<MatDialog>;
  let matDialogRefMock: jest.Mocked<MatDialogRef<CycleCreateComponent>>;
  let messageServiceMock: jest.Mocked<KpMessageService>;
  let jobsApiMock: jest.Mocked<JobsApi>;
  let regulatoryComplianceApiMock: jest.Mocked<RegulatoryComplianceApi>;

  beforeEach(async () => {
    matDialogRefMock = {
      close: jest.fn(),
      afterClosed: jest.fn().mockReturnValue(of(EMPTY)),
      componentInstance: {},
    } as unknown as jest.Mocked<MatDialogRef<CycleCreateComponent>>;
    matDialogMock = { open: jest.fn(() => matDialogRefMock) } as unknown as jest.Mocked<MatDialog>;
    messageServiceMock = { success: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    regulatoryComplianceApiMock = {
      getCycles: jest.fn().mockReturnValue(of(EMPTY)),
      createCycle: jest.fn().mockReturnValue(of(EMPTY)),
      updateCycle: jest.fn().mockReturnValue(of(EMPTY)),
      getCompliances: jest.fn().mockReturnValue(of(MOCK_COMPLIANCES)),
      getLearningObjects: jest.fn().mockReturnValue(of(MOCK_LEARNING_OBJECTS)),
      deleteCycle: jest.fn().mockReturnValue(of(EMPTY)),
      batchDeleteCycles: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<RegulatoryComplianceApi>;
    jobsApiMock = {
      fetchJobs: jest.fn().mockReturnValue(of(MOCK_JOBS)),
      fetchJobFunctions: jest.fn().mockReturnValue(of(MOCK_JOBS_FUNCTIONS)),
    } as unknown as jest.Mocked<JobsApi>;

    service = new CycleCreateService(matDialogMock, messageServiceMock, jobsApiMock, regulatoryComplianceApiMock);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should open cycle dialog', () => {
    service.openCycleDialog();

    expect(matDialogMock.open).toHaveBeenCalledWith(CycleCreateComponent, {
      width: '400px',
      autoFocus: false,
      disableClose: true,
    });
  });

  it('should close cycle dialog', () => {
    service.openCycleDialog();
    service.closeDialog();

    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should open edit confirm dialog', () => {
    service.openEditConfirmDialog();
    expect(matDialogMock.open).toHaveBeenCalledWith(KpConfirmDialogComponent, {
      autoFocus: 'dialog',
      width: '360px',
      disableClose: true,
    });
  });

  it('should open edit delete confirm dialog', () => {
    service.openDeleteConfirmDialog(1);
    expect(matDialogMock.open).toHaveBeenCalledWith(KpConfirmDialogComponent, {
      autoFocus: 'dialog',
      width: '360px',
      disableClose: true,
    });
  });

  describe('getNormativeCycles', () => {
    it('should call getCycles in the regulatoryComplianceApi', () => {
      service.getNormativeCycles({ search: 'mock_search' });

      expect(regulatoryComplianceApiMock.getCycles).toHaveBeenCalledWith({ search: 'mock_search' });
    });
  });

  describe('saveNormativeCycle', () => {
    const mockCycle: CycleCreateDto = {} as CycleCreateDto;

    it('should call createCycle in the regulatoryCompliance api if no id is provided', () => {
      service.saveNormativeCycle(mockCycle, undefined);

      expect(regulatoryComplianceApiMock.createCycle).toHaveBeenCalledWith(mockCycle);
    });

    it('should call updateCycle in the regulatoryCompliance api if an id is provided', () => {
      service.saveNormativeCycle(mockCycle, 'mock_cycle_id');

      expect(regulatoryComplianceApiMock.updateCycle).toHaveBeenCalledWith('mock_cycle_id', mockCycle);
    });
  });

  describe('deleteNormativeCycles', () => {
    it('should call deleteCycle in the regulatoryCompliance api if one id is provided', () => {
      service.deleteNormativeCycles(['mock_id']);

      expect(regulatoryComplianceApiMock.deleteCycle).toHaveBeenCalledWith('mock_id');
    });

    it('should call batchDeleteCycles in the regulatoryCompliance api if more than one id is provided', () => {
      service.deleteNormativeCycles(['mock_id_1', 'mock_id_2']);

      expect(regulatoryComplianceApiMock.batchDeleteCycles).toHaveBeenCalledWith(['mock_id_1', 'mock_id_2']);
    });

    it('should display a success message', (done) => {
      service.deleteNormativeCycles(['mock_cycle_id']).subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith('REGULATORY_COMPLIANCE.DELETE_CYCLE_SUCCESS_MESSAGE');

        done();
      });
    });
  });

  describe('loadJobAndPositions', () => {
    it('should fetch both jobs and positions mapping the response', (done) => {
      const expectedJobs: KpAutocompleteOption[] = [{ value: 'mock_job_id', label: 'mock_job_name' }];
      const expectedJobFunctions: KpAutocompleteOption[] = [
        {
          value: 'mock_job_function_id',
          label: 'mock_job_function_name',
        },
      ];

      service.loadJobAndPositions().subscribe((result) => {
        expect(result.jobs).toMatchObject(expectedJobs);
        expect(result.jobFunctions).toMatchObject(expectedJobFunctions);

        done();
      });
    });
  });

  describe('filterItems', () => {
    it('should filter compliances mapping the response', (done) => {
      const expectedResults: KpAutocompleteOption[] = [
        {
          value: 'mock_compliance_id',
          label: 'mock_compliance',
        },
      ];

      service.filterItems({ search: 'mock_search', type: 'compliances' }).subscribe((response) => {
        expect(response).toMatchObject(expectedResults);
        done();
      });
    });

    it('should filter learning objects mapping the response', (done) => {
      const expectedResults: KpAutocompleteOption[] = [
        {
          value: 'mock_learning_object_id',
          label: 'mock_learning_object',
        },
      ];

      service.filterItems({ search: 'mock_search', type: 'learningObjects' }).subscribe((response) => {
        expect(response).toMatchObject(expectedResults);
        done();
      });
    });
  });
});
