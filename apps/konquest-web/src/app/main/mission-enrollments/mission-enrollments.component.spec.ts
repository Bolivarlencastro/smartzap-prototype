import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Enrollment, ExtendDeadlineDialogData } from '@core/model/enrollment.model';
import { AuthService, EnrollmentStatuses, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY, of } from 'rxjs';
import { MissionDoneActionType } from './consts';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { EnrollmentFilter } from 'app/shared/components/enrollments-filter';
import { MissionEnrollmentsComponent } from './mission-enrollments.component';
import * as fromActions from './store/mission-enrollments.actions';
import { initialState } from './store/mission-enrollments.reducer';
import * as fromSelectors from './store/mission-enrollments.selectors';
import { provideRouter } from '@angular/router';
import { EnrollmentsFilterComponent } from 'app/shared/components/enrollments-filter/enrollments-filter.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('MissionEnrollmentsComponent', () => {
  let component: MissionEnrollmentsComponent;
  let dialog: jest.Mocked<MatDialog>;
  let fixture: ComponentFixture<MissionEnrollmentsComponent>;
  let authService: AuthService;
  let store: MockStore;

  beforeEach(async () => {
    TestBed.overrideComponent(MissionEnrollmentsComponent, {
      remove: { imports: [EnrollmentsFilterComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [MissionEnrollmentsComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        provideMockStore({
          selectors: [
            {
              selector: fromSelectors.selectEnrollments,
              value: [{ id: '123' }],
            },
          ],
          initialState,
        }),
        {
          provide: AuthService,
          useValue: { userId: '1235' },
        },
        {
          provide: FormBuilder,
          useValue: new FormBuilder(),
        },
        {
          provide: MatDialog,
          useValue: { open: jest.fn().mockReturnValue({ afterClosed: jest.fn(() => of(1)) }) },
        },
        {
          provide: UserProfileService,
          useValue: { isSuperAdmin$: jest.fn(() => of(EMPTY)) },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    authService = TestBed.inject(AuthService);

    dialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;

    fixture = TestBed.createComponent(MissionEnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect
    expect(component).toBeTruthy();
  });

  it('should load the linked learning trails', () => {
    // given
    const mission = { id: '123' };

    // when
    component.openLearningTrailLinkedDialog({ mission } as Enrollment);

    // expect
    expect(store.dispatch).toHaveBeenCalledWith(fromActions.loadLinkedLearningTrails({ missionId: mission.id }));
  });

  it('should dispatch generate the certificate', () => {
    // given
    const expectedEnrollmentId = '123';

    // when
    component.onGenerateCertificate({ id: expectedEnrollmentId } as Enrollment);

    // expect
    expect(store.dispatch).toHaveBeenCalledWith(
      fromActions.generateCertificate({ id: expectedEnrollmentId, isMobile: false }),
    );
  });

  it('should open external certificate if certificate_provider_url has value', () => {
    // given
    const windowOpenSpy = (window.open = jest.fn());
    const expectedEnrollmentId = '123';
    const certificateProviderUrl = 'www.keeps.com.br';

    // when
    component.onGenerateCertificate({
      id: expectedEnrollmentId,
      certificate_provider_url: certificateProviderUrl,
    } as Enrollment);

    // expect
    expect(store.dispatch).not.toHaveBeenCalledWith(fromActions.generateCertificate({ id: expectedEnrollmentId }));
    expect(windowOpenSpy).toHaveBeenCalledWith(certificateProviderUrl);
  });

  it('should open confirmation dialog if there not action', () => {
    // given
    const action = MissionDoneActionType.DELETE;

    // when
    component.executeAction(action, { id: '123' } as Enrollment);

    // expect
    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.delete',
    );
  });

  it('should open give up dialog', () => {
    // given
    const action = MissionDoneActionType.GIVE_UP;

    // when
    component.executeAction(action, { id: '123' } as Enrollment);

    // expect
    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.giveUp',
    );
  });

  it('should open reject dialog', () => {
    // given
    const action = MissionDoneActionType.REJECT_CERTIFICATE;

    // when
    component.executeAction(action, { id: '123' } as Enrollment);

    // expect
    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.rejectCertificate',
    );
  });

  it('should open re enroll dialog', () => {
    // given
    const action = MissionDoneActionType.RE_ENROLL;
    const enrollment = {
      id: '123',
      mission: { id: '124' },
      user: { id: '1235' },
    } as Enrollment;
    component.goalDate = new Date();

    // when
    component.executeAction(action, enrollment);

    // expect
    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.reEnroll',
    );
  });

  it('should open extend deadline by admin dialog', () => {
    const action = MissionDoneActionType.EXTEND_DEADLINE_ADMIN;
    const expectedData: ExtendDeadlineDialogData = {
      user: 'mock_user',
      learningObjectName: 'mock_mission',
      startDate: '01/01/0000',
      currentGoalDate: '02/02/0000',
      learnContentType: 'mission',
    };
    const enrollment = {
      id: '123',
      user: { id: '1235', name: 'mock_user' },
      mission: { name: 'mock_mission' },
      start_date: '01/01/0000',
      goal_date: '02/02/0000',
    } as Enrollment;
    component.goalDate = new Date();

    component.executeAction(action, enrollment);

    expect(dialog.open.mock.lastCall[1].data).toMatchObject(expectedData);
  });

  it('should open history dialog', () => {
    // given
    const action = MissionDoneActionType.HISTORY;

    // when
    component.executeAction(action, { id: '123' } as Enrollment);

    // expect
    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.history',
    );
  });

  it('should open approve certificate dialog', () => {
    // given
    const action = MissionDoneActionType.APPROVE_CERTIFICATE;

    // when
    component.executeAction(action, { id: '123' } as Enrollment);

    // expect
    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.approveCertificate',
    );
  });

  it('should open approve enrollment dialog', () => {
    // given
    const action = MissionDoneActionType.APPROVE_ENROLLMENT;

    // when
    component.executeAction(action, { id: '123' } as Enrollment);

    // expect
    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.approveEnrollment',
    );
  });

  it('should open external provider dialog', () => {
    // given
    const action = MissionDoneActionType.EXTERNAL_PROVIDER;

    // when
    component.executeAction(action, {
      mission: {
        provider: {
          icon: 'icon',
        },
      },
    } as Enrollment);

    // expect
    expect((dialog.open.mock.lastCall[1].data as { confirmTitle: string }).confirmTitle).toMatch(
      'ENROLLMENTS.TITLE.externalProvider',
    );
  });

  it('should dispatch view activities', () => {
    // given
    const action = MissionDoneActionType.VIEW_ACTIVITIES;
    const enrollment = { id: '123' } as Enrollment;

    // when
    component.executeAction(action, enrollment);

    // expect
    expect(dialog.open).not.toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(fromActions.loadTracking({ enrollment }));
  });

  it('should dispatch load user by id if action is previous enrollments', () => {
    // given
    const action = MissionDoneActionType.PREVIOUS_ENROLLMENTS;
    const enrollment = {
      mission: {
        id: '123',
      },
      user: {
        id: '1235',
      },
    } as Enrollment;

    // when
    component.executeAction(action, enrollment);

    // expect
    expect(dialog.open).not.toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(
      fromActions.loadEnrollmentsByUser({
        missionId: enrollment.mission.id,
        userId: authService.userId,
      }),
    );
  });

  it('should dispatch execute action if action is continue', () => {
    // given
    const action = MissionDoneActionType.CONTINUE;
    const enrollment = {
      mission: {
        id: '123',
      },
      user: {
        id: '1235',
      },
    } as Enrollment;

    // when
    component.executeAction(action, enrollment);

    // expect
    expect(dialog.open).not.toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(fromActions.executeAction({ action, payload: enrollment }));
  });

  it('should dispatch filter action', () => {
    const filter: EnrollmentFilter = { status: ['test'] };
    component.onFilterChange(filter);

    expect(store.dispatch).toHaveBeenCalledWith(fromActions.saveFilter({ filter }));
  });

  it('should searchChange action', () => {
    component.onSearchChange('mock_search');

    expect(store.dispatch).toHaveBeenCalledWith(fromActions.searchChange({ search: 'mock_search' }));
  });

  it('should dispatch page change action adding one to pageIndex', () => {
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 20 };

    component.onChangePage(pageEvent);

    expect(store.dispatch).toHaveBeenCalledWith(
      fromActions.paginationChange({
        page: pageEvent.pageIndex + 1,
        per_page: pageEvent.pageSize,
      }),
    );
  });

  it('should dispatch sort change action', () => {
    const sortChange: Sort = { active: 'mission__name', direction: 'asc' };

    component.handleSort(sortChange);

    expect(store.dispatch).toHaveBeenCalledWith(
      fromActions.sortChange({
        field: sortChange.active,
        direction: sortChange.direction,
      }),
    );
  });

  it('should dispatch loadEnrollments when change page', () => {
    // given
    const event = {
      pageIndex: 1,
      pageSize: 10,
    } as PageEvent;

    // when
    component.onChangePage(event);

    // expect
    expect(store.dispatch).toHaveBeenCalledWith(fromActions.paginationChange({ page: 2, per_page: 10 }));
  });

  it('should fetch more items', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.fetchMoreItems();

    expect(spy).toHaveBeenCalledWith(fromActions.fetchMoreItems());
  });

  it('should execute action for mobile', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const item1 = { id: '1', status: EnrollmentStatuses.ENROLLED };
    const item2 = { id: '2', status: EnrollmentStatuses.COMPLETED };

    component.executeActionMobile({ item: item2 as Enrollment, action: 'generateCertificate' });
    expect(spy).toHaveBeenCalledWith(fromActions.generateCertificate({ id: item2.id, isMobile: true }));

    component.executeActionMobile({ item: item1 as Enrollment, action: MissionDoneActionType.VIEW_MISSION });
    expect(spy).toHaveBeenCalledWith(
      fromActions.executeAction({ action: MissionDoneActionType.VIEW_MISSION, payload: item1 }),
    );
  });

  it('should dispatch action for open mission', () => {
    const action = MissionDoneActionType.OPEN_MISSION;
    const enrollment = { id: '123' } as Enrollment;
    component.executeAction(action, enrollment);
    expect(store.dispatch).toHaveBeenCalledWith(fromActions.executeAction({ action, payload: enrollment }));
  });

  afterEach(() => {
    fixture.destroy();
  });
});
