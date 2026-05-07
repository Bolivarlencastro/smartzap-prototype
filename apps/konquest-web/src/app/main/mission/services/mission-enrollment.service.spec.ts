import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { KonquestAPI } from '@core/api';
import { User } from '@core/model';
import { KeepsUtils, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionEnrollmentService } from 'app/main/mission/services';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('MissionEnrollmentService', () => {
  let service: MissionEnrollmentService;
  let konquestApi: jest.Mocked<KonquestAPI>;
  let matDialog: jest.Mocked<MatDialog>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        MissionEnrollmentService,
        WorkspaceService,
        {
          provide: KonquestAPI,
          useValue: { post: jest.fn(), patch: jest.fn(), delete: jest.fn(), postFormData: jest.fn() },
        },
        {
          provide: MatDialog,
          useValue: { open: jest.fn() },
        },
      ],
    });

    service = TestBed.inject(MissionEnrollmentService);
    konquestApi = TestBed.inject(KonquestAPI) as jest.Mocked<KonquestAPI>;
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    matDialog.open.mockReturnValue({ afterClosed: () => of(true) } as any);
  });

  beforeEach(() => {
    const mockedDate = new Date('2022-08-30T00:00:00.000Z');
    jest.useFakeTimers().setSystemTime(mockedDate);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.useRealTimers();
  });

  describe('delete', () => {
    it('should call delete enrollment endpoint with enrollmentId', (done) => {
      konquestApi.delete.mockReturnValue(of({}));
      const enrollmentId = 'enrollmentId';

      service.delete(enrollmentId).subscribe(() => {
        expect(konquestApi.delete).toHaveBeenCalledWith(`/mission-enrollments/${enrollmentId}`);
        done();
      });
    });
  });

  describe('batchDelete', () => {
    it('should call batch delete enrollment endpoint with enrollmentIds', (done) => {
      konquestApi.post.mockReturnValue(of({}));
      const enrollmentIds = ['enrollmentId'];

      service.batchDelete(enrollmentIds).subscribe(() => {
        expect(konquestApi.post).toHaveBeenCalledWith('/mission-enrollments/batch-delete', {
          enrollment_ids: enrollmentIds,
        });
        done();
      });
    });
  });

  describe('generateReport', () => {
    it('should call mission enrollments report endpoint with missionId', (done) => {
      konquestApi.post.mockReturnValue(of({}));
      const missionId = 'mission-id';

      service.generateReport(missionId).subscribe(() => {
        expect(konquestApi.post).toHaveBeenCalledWith('/mission-enrollments/report', {
          mission_id: missionId,
        });
        done();
      });
    });
  });

  describe('batchEnroll', () => {
    it('should call batch enroll endpoint', (done) => {
      const missionId = 'missionId';
      const userIds = ['user1', 'user2'];
      konquestApi.post.mockReturnValue(of([]));

      service.batchEnroll(missionId, userIds).subscribe(() => {
        expect(konquestApi.post).toHaveBeenCalledWith('/mission-enrollments/batch/sync', {
          missions: [missionId],
          users: userIds,
        });
        done();
      });
    });
  });

  describe('parseUsersFromSheet', () => {
    it('should call parse users endpoint and return mapped succeed and failed users', (done) => {
      const file = new File([], 'filename.xlsx');
      const formData = new FormData();
      formData.append('file', file);
      const foundUser = { id: 'userId', name: 'User', email: 'found_user@email.com' };
      const notFoundUser = 'notfound_user@email.com';
      const mockedId = 'mockedId';
      const expectedResponse = {
        success: [new User(foundUser)],
        failed: [new User({ id: mockedId, email: notFoundUser })],
      };
      konquestApi.postFormData.mockReturnValue(of({ founds: [foundUser], not_founds: [notFoundUser] }));
      jest.spyOn(KeepsUtils, 'generateGUID').mockReturnValue(mockedId);

      service.parseUsersFromSheet(file).subscribe((response) => {
        expect(konquestApi.postFormData).toHaveBeenCalledWith('/accounts/users/parser', formData);
        expect(response).toEqual(expectedResponse);
        done();
      });
    });
  });
});
