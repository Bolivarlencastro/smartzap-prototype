import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { GAMIFICATION_FEATURE_KEY, GamificationActions, gamificationInitialState } from '@app/shared/store';
import {
  GamificationItem,
  UserProfileService,
  WorkspaceBasicDto,
  WorkspaceService,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as fromActions from './store/workspace-configurations.actions';
import {
  workspaceConfigurationsInitialState,
  workspaceConfigurationsKey,
} from './store/workspace-configurations.reducer';
import { WorkspaceConfigurationsComponent } from './workspace-configurations.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideNgxMask } from 'ngx-mask';
import * as fromSelectors from './store/workspace-configurations.selectors';

const GET_CONFIGURATIONS = {
  services: [
    {
      label: 'Dashboard',
      field: '0d3752f0-15d7-402a-8628-04ed47bcbf43',
      status: true,
    },
    {
      label: 'Learning Trail',
      field: '0d3752f0-15d7-402a-8628-04ed47bcbf42',
      status: true,
    },
    {
      label: 'Mission',
      field: '0d3752f0-15d7-402a-8628-04ed47bcbf41',
      status: false,
    },
    {
      label: 'Event',
      field: '8064f5d7-e9cb-4bb8-8cb5-09030a14bf52',
      status: false,
    },
    {
      label: 'Pulse',
      field: 'f19a1f71-82fb-46df-ab88-bdd3700da124',
      status: false,
    },
  ],
  settings: {
    min_performance_certificate: 0.8,
    enrollment_goal_duration_days: 10,
  },
};

describe('WorkspaceConfigurationsComponent', () => {
  let component: WorkspaceConfigurationsComponent;
  let fixture: ComponentFixture<WorkspaceConfigurationsComponent>;
  let store: MockStore;
  let workspaceServiceSpy: jest.Mocked<WorkspaceService>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceConfigurationsComponent, getTranslocoTestingModule()],
      providers: [
        provideNgxMask(),
        {
          provide: FormBuilder,
          useValue: formBuilder,
        },
        {
          provide: WorkspaceService,
          useValue: { getCurrentWorkspace: jest.fn() },
        },
        {
          provide: UserProfileService,
          useValue: { isSuperAdmin$: jest.fn() },
        },
        provideMockStore({
          initialState: {
            [workspaceConfigurationsKey]: workspaceConfigurationsInitialState,
            [GAMIFICATION_FEATURE_KEY]: gamificationInitialState,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(fromSelectors.selectWorkspaceConfigurations, GET_CONFIGURATIONS);
    workspaceServiceSpy = TestBed.inject(WorkspaceService) as jest.Mocked<WorkspaceService>;
    const mockWorkspace = {
      id: 'e76b5082-f4fe-4f41-be79-1977840e16a8',
    } as WorkspaceBasicDto;
    workspaceServiceSpy.getCurrentWorkspace.mockReturnValue(mockWorkspace);
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(WorkspaceConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch "savePassMark" with "passMark" input', () => {
    // given
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const workspace = workspaceServiceSpy.getCurrentWorkspace();
    const passMarkControl = component.configurationFormGroup.get('passMark');

    // when
    component.onSubmit();

    // expect
    expect(dispatchSpy).toHaveBeenCalledWith({
      workspaceId: workspace?.id,
      passMark: passMarkControl?.value,
      type: '[Service/API] Save Pass Mark',
    } as any);
  });

  it('should not accept value bigger then MAX_VALUE in passMark field', () => {
    // given
    const passMarkControl = component.configurationFormGroup.get('passMark');

    // when
    passMarkControl?.setValue(1110);

    // expect
    expect(passMarkControl?.value).toBe(WorkspaceConfigurationsComponent.MAX_VALUE);
  });

  it('should set MIN_VALUE in passMark field if value is different of number type', () => {
    // given
    const passMarkControl = component.configurationFormGroup.get('passMark');

    // when
    passMarkControl?.setValue(null);

    // expect
    expect(passMarkControl?.value).toBe(WorkspaceConfigurationsComponent.MIN_VALUE);
  });

  it('should dispatch "changeServiceStatus" when toggle module', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const workspace = workspaceServiceSpy.getCurrentWorkspace();
    const service = GET_CONFIGURATIONS.services[0];

    component.updateServiceToggle(service, false);

    expect(dispatchSpy).toHaveBeenCalledWith(
      fromActions.changeServiceStatus({
        workspaceId: workspace?.id,
        service: service,
        status: false,
      }),
    );
  });

  it('should dispatch "updateGamification" when toggle module', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const item = { id: '123', field: 'ranking_manager' } as GamificationItem;
    const value = true;

    component.updateGamificationSubModuleToggle(item, true);

    expect(dispatchSpy).toHaveBeenCalledWith(
      GamificationActions.updateGamificationSubModules({
        item,
        value,
      }),
    );
  });

  it('should dispatch updateWorkspaceGeneralSettings action when toggle block reenrollment', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const [id, settings, event] = [
      'e76b5082-f4fe-4f41-be79-1977840e16a8',
      { block_reenrollment: true },
      { checked: true } as MatSlideToggleChange,
    ];

    component.onToggleBlockReEnrollment(event);

    expect(dispatchSpy).toHaveBeenCalledWith(fromActions.updateWorkspaceGeneralSettings({ id, settings }));
  });

  afterEach(() => {
    fixture.destroy();
  });
});
