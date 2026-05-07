import {
  CreateLearnContentButtonService,
  CreateLearnContentButtonViewModel,
} from './create-learn-content-button.service';
import { apps, UserProfileService, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MissionScormService } from 'app/main/mission/pages/mission-create/services/mission-scorm.service';
import { GroupAPI } from 'app/main/group/groups/group.api';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { GroupDialogComponent } from 'app/main/group/groups/components';

const mockWorkspaceServices = [
  { id: apps.konquest.services.mission.id },
  { id: apps.konquest.services.learning_trail.id },
  { id: apps.konquest.services.pulse.id } as any,
  { id: apps.konquest.services.event.id } as any,
];

describe('CreateLearnContentButtonService', () => {
  let service: CreateLearnContentButtonService;
  let workspaceServiceMock: jest.Mocked<WorkspaceService>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;
  let scormServiceMock: jest.Mocked<MissionScormService>;
  let groupApiMock: jest.Mocked<GroupAPI>;
  let dialogMock: jest.Mocked<MatDialog>;
  let routerMock: jest.Mocked<Router>;
  const isAdminSubject = new BehaviorSubject(true);
  const isContentCreatorSubject = new BehaviorSubject(true);
  const hasRolesSubject = new BehaviorSubject(true);

  beforeEach(() => {
    workspaceServiceMock = {
      workspaceServices$: of(mockWorkspaceServices),
    } as unknown as jest.Mocked<WorkspaceService>;
    userProfileServiceMock = {
      isAdmin$: jest.fn().mockImplementation(() => isAdminSubject.asObservable()),
      isCurator$: jest.fn().mockImplementation(() => isContentCreatorSubject.asObservable()),
      hasRoles$: jest.fn().mockImplementation(() => hasRolesSubject.asObservable()),
    } as unknown as jest.Mocked<UserProfileService>;
    scormServiceMock = { openScormUploadDialog: jest.fn() } as unknown as jest.Mocked<MissionScormService>;
    groupApiMock = {
      create: jest.fn().mockReturnValue(of({ id: 'mock_group_id' })),
    } as unknown as jest.Mocked<GroupAPI>;
    dialogMock = {
      open: jest.fn().mockReturnValue({ afterClosed: jest.fn().mockReturnValue(of({ name: 'mock_result' })) }),
    } as unknown as jest.Mocked<MatDialog>;
    routerMock = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    service = new CreateLearnContentButtonService(
      workspaceServiceMock,
      userProfileServiceMock,
      scormServiceMock,
      groupApiMock,
      dialogMock,
      routerMock,
    );
  });

  it('should return the component view model', (done) => {
    const expectedViewModel: CreateLearnContentButtonViewModel = {
      canCreateMissions: true,
      canCreatePulses: true,
      canCreateTrails: true,
      canCreateGroups: true,
      showMenu: true,
      canCreateEvents: true,
    };

    service.createLearnContentButtonViewModel$.subscribe((viewModel) => {
      expect(viewModel).toMatchObject(expectedViewModel);
      done();
    });
  });

  it('should not be able to create groups if the user is not an admin', (done) => {
    isAdminSubject.next(false);

    const expectedViewModel: CreateLearnContentButtonViewModel = {
      canCreateMissions: true,
      canCreatePulses: true,
      canCreateTrails: true,
      canCreateGroups: false,
      showMenu: true,
      canCreateEvents: true,
    };

    service.createLearnContentButtonViewModel$.subscribe((viewModel) => {
      expect(viewModel).toMatchObject(expectedViewModel);
      done();
    });
  });

  it('should not be able to create learn contents when the user is not an admin, content creator or instructor', (done) => {
    isContentCreatorSubject.next(false);
    isAdminSubject.next(false);
    hasRolesSubject.next(false);

    const expectedViewModel: CreateLearnContentButtonViewModel = {
      canCreateMissions: false,
      canCreatePulses: false,
      canCreateTrails: false,
      canCreateGroups: false,
      showMenu: false,
      canCreateEvents: false,
    };

    service.createLearnContentButtonViewModel$.subscribe((viewModel) => {
      expect(viewModel).toMatchObject(expectedViewModel);
      done();
    });
  });

  it('should be able to create events when the user is an instructor', (done) => {
    isContentCreatorSubject.next(false);
    isAdminSubject.next(false);
    hasRolesSubject.next(true);

    const expectedViewModel: CreateLearnContentButtonViewModel = {
      canCreateMissions: false,
      canCreatePulses: false,
      canCreateTrails: false,
      canCreateGroups: false,
      canCreateEvents: true,
      showMenu: true,
    };

    service.createLearnContentButtonViewModel$.subscribe((viewModel) => {
      expect(viewModel).toMatchObject(expectedViewModel);
      done();
    });
  });

  it('should call the openScormUploadDialog in the scormService', () => {
    service.createScorm();

    expect(scormServiceMock.openScormUploadDialog).toHaveBeenCalled();
  });

  describe('createGroup', () => {
    it('should open the group creation dialog', () => {
      service.createGroup();

      expect(dialogMock.open).toHaveBeenCalledWith(GroupDialogComponent, {
        autoFocus: 'dialog',
        minWidth: '300px',
        width: '450px',
      });
    });

    it('should create the group with the resulting name and redirect to the group details page', () => {
      service.createGroup();

      expect(groupApiMock.create).toHaveBeenCalledWith({ name: 'mock_result' });
      expect(routerMock.navigate).toHaveBeenCalledWith(['/settings/groups', 'mock_group_id']);
    });

    it('should not try to create a group if no name is returned from the creation dialog', () => {
      dialogMock.open.mockReturnValueOnce({ afterClosed: jest.fn().mockReturnValue(of(undefined)) } as any);
      service.createGroup();

      expect(groupApiMock.create).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});
