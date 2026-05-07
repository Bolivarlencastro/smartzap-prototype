import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { AnalyticsApiFilter, KpExporterService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { UserFilterService } from '../services/user-filter.service';
import { UsersOverviewComponent } from './users-overview.component';
import { UsersOverviewService } from './users-overview.service';
import { AnalyticsDualColumnsChartComponent } from 'app/shared/components/analytics-dual-columns-chart/analytics-dual-columns-chart.component';
import { KpTopFiveChartComponent } from '@keeps-platform-frontend-workspace/ui/kp-top-five-chart';
import { KpAnalyticsDonutChartComponent } from '@keeps-platform-frontend-workspace/ui/kp-analytics-donut-chart';
import { PageEvent } from '@angular/material/paginator';

describe('UsersOverviewComponent', () => {
  let component: UsersOverviewComponent;
  let fixture: ComponentFixture<UsersOverviewComponent>;
  let kpExporterServiceMock: jest.Mocked<KpExporterService>;
  let usersOverviewServiceMock: {
    fetchAllForInterval: jest.Mock;
    fetchUsersList: jest.Mock;
    totalUsers$: ReturnType<typeof of>;
    activeUsers$: ReturnType<typeof of>;
    enrollmentsDistribution$: ReturnType<typeof of>;
    engagementRate$: ReturnType<typeof of>;
    contentConsumedAveragePerUser$: ReturnType<typeof of>;
    usersCreators$: ReturnType<typeof of>;
    activeUsersAveragePerDay$: ReturnType<typeof of>;
    topEnrollmentCategories$: ReturnType<typeof of>;
    topContentConsumed$: ReturnType<typeof of>;
    usersList$: ReturnType<typeof of>;
  };
  let userFilterServiceMock: {
    openFilters: jest.Mock;
    getCurrentFilter: jest.Mock;
  };

  beforeEach(async () => {
    usersOverviewServiceMock = {
      fetchAllForInterval: jest.fn(),
      fetchUsersList: jest.fn(),
      totalUsers$: of(EMPTY),
      activeUsers$: of(EMPTY),
      enrollmentsDistribution$: of(EMPTY),
      engagementRate$: of(EMPTY),
      contentConsumedAveragePerUser$: of(EMPTY),
      usersCreators$: of(EMPTY),
      activeUsersAveragePerDay$: of(EMPTY),
      topEnrollmentCategories$: of(EMPTY),
      topContentConsumed$: of(EMPTY),
      usersList$: of([]),
    };

    userFilterServiceMock = {
      openFilters: jest.fn(() => of({})),
      getCurrentFilter: jest.fn(() => ({})),
    };

    kpExporterServiceMock = { exportPDF: jest.fn() } as unknown as jest.Mocked<KpExporterService>;

    TestBed.overrideComponent(UsersOverviewComponent, {
      remove: {
        imports: [AnalyticsDualColumnsChartComponent, KpTopFiveChartComponent, KpAnalyticsDonutChartComponent],
        providers: [UserFilterService, UsersOverviewService],
      },
      add: {
        providers: [
          { provide: UserFilterService, useValue: userFilterServiceMock },
          { provide: UsersOverviewService, useValue: usersOverviewServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
    });

    await TestBed.configureTestingModule({
      imports: [UsersOverviewComponent, getTranslocoTestingModule()],
      providers: [{ provide: KpExporterService, useValue: kpExporterServiceMock }, provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load chart data and reload datatable on init', () => {
      usersOverviewServiceMock.fetchAllForInterval.mockClear();
      usersOverviewServiceMock.fetchUsersList.mockClear();

      component.ngOnInit();

      expect(usersOverviewServiceMock.fetchAllForInterval).toHaveBeenCalled();
      expect(usersOverviewServiceMock.fetchUsersList).toHaveBeenCalled();
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
    it('should call fetchAllForInterval with the provided filter', () => {
      usersOverviewServiceMock.fetchAllForInterval.mockClear();
      const filter: AnalyticsApiFilter = { start_date: '2024-01-01', end_date: '2024-12-31' };

      component.onFilterChart(filter);

      expect(usersOverviewServiceMock.fetchAllForInterval).toHaveBeenCalledWith(filter);
    });
  });

  describe('applyFilter', () => {
    it('should reset pageIndex, set listSearchTerm and reload datatable', () => {
      component.pageIndex = 3;
      usersOverviewServiceMock.fetchUsersList.mockClear();

      component.applyFilter('john');

      expect(component.pageIndex).toBe(0);
      expect(component.listSearchTerm).toBe('john');
      expect(usersOverviewServiceMock.fetchUsersList).toHaveBeenCalledWith(
        expect.objectContaining({ search_term: 'john', page: 0 }),
      );
    });

    it('should clear listSearchTerm when no argument is provided', () => {
      usersOverviewServiceMock.fetchUsersList.mockClear();

      component.applyFilter();

      expect(component.listSearchTerm).toBeUndefined();
      expect(usersOverviewServiceMock.fetchUsersList).toHaveBeenCalledWith(
        expect.objectContaining({ search_term: '' }),
      );
    });
  });

  describe('onPaging', () => {
    it('should update pageIndex and reload datatable', () => {
      usersOverviewServiceMock.fetchUsersList.mockClear();

      component.onPaging({ pageIndex: 4 } as PageEvent);

      expect(component.pageIndex).toBe(4);
      expect(usersOverviewServiceMock.fetchUsersList).toHaveBeenCalledWith(expect.objectContaining({ page: 4 }));
    });
  });

  describe('onDatatableSortChanged', () => {
    it('should update sort state, reset pageIndex and reload datatable', () => {
      component.pageIndex = 2;
      component['sort'] = { active: 'name.sortable', direction: 'desc' } as any;
      usersOverviewServiceMock.fetchUsersList.mockClear();

      component.onDatatableSortChanged();

      expect(component.pageIndex).toBe(0);
      expect(component['sortActive']).toBe('name.sortable');
      expect(component['sortDirection']).toBe('desc');
      expect(usersOverviewServiceMock.fetchUsersList).toHaveBeenCalledWith(
        expect.objectContaining({ sort: '-name.sortable', page: 0 }),
      );
    });

    it('should prefix sort with empty string for asc direction', () => {
      component['sort'] = { active: 'name.sortable', direction: 'asc' } as any;
      usersOverviewServiceMock.fetchUsersList.mockClear();

      component.onDatatableSortChanged();

      expect(usersOverviewServiceMock.fetchUsersList).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'name.sortable' }),
      );
    });
  });

  describe('openFilters', () => {
    it('should call openFilters on userFilterService with overview type and reload datatable on emission', () => {
      component.pageIndex = 3;
      usersOverviewServiceMock.fetchUsersList.mockClear();

      component.openFilters();

      expect(userFilterServiceMock.openFilters).toHaveBeenCalledWith('overview');
      expect(component.pageIndex).toBe(0);
      expect(usersOverviewServiceMock.fetchUsersList).toHaveBeenCalled();
    });
  });

  describe('reloadDatatable (via service calls)', () => {
    it('should merge getCurrentFilter result into datatable filters', () => {
      userFilterServiceMock.getCurrentFilter.mockReturnValue({ leader: ['leader-1'] });
      usersOverviewServiceMock.fetchUsersList.mockClear();

      component['reloadDatatable']();

      expect(usersOverviewServiceMock.fetchUsersList).toHaveBeenCalledWith(
        expect.objectContaining({ leader: ['leader-1'] }),
      );
    });

    it('should use default sort when sort ViewChild is not set', () => {
      component['sort'] = undefined as any;
      usersOverviewServiceMock.fetchUsersList.mockClear();

      component['reloadDatatable']();

      expect(usersOverviewServiceMock.fetchUsersList).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'name.sortable' }),
      );
    });
  });

  describe('exportTable', () => {
    it('should call exportPDF with correct arguments', () => {
      component.exportTable('pdf');

      expect(kpExporterServiceMock.exportPDF).toHaveBeenCalledWith('#usersOverviewTable', 'analytics-user-list.pdf', [
        'USERS.OVERVIEW.DATATABLE.COLUMN.NAME',
        'USERS.OVERVIEW.DATATABLE.COLUMN.LEADER',
        'USERS.OVERVIEW.DATATABLE.COLUMN.JOB',
        'USERS.OVERVIEW.DATATABLE.COLUMN.DIRECTOR',
        'USERS.OVERVIEW.DATATABLE.COLUMN.MANAGER',
        'USERS.OVERVIEW.DATATABLE.COLUMN.AREA',
        'USERS.OVERVIEW.DATATABLE.COLUMN.COURSES_COMPLETED',
        'USERS.OVERVIEW.DATATABLE.COLUMN.COMPLETED_RATIO',
      ]);
    });

    it('should call exportAsTabulatedData when format is csv', () => {
      const exportSpy = jest.spyOn(KpExporterService, 'exportAsTabulatedData').mockImplementation();

      component.exportTable('csv');

      expect(exportSpy).toHaveBeenCalledWith('analytics-user-list', 'usersOverviewTable');
    });
  });
});
