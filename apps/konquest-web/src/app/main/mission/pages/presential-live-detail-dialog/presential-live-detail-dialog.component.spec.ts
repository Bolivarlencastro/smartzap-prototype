import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Enrollment } from '@core/model/enrollment.model';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { AuthService, EnrollmentStatuses, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { KpStatusChipColor } from '@keeps-platform-frontend-workspace/ui/kp-status-chip';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MissionServiceV2 } from 'app/main/mission/services/mission.service';
import { ReportService } from 'app/shared/services/report.service';
import { Mission, MissionModel } from '../../mission.model';
import {
  MissionDetailActions,
  MissionDetailReducer,
  MissionDetailSelectors,
  MissionOptionsMenuActions,
} from '../mission-detail-v2/store';
import { PresentialLiveDetailDialogComponent } from './presential-live-detail-dialog.component';

const ENROLLMENT = {
  id: '125',
  status: EnrollmentStatuses.ENROLLED,
  evaluated: true,
} as Enrollment;

const MISSION = {
  id: '123',
  name: 'Mission Detail Dialog',
  description: 'Mission Description',
  mission_category: {
    name: 'Marketing',
  },
  user_creator: {
    avatar: '',
  },
  mission_model: MissionModel.PRESENTIAL,
  presential: {
    address: 'Pokemon Center',
    dates: [
      {
        start_at: '2022-01-01 20:00:00',
        end_at: '2022-01-01 21:00:00',
        is_today: true,
      },
    ],
    seats: 5,
  },
  enrollment: ENROLLMENT,
} as Mission;
const mockStatus = [
  {
    color: '#92D2D2',
    label: 'MISSION.DETAIL.IS_TODAY',
  },
];

describe('PresentialLiveDetailDialogComponent', () => {
  let component: PresentialLiveDetailDialogComponent;
  let fixture: ComponentFixture<PresentialLiveDetailDialogComponent>;
  let store: MockStore;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;
  let missionServiceMock: jest.Mocked<MissionServiceV2>;

  beforeEach(async () => {
    missionServiceMock = {
      buildStatuses: jest.fn().mockReturnValue(mockStatus),
    } as unknown as jest.Mocked<MissionServiceV2>;
    userProfileServiceMock = {
      isAdmin: jest.fn().mockReturnValue(true),
      isSuperAdmin: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<UserProfileService>;

    await TestBed.configureTestingModule({
      imports: [PresentialLiveDetailDialogComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            'mission-detail-dialog': {
              [MissionDetailReducer.missionDetailFeatureKey]: MissionDetailReducer.initialState,
            },
          },
          selectors: [
            {
              selector: MissionDetailSelectors.selectMissionModel,
              value: MISSION.presential,
            },
            {
              selector: MissionDetailSelectors.selectMission,
              value: MISSION,
            },
            {
              selector: MissionDetailSelectors.selectSupportMaterials,
              value: [],
            },
          ],
        }),
        {
          provide: MAT_DIALOG_DATA,
          useValue: MISSION,
        },
        {
          provide: MatDialogRef,
          useValue: { close: jest.fn() },
        },
        {
          provide: AuthService,
          useValue: { userId: '124' },
        },
        {
          provide: KpMessageService,
          useValue: {},
        },
        {
          provide: ReportService,
          useValue: { generateCourseCertificate: jest.fn(), openCertificate: jest.fn() },
        },
        {
          provide: UserProfileService,
          useValue: userProfileServiceMock,
        },
        { provide: MissionServiceV2, useValue: missionServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PresentialLiveDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with the right values', () => {
    const expectedStatuses = [
      {
        label: 'MISSION.DETAIL.IS_TODAY',
        color: KpStatusChipColor.BLUE,
      },
    ];

    expect(component).toBeTruthy();
    expect(component.statuses).toEqual(expectedStatuses);
  });

  it('should click on main action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.mainActionClick();
    expect(spy).toHaveBeenCalledWith(MissionOptionsMenuActions.executeAction({ action: component.mainAction }));
  });

  it('should dispatch updateLiveMissionSummary action with the correct description', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const description = 'New Mission Description';

    component.updateDescription(description);

    expect(spy).toHaveBeenCalledWith(MissionDetailActions.updateLiveMissionSummary({ description }));
  });

  describe('buildUsersEnrolledParam', () => {
    const cases: any[] = [
      ['with valid seats', 'LIVE', 'live', 10, 5, '5 / 10'],
      ['with null seats', 'LIVE', 'live', null, 5, 5],
      ['with undefined seats', 'LIVE', 'live', undefined, 5, 5],
      ['with zero seats', 'LIVE', 'live', 0, 5, 5],
      ['with different mission_model', 'COURSE', 'course', 15, 7, '7 / 15'],
      ['when mission_model property does not exist', 'INVALID', undefined, 10, 5, 5],
    ];

    test.each(cases)(
      'should set usersEnrolled correctly %s',
      (_, missionModel, modelProperty, seats, usersEnrolled, expected) => {
        const mission: any = {
          mission_model: missionModel,
          users_enrolled: usersEnrolled,
        };

        if (modelProperty) {
          mission[modelProperty] = { seats };
        }

        component['mission'] = mission;
        component['buildUsersEnrolledParam']();

        expect(component.usersEnrolled).toEqual(expected);
      },
    );
  });

  afterEach(() => {
    fixture.destroy();
  });
});
