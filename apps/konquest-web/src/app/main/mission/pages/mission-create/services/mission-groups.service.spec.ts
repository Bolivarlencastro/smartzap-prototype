import { KonquestAPI } from '@core/api';

import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { EMPTY, of, throwError } from 'rxjs';

import { MissionGroupsService } from './mission-groups.service';

describe('MissionGroupsService', () => {
  let service: MissionGroupsService;
  let httpMock: jest.Mocked<KonquestAPI>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn().mockReturnValue(of([])),
      post: jest.fn().mockReturnValue(of(EMPTY)),
      delete: jest.fn().mockReturnValue(of(EMPTY)),
    } as any;

    messageServiceMock = { error: jest.fn(), success: jest.fn() } as any;
    service = new MissionGroupsService(httpMock, messageServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('filterGroups', () => {
    it('should filter the groups', (done) => {
      const mockSearch = 'mock_search';

      service.filterGroups(mockSearch).subscribe(() => {
        expect(httpMock.get).toHaveBeenCalledWith('/groups', { search: mockSearch });
        done();
      });
    });
  });

  describe('getGroups', () => {
    it('should get the groups', (done) => {
      const mockMissionId = 'mock_mission_id';

      service.getGroups(mockMissionId).subscribe(() => {
        expect(httpMock.get).toHaveBeenCalledWith('/groups', { mission_id: mockMissionId });
        done();
      });
    });
  });

  describe('addGroup', () => {
    const mockMissionId = 'mock_mission_id';
    const mockGroupId = 'mock_group_id';

    it('should add a group', (done) => {
      service.addGroup(mockMissionId, mockGroupId).subscribe(() => {
        expect(httpMock.post).toHaveBeenCalledWith(`/groups/${mockGroupId}/missions`, { missions: [mockMissionId] });
        done();
      });
    });

    it('should display an success message', (done) => {
      service.addGroup(mockMissionId, mockGroupId).subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.CREATE.SUCCESS.ADD_GROUP');
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.post.mockReturnValue(throwError(() => {}));

      service.addGroup(mockMissionId, mockGroupId).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.ADD_GROUP');
          done();
        },
      });
    });
  });

  describe('removeGroup', () => {
    const mockMissionId = 'mock_mission_id';
    const mockGroupId = 'mock_group_id';

    it('should remove a group', (done) => {
      service.removeGroup(mockMissionId, mockGroupId).subscribe(() => {
        expect(httpMock.delete).toHaveBeenCalledWith(`/groups/${mockGroupId}/missions/${mockMissionId}`);
        done();
      });
    });

    it('should display an success message', (done) => {
      service.removeGroup(mockMissionId, mockGroupId).subscribe(() => {
        expect(messageServiceMock.success).toHaveBeenCalledWith('MISSION.CREATE.SUCCESS.DELETE_GROUP');
        done();
      });
    });

    it('should display an error message on failure', (done) => {
      httpMock.delete.mockReturnValue(throwError(() => {}));

      service.removeGroup(mockMissionId, mockGroupId).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('MISSION.CREATE.ERROR.DELETE_GROUP');
          done();
        },
      });
    });
  });
});
