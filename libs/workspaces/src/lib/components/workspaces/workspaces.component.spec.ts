import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import {
  AuthService,
  UiService,
  UserProfileService,
  WorkspaceBasicDto,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY, of } from 'rxjs';
import { WorkspacesActions } from '../../store/actions';
import { WorkspacesReducers } from '../../store/reducers';

import { WORKSPACES_CONFIG, WorkspacesConfig } from '../../workspaces.module';

import { WorkspacesComponent } from './workspaces.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

const mockWorkspaceConfig: WorkspacesConfig = {
  logoUrl: 'mock_logo_url',
  isMyAccount: true,
  environment: { homeRoute: 'mockHomeRoute' },
};

const mockWorkspace = { id: 'test', name: 'test_workspace', logo_url: 'test_logo' } as WorkspaceBasicDto;

describe('WorkspacesComponent', () => {
  let component: WorkspacesComponent;
  let fixture: ComponentFixture<WorkspacesComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;
  const locationMock = { back: jest.fn() };
  const authServiceMock = { logout: jest.fn() };
  const userProfileServiceMock = {
    isKeepsAdmin: jest.fn().mockReturnValue(true),
  };
  const workspaceServiceMock = { currentWorkspace$: of(EMPTY), createWorkspace: jest.fn() };
  const uiServiceMock = { userApplications$: of([]) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspacesComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        provideMockStore({
          initialState: { [WorkspacesReducers.workspacesFeatureKey]: WorkspacesReducers.initialState },
        }),
        { provide: WORKSPACES_CONFIG, useValue: mockWorkspaceConfig },
        {
          provide: WorkspaceService,
          useValue: workspaceServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: UserProfileService,
          useValue: userProfileServiceMock,
        },
        {
          provide: Location,
          useValue: locationMock,
        },
        {
          provide: UiService,
          useValue: uiServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    userProfileServiceMock.isKeepsAdmin.mockReturnValue(true);
    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function createComponent() {
    fixture = TestBed.createComponent(WorkspacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should dispatch loadWorkspaces and initViewPreferences actions', () => {
    createComponent();

    expect(dispatchSpy).toHaveBeenCalledWith(WorkspacesActions.loadWorkspaces());
    expect(dispatchSpy).toHaveBeenCalledWith(WorkspacesActions.initViewPreferences());
  });

  it('should navigate to previous page', () => {
    createComponent();

    component.back();

    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should call logout', () => {
    createComponent();

    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should dispatch selectWorkspace action', () => {
    createComponent();

    component.selectWorkspace(mockWorkspace);

    expect(dispatchSpy).toHaveBeenCalledWith(WorkspacesActions.selectWorkspace({ workspace: mockWorkspace }));
  });

  it('should call createWorkspace', () => {
    createComponent();

    component.onAddWorkspace();

    expect(workspaceServiceMock.createWorkspace).toHaveBeenCalled();
  });

  it('should dispatch toggleViewMode', () => {
    createComponent();

    component.toggleViewMode();
    expect(dispatchSpy).toHaveBeenCalledWith(WorkspacesActions.toggleViewMode());
  });

  it('should return list view tooltip key when current view is grid', () => {
    createComponent();
    expect(component.getToggleViewTooltipKey('grid')).toBe('WORKSPACES_FEATURE.SWITCH_TO_LIST_VIEW');
  });

  it('should return grid view tooltip key when current view is list', () => {
    createComponent();
    expect(component.getToggleViewTooltipKey('list')).toBe('WORKSPACES_FEATURE.SWITCH_TO_GRID_VIEW');
  });

  it('should return list icon when current view is grid', () => {
    createComponent();
    expect(component.getToggleViewIcon('grid')).toBe('view_list');
  });

  it('should return grid icon when current view is list', () => {
    createComponent();
    expect(component.getToggleViewIcon('list')).toBe('grid_view');
  });
});
