import { CoursesListService } from './courses-list.service';
import { Router } from '@angular/router';
import { AluraIntegrationsApi } from '../../core';
import { EMPTY, of, throwError } from 'rxjs';
import { CoursesListFilter, UpdateActiveStatusBatchDto } from '../../models';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

describe('CoursesListService', () => {
  let service: CoursesListService;
  let routerMock: jest.Mocked<Router>;
  let aluraIntegrationApiMock: jest.Mocked<AluraIntegrationsApi>;
  let messageServiceMocK: jest.Mocked<KpMessageService>;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn().mockResolvedValue(true) } as unknown as jest.Mocked<Router>;
    messageServiceMocK = { success: jest.fn(), error: jest.fn() } as unknown as jest.Mocked<KpMessageService>;
    aluraIntegrationApiMock = {
      getMirroredCourses: jest.fn().mockReturnValue(of(EMPTY)),
      batchUpdateActiveStatus: jest.fn().mockReturnValue(of(EMPTY)),
      batchDeleteCourses: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<AluraIntegrationsApi>;
    service = new CoursesListService(routerMock, aluraIntegrationApiMock, messageServiceMocK);
  });

  it('should call fetchMirroredCourses with the provided filter', () => {
    const mockFilter: CoursesListFilter = { name: 'mock_search' };
    service.fetchMirroredCourses(mockFilter);
    expect(aluraIntegrationApiMock.getMirroredCourses).toHaveBeenCalledWith(mockFilter);
  });

  it('should call batchUpdateActiveStatus with the provided payload', () => {
    const payload: UpdateActiveStatusBatchDto = { courseIds: ['mock_id_1', 'mock_id_2'], isActive: true };
    service.batchUpdateActiveStatus(payload);
    expect(aluraIntegrationApiMock.batchUpdateActiveStatus).toHaveBeenCalledWith(payload);
  });

  it('should call batchUpdateActiveStatus with the provided payload', (done) => {
    const mockIds = ['mock_id_1', 'mock_id_2'];
    service.batchDeleteCourses(mockIds).subscribe({
      next: () => {
        expect(aluraIntegrationApiMock.batchDeleteCourses).toHaveBeenCalledWith(mockIds);
        expect(messageServiceMocK.success).toHaveBeenCalledWith('INTEGRATIONS.INTEGRATION_LIST.DELETE_COURSE_SUCCESS');
        done();
      },
    });
  });

  it('should display an error message when batchUpdateActiveStatus fails', (done) => {
    const mockIds = ['mock_id_1', 'mock_id_2'];
    aluraIntegrationApiMock.batchDeleteCourses.mockReturnValueOnce(throwError(() => ''));
    service.batchDeleteCourses(mockIds).subscribe({
      error: () => {
        expect(messageServiceMocK.error).toHaveBeenCalledWith('INTEGRATIONS.INTEGRATION_LIST.DELETE_COURSE_FAILURE');
        done();
      },
    });
  });
});
