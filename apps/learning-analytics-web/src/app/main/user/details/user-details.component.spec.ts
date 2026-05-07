import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { AnalyticsApiFilter, KpExporterService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpUserDetailsChartsComponent } from '@keeps-platform-frontend-workspace/ui/kp-user-details-charts';
import { UserFilterService } from 'app/main/user/services/user-filter.service';
import { BehaviorSubject, firstValueFrom, EMPTY, of } from 'rxjs';
import { UserDetailsComponent } from './user-details.component';
import { UserDetailsService } from './user-details.service';
import { PageEvent } from '@angular/material/paginator';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let kpExporterServiceMock: jest.Mocked<KpExporterService>;
  let userDetailsServiceMock: {
    fetchUserData: jest.Mock;
    fetchUserEnrollments: jest.Mock;
    userResponse$: ReturnType<typeof of>;
    userData$: ReturnType<typeof of>;
    userStats$: BehaviorSubject<any>;
    performanceRanges$: ReturnType<typeof of>;
    topEnrollmentCategories$: ReturnType<typeof of>;
    topContentConsumed$: ReturnType<typeof of>;
    userEnrollmentList$: ReturnType<typeof of>;
  };
  let userFilterServiceMock: {
    openFilters: jest.Mock;
    getCurrentFilter: jest.Mock;
  };

  beforeEach(async () => {
    userDetailsServiceMock = {
      fetchUserData: jest.fn(),
      fetchUserEnrollments: jest.fn(),
      userResponse$: of(EMPTY),
      userData$: of(EMPTY),
      userStats$: new BehaviorSubject(null),
      performanceRanges$: of(EMPTY),
      topEnrollmentCategories$: of(EMPTY),
      topContentConsumed$: of(EMPTY),
      userEnrollmentList$: of(EMPTY),
    };

    userFilterServiceMock = {
      openFilters: jest.fn(() => of({})),
      getCurrentFilter: jest.fn(() => ({})),
    };

    TestBed.overrideComponent(UserDetailsComponent, {
      remove: { providers: [UserFilterService, UserDetailsService], imports: [KpUserDetailsChartsComponent] },
      add: {
        providers: [
          { provide: UserFilterService, useValue: userFilterServiceMock },
          { provide: UserDetailsService, useValue: userDetailsServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      },
    });

    kpExporterServiceMock = { exportPDF: jest.fn() } as unknown as jest.Mocked<KpExporterService>;
    await TestBed.configureTestingModule({
      imports: [UserDetailsComponent, getTranslocoTestingModule()],
      providers: [
        provideNoopAnimations(),
        { provide: KpExporterService, useValue: kpExporterServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: jest.fn(() => 'user-123') } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set userId from route and reload user data and enrollments', () => {
      const reloadUserDataSpy = jest.spyOn(component, 'reloadUserData').mockImplementation();
      const reloadEnrollmentsSpy = jest.spyOn(component, 'reloadUserEnrollments').mockImplementation();

      component.ngOnInit();

      expect(component.userId).toBe('user-123');
      expect(reloadUserDataSpy).toHaveBeenCalled();
      expect(reloadEnrollmentsSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe _filterDialogSub if it exists', () => {
      component['_filterDialogSub'] = { unsubscribe: jest.fn() } as any;
      const unsubscribeSpy = jest.spyOn(component['_filterDialogSub'], 'unsubscribe');

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should not throw when _filterDialogSub is undefined', () => {
      component['_filterDialogSub'] = undefined as any;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('onFilterChart', () => {
    it('should call reloadUserData with the provided filter', () => {
      const reloadSpy = jest.spyOn(component, 'reloadUserData').mockImplementation();
      const filter: AnalyticsApiFilter = { start_date: '2024-01-01', end_date: '2024-12-31' };

      component.onFilterChart(filter);

      expect(reloadSpy).toHaveBeenCalledWith(filter);
    });
  });

  describe('reloadUserData', () => {
    it('should call fetchUserData with userId and empty params when no filter given', () => {
      userDetailsServiceMock.fetchUserData.mockClear();
      component.userId = 'user-123';

      component.reloadUserData();

      expect(userDetailsServiceMock.fetchUserData).toHaveBeenCalledWith('user-123', {});
    });

    it('should call fetchUserData with userId and provided filter params', () => {
      userDetailsServiceMock.fetchUserData.mockClear();
      component.userId = 'user-123';
      const filter: AnalyticsApiFilter = { start_date: '2024-01-01' };

      component.reloadUserData(filter);

      expect(userDetailsServiceMock.fetchUserData).toHaveBeenCalledWith('user-123', filter);
    });
  });

  describe('onActivitiesFilterChanged', () => {
    it('should update activitiesFilter$ with the new value', () => {
      const spy = jest.spyOn(component.activitiesFilter$, 'next');

      component.onActivitiesFilterChanged({ value: component.FILTER_LAST_7_DAYS } as MatButtonToggleChange);

      expect(spy).toHaveBeenCalledWith(component.FILTER_LAST_7_DAYS);
    });
  });

  describe('applyFilter', () => {
    it('should reset pageIndex, set listSearchTerm and reload enrollments', () => {
      component.pageIndex = 3;
      const reloadSpy = jest.spyOn(component, 'reloadUserEnrollments').mockImplementation();

      component.applyFilter('test search');

      expect(component.pageIndex).toBe(0);
      expect(component.listSearchTerm).toBe('test search');
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should clear listSearchTerm when no argument is provided', () => {
      const reloadSpy = jest.spyOn(component, 'reloadUserEnrollments').mockImplementation();

      component.applyFilter();

      expect(component.listSearchTerm).toBeUndefined();
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('onPaging', () => {
    it('should update pageIndex and reload enrollments', () => {
      const reloadSpy = jest.spyOn(component, 'reloadUserEnrollments').mockImplementation();

      component.onPaging({ pageIndex: 5 } as PageEvent);

      expect(component.pageIndex).toBe(5);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('onDatatableSortChanged', () => {
    it('should update sort state, reset pageIndex and reload enrollments', () => {
      component.pageIndex = 4;
      component['sort'] = { active: 'course_name.sortable', direction: 'asc' } as any;
      const reloadSpy = jest.spyOn(component, 'reloadUserEnrollments').mockImplementation();

      component.onDatatableSortChanged();

      expect(component.pageIndex).toBe(0);
      expect(component['sortActive']).toBe('course_name.sortable');
      expect(component['sortDirection']).toBe('asc');
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('reloadUserEnrollments', () => {
    it('should call fetchUserEnrollments with default filters', () => {
      component.userId = 'user-123';
      userDetailsServiceMock.fetchUserEnrollments.mockClear();

      component.reloadUserEnrollments();

      expect(userDetailsServiceMock.fetchUserEnrollments).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({ page: 0, page_size: 10, search_term: '' }),
      );
    });

    it('should include search_term when listSearchTerm is set', () => {
      component.userId = 'user-123';
      component.listSearchTerm = 'maria';
      userDetailsServiceMock.fetchUserEnrollments.mockClear();

      component.reloadUserEnrollments();

      expect(userDetailsServiceMock.fetchUserEnrollments).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({ search_term: 'maria' }),
      );
    });

    it('should merge currentFilter from UserFilterService', () => {
      component.userId = 'user-123';
      userFilterServiceMock.getCurrentFilter.mockReturnValue({ leader: ['leader-1'] });
      userDetailsServiceMock.fetchUserEnrollments.mockClear();

      component.reloadUserEnrollments();

      expect(userDetailsServiceMock.fetchUserEnrollments).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({ leader: ['leader-1'] }),
      );
    });
  });

  describe('openFilters', () => {
    it('should call openFilters on userFilterService and reload enrollments on emission', () => {
      component.pageIndex = 3;
      const reloadSpy = jest.spyOn(component, 'reloadUserEnrollments').mockImplementation();

      component.openFilters();

      expect(userFilterServiceMock.openFilters).toHaveBeenCalledWith('details');
      expect(component.pageIndex).toBe(0);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('activitiesData$', () => {
    const mockStats = {
      courses_recent_activities: {
        last_30_days: { unique_courses: { value: 10 } },
        previous_30_days: { unique_courses: { value: 5 } },
        last_7_days: { unique_courses: { value: 3 } },
        previous_7_days: { unique_courses: { value: 4 } },
      },
      pulses_recent_activities: {
        last_30_days: { unique_pulses: { value: 8 } },
        previous_30_days: { unique_pulses: { value: 6 } },
        last_7_days: { unique_pulses: { value: 2 } },
        previous_7_days: { unique_pulses: { value: 3 } },
      },
    };

    it('should emit activity data based on last_30_days filter', async () => {
      userDetailsServiceMock.userStats$.next({ activities: mockStats });
      component.activitiesFilter$.next(component.FILTER_LAST_30_DAYS);

      const result = await firstValueFrom(component.activitiesData$);

      expect(result.missions.total).toBe(10);
      expect(result.missions.previous).toBe(5);
      expect(result.pulses.total).toBe(8);
      expect(result.pulses.previous).toBe(6);
    });

    it('should emit activity data based on last_7_days filter', async () => {
      userDetailsServiceMock.userStats$.next({ activities: mockStats });
      component.activitiesFilter$.next(component.FILTER_LAST_7_DAYS);

      const result = await firstValueFrom(component.activitiesData$);

      expect(result.missions.total).toBe(3);
      expect(result.missions.previous).toBe(4);
      expect(result.pulses.total).toBe(2);
      expect(result.pulses.previous).toBe(3);
    });

    it('should return zero values when stats are null', async () => {
      userDetailsServiceMock.userStats$.next(null);

      const result = await firstValueFrom(component.activitiesData$);

      expect(result.missions.total).toBe(0);
      expect(result.pulses.total).toBe(0);
    });

    it('should set variation dir to inc when current > previous', async () => {
      userDetailsServiceMock.userStats$.next({ activities: mockStats });
      component.activitiesFilter$.next(component.FILTER_LAST_30_DAYS);

      const result = await firstValueFrom(component.activitiesData$);

      expect(result.missions.variation.dir).toBe('inc');
    });

    it('should set variation dir to dec when current < previous', async () => {
      userDetailsServiceMock.userStats$.next({ activities: mockStats });
      component.activitiesFilter$.next(component.FILTER_LAST_7_DAYS);

      const result = await firstValueFrom(component.activitiesData$);

      expect(result.missions.variation.dir).toBe('dec');
    });

    it('should set variation dir to eq when both are zero', async () => {
      const zeroStats = {
        courses_recent_activities: {
          last_30_days: { unique_courses: { value: 0 } },
          previous_30_days: { unique_courses: { value: 0 } },
        },
        pulses_recent_activities: {
          last_30_days: { unique_pulses: { value: 0 } },
          previous_30_days: { unique_pulses: { value: 0 } },
        },
      };
      userDetailsServiceMock.userStats$.next({ activities: zeroStats });
      component.activitiesFilter$.next(component.FILTER_LAST_30_DAYS);

      const result = await firstValueFrom(component.activitiesData$);

      expect(result.missions.variation.dir).toBe('eq');
    });
  });

  describe('exportTable', () => {
    it('should call exportPDF with correct arguments', () => {
      component.exportTable('pdf');

      expect(kpExporterServiceMock.exportPDF).toHaveBeenCalledWith(
        '#userDetailsTable',
        'analytics-user-enrollments.pdf',
        [
          'USERS.DETAILS.DATATABLE.COLUMN.NAME',
          'USERS.DETAILS.DATATABLE.COLUMN.CATEGORY',
          'USERS.DETAILS.DATATABLE.COLUMN.START_DATE',
          'USERS.DETAILS.DATATABLE.COLUMN.COMPLETED_DATE',
          'USERS.DETAILS.DATATABLE.COLUMN.PERFORMANCE',
          'USERS.DETAILS.DATATABLE.COLUMN.QUIZZES',
        ],
      );
    });

    it('should call exportAsTabulatedData when format is csv', () => {
      const exportSpy = jest.spyOn(KpExporterService, 'exportAsTabulatedData').mockImplementation();

      component.exportTable('csv');

      expect(exportSpy).toHaveBeenCalledWith('analytics-user-enrollments', 'userDetailsTable');
    });
  });
});
