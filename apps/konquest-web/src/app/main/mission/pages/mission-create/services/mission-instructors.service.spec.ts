import { MatDialog } from '@angular/material/dialog';
import { KonquestAPI } from '@core/api';
import {
  Mission,
  MissionInstructor,
  MissionLive,
  MissionModel,
  MissionPresential,
  NewInstructorData,
} from 'app/main/mission/mission.model';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { EMPTY, of, throwError } from 'rxjs';

import { MissionInstructorsService } from './mission-instructors.service';

describe('MissionInstructorsService', () => {
  let service: MissionInstructorsService;
  let dialogMock: jest.Mocked<MatDialog>;
  let httpMock: jest.Mocked<KonquestAPI>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn().mockReturnValue(of([])),
      post: jest.fn().mockReturnValue(of(EMPTY)),
      delete: jest.fn().mockReturnValue(of(EMPTY)),
      postFormData: jest.fn().mockReturnValue(of(EMPTY)),
    } as any;

    messageServiceMock = { error: jest.fn(), success: jest.fn() } as any;
    dialogMock = { open: jest.fn().mockReturnValue({ afterClosed: jest.fn().mockReturnValue(of(EMPTY)) }) } as any;

    service = new MissionInstructorsService(dialogMock, httpMock, messageServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerInstructor', () => {
    const mockInstructorData: NewInstructorData = { name: 'test', email: 'test', avatarData: '', avatar: null };
    const formData = new FormData();
    formData.append('name', mockInstructorData.name);
    formData.append('email', mockInstructorData.email);

    it('should create the new instructor', (done) => {
      service.registerInstructor(mockInstructorData).subscribe(() => {
        expect(httpMock.postFormData).toHaveBeenCalledWith('/accounts/users/instructors', formData);
        done();
      });
    });

    it('should display an success message', (done) => {
      service.registerInstructor(mockInstructorData).subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.CREATE.SUCCESS.REGISTER_INSTRUCTOR');
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.postFormData.mockReturnValue(throwError(() => ({ error: { detail: 'mock_detail' } })));

      service.registerInstructor(mockInstructorData).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('mock_detail');
          done();
        },
      });
    });
  });

  describe('addInstructor', () => {
    const mockInstructorId = 'mock_instructor_id';
    const mockMissionId = 'mock_mission_id';

    it('should add an instructor', (done) => {
      service.addInstructor(mockInstructorId, mockMissionId).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith(`/missions/sync/${mockMissionId}/instructor`, {
          user_id: mockInstructorId,
        });
        done();
      });
    });

    it('should display an success message', (done) => {
      service.addInstructor(mockInstructorId, mockMissionId).subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.CREATE.SUCCESS.ADD_INSTRUCTOR');
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.post.mockReturnValue(throwError(() => {}));

      service.addInstructor(mockInstructorId, mockMissionId).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.ADD_INSTRUCTOR');
          done();
        },
      });
    });
  });

  describe('removeInstructor', () => {
    const mockInstructorId = 'mock_instructor_id';
    const mockMissionId = 'mock_mission_id';

    it('should remove an instructor', (done) => {
      service.removeInstructor(mockInstructorId, mockMissionId).subscribe(() => {
        expect(httpMock.delete).toHaveBeenCalledWith(`/missions/sync/${mockMissionId}/instructor/${mockInstructorId}`);
        done();
      });
    });

    it('should display an success message', (done) => {
      service.removeInstructor(mockInstructorId, mockMissionId).subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.CREATE.SUCCESS.REMOVE_INSTRUCTOR');
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.delete.mockReturnValue(throwError(() => ({ error: { detail: 'mock_detail' } })));

      service.removeInstructor(mockInstructorId, mockInstructorId).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('mock_detail');
          done();
        },
      });
    });
  });

  describe('filterInstructors', () => {
    it('should get the instructors', (done) => {
      const mockSearch = 'mock_search';
      service.filterInstructors(mockSearch).subscribe(() => {
        expect(httpMock.get).toHaveBeenCalledWith('/accounts/users/instructors', { search: mockSearch });
        done();
      });
    });
  });

  describe('openNewInstructorDialog', () => {
    it('should open the register dialog', (done) => {
      service.openNewInstructorDialog().subscribe(() => {
        expect(dialogMock.open).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('getInstructorsFromMission', () => {
    it('should return the instructors from presential mission', () => {
      const mockInstructors: MissionInstructor[] = [{ id: 'mock_id', name: 'mock_name' }];
      const mockPresentialInfo: Partial<MissionPresential> = { instructors: mockInstructors };
      const mockMission = { mission_model: MissionModel.PRESENTIAL, presential: mockPresentialInfo } as Mission;

      expect(MissionInstructorsService.getInstructorsFromMission(mockMission)).toEqual(mockInstructors);
    });

    it('should return the instructors from live mission', () => {
      const mockInstructors: MissionInstructor[] = [{ id: 'mock_id', name: 'mock_name' }];
      const mockLiveInfo: Partial<MissionLive> = { instructors: mockInstructors };
      const mockMission = { mission_model: MissionModel.LIVE, live: mockLiveInfo } as Mission;

      expect(MissionInstructorsService.getInstructorsFromMission(mockMission)).toEqual(mockInstructors);
    });
  });
});
