import { MatDialog } from '@angular/material/dialog';
import { GroupAPI } from '@app/main/group/groups/group.api';
import { VinculateGroupApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { VinculateToGroupComponent } from '../components/vinculate-to-group/vinculate-to-group.component';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { VinculateToGroupService } from './vinculate-to-group.service';

describe('VinculateToGroupService', () => {
  let service: VinculateToGroupService;
  let matDialog: jest.Mocked<MatDialog>;
  let groupAPI: jest.Mocked<GroupAPI>;
  let vinculateGroupAPI: jest.Mocked<VinculateGroupApi>;
  let messageService: jest.Mocked<KpMessageService>;

  beforeEach(() => {
    matDialog = {
      open: jest.fn(() => ({ afterClosed: jest.fn(() => of(EMPTY)) })),
    } as unknown as jest.Mocked<MatDialog>;
    groupAPI = { fetchByQuery: jest.fn(() => of(EMPTY)) } as unknown as jest.Mocked<GroupAPI>;
    vinculateGroupAPI = {
      vinculateCourse: jest.fn(() => of(EMPTY)),
      vinculateLearningTrail: jest.fn(() => of(EMPTY)),
      vinculateChannel: jest.fn(() => of(EMPTY)),
    } as unknown as jest.Mocked<VinculateGroupApi>;
    messageService = { success: jest.fn() } as unknown as jest.Mocked<KpMessageService>;

    service = new VinculateToGroupService(matDialog, groupAPI, vinculateGroupAPI, messageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog', () => {
    service.openDialog();
    expect(matDialog.open).toHaveBeenCalledWith(VinculateToGroupComponent, {
      autoFocus: 'dialog',
      width: '350px',
      disableClose: true,
    });
  });

  it('should fetch groups', (done) => {
    const mockResponse = { results: [{ id: '123' }, { id: '456' }] };
    const search = 'test group';
    groupAPI.fetchByQuery.mockReturnValueOnce(of(mockResponse));

    service.fetchGroups(search).subscribe((results) => {
      expect(groupAPI.fetchByQuery).toHaveBeenCalledWith({ search });
      expect(results).toEqual([{ id: '123' }, { id: '456' }]);
      done();
    });
  });

  describe('vinculateGroup', () => {
    it('should vinculate course to group', (done) => {
      const mockResponse = { group_mission_errors: [] };
      vinculateGroupAPI.vinculateCourse.mockReturnValueOnce(of(mockResponse));

      service.vinculateGroup('group1', 'course', 'content1').subscribe((result) => {
        expect(result).toEqual(mockResponse);
        expect(vinculateGroupAPI.vinculateCourse).toHaveBeenCalledWith('group1', 'content1');
        expect(messageService.success).toHaveBeenCalledWith('GROUP.SUCCESS.LINKED_SUCCESS');
        done();
      });
    });

    it('should vinculate learning trail to group', (done) => {
      const mockResponse = { group_learning_trail_errors: [] };
      vinculateGroupAPI.vinculateLearningTrail.mockReturnValueOnce(of(mockResponse));

      service.vinculateGroup('group1', 'learning-trail', 'content1').subscribe((result) => {
        expect(result).toEqual(mockResponse);
        expect(vinculateGroupAPI.vinculateLearningTrail).toHaveBeenCalledWith('group1', 'content1');
        expect(messageService.success).toHaveBeenCalledWith('GROUP.SUCCESS.LINKED_SUCCESS');
        done();
      });
    });

    it('should vinculate channel to group', (done) => {
      const mockResponse = { errors: [] };
      vinculateGroupAPI.vinculateChannel.mockReturnValueOnce(of(mockResponse));

      service.vinculateGroup('group1', 'channel', 'content1').subscribe((result) => {
        expect(result).toEqual(mockResponse);
        expect(vinculateGroupAPI.vinculateChannel).toHaveBeenCalledWith('group1', 'content1');
        expect(messageService.success).toHaveBeenCalledWith('GROUP.SUCCESS.LINKED_SUCCESS');
        done();
      });
    });
  });
});
