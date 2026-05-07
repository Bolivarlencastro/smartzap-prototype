import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EMPTY, of } from 'rxjs';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { CourseOverviewComponent } from './course-overview.component';
import { CourseOverviewService } from './course-overview.service';
import { KpExporterService, KpExportFormat, AnalyticsApiFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpAnalyticsChartFilterComponent } from '@keeps-platform-frontend-workspace/ui/kp-analytics-chart-filter';
import { KpAnalyticsFunnelChartComponent } from '@keeps-platform-frontend-workspace/ui/kp-analytics-funnel-chart';
import { KpAnalyticsDonutChartComponent } from '@keeps-platform-frontend-workspace/ui/kp-analytics-donut-chart';
import { CourseTopFiveChartComponent } from 'app/main/course/components';
import { PageEvent } from '@angular/material/paginator';

describe('CourseOverviewComponent', () => {
  let component: CourseOverviewComponent;
  let fixture: ComponentFixture<CourseOverviewComponent>;
  let kpExporterServiceMock: jest.Mocked<KpExporterService>;
  let courseOverviewServiceMock: {
    courses$: ReturnType<typeof of>;
    total$: ReturnType<typeof of>;
    top5CourseCategories$: ReturnType<typeof of>;
    coursesContentTypes$: ReturnType<typeof of>;
    coursesResume$: ReturnType<typeof of>;
    coursesCompletedRatio$: ReturnType<typeof of>;
    coursesContentConsumed$: ReturnType<typeof of>;
    coursesRating$: ReturnType<typeof of>;
    coursesContentAvailable$: ReturnType<typeof of>;
    fetchCoursesList: jest.Mock;
    fetchCourseTotals: jest.Mock;
    fetchCoursesResume: jest.Mock;
    fetchCoursesRating: jest.Mock;
    fetchCoursesCompletedRatio: jest.Mock;
    fetchCoursesContentConsumed: jest.Mock;
    fetchCoursesContentAvailable: jest.Mock;
    fetchCoursesCategories: jest.Mock;
    fetchCoursesContentTypes: jest.Mock;
  };

  beforeEach(async () => {
    courseOverviewServiceMock = {
      courses$: of(EMPTY),
      total$: of(EMPTY),
      top5CourseCategories$: of(EMPTY),
      coursesContentTypes$: of(EMPTY),
      coursesResume$: of(EMPTY),
      coursesCompletedRatio$: of(EMPTY),
      coursesContentConsumed$: of(EMPTY),
      coursesRating$: of(EMPTY),
      coursesContentAvailable$: of(EMPTY),
      fetchCoursesList: jest.fn(),
      fetchCourseTotals: jest.fn(),
      fetchCoursesResume: jest.fn(),
      fetchCoursesRating: jest.fn(),
      fetchCoursesCompletedRatio: jest.fn(),
      fetchCoursesContentConsumed: jest.fn(),
      fetchCoursesContentAvailable: jest.fn(),
      fetchCoursesCategories: jest.fn(),
      fetchCoursesContentTypes: jest.fn(),
    };

    TestBed.overrideComponent(CourseOverviewComponent, {
      remove: {
        providers: [CourseOverviewService],
        imports: [
          KpAnalyticsChartFilterComponent,
          KpAnalyticsFunnelChartComponent,
          KpAnalyticsDonutChartComponent,
          CourseTopFiveChartComponent,
        ],
      },
      add: {
        providers: [{ provide: CourseOverviewService, useValue: courseOverviewServiceMock }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
    });

    kpExporterServiceMock = { exportPDF: jest.fn() } as unknown as jest.Mocked<KpExporterService>;
    await TestBed.configureTestingModule({
      imports: [CourseOverviewComponent, getTranslocoTestingModule(), MatIconTestingModule, NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: KpExporterService, useValue: kpExporterServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load charts and datatable on init', () => {
      courseOverviewServiceMock.fetchCourseTotals.mockClear();
      courseOverviewServiceMock.fetchCoursesList.mockClear();

      component.ngOnInit();

      expect(courseOverviewServiceMock.fetchCourseTotals).toHaveBeenCalled();
      expect(courseOverviewServiceMock.fetchCoursesList).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('should reset pageIndex, set searchTerm and reload datatable', () => {
      component.pageIndex = 3;
      courseOverviewServiceMock.fetchCoursesList.mockClear();

      component.applyFilter('angular');

      expect(component.pageIndex).toBe(0);
      expect(component.searchTerm).toBe('angular');
      expect(courseOverviewServiceMock.fetchCoursesList).toHaveBeenCalledWith(
        expect.objectContaining({ search_term: 'angular', page: 0 }),
      );
    });
  });

  describe('onPaging', () => {
    it('should update pageIndex and reload datatable', () => {
      courseOverviewServiceMock.fetchCoursesList.mockClear();
      const event = { pageIndex: 4 } as PageEvent;

      component.onPaging(event);

      expect(component.pageIndex).toBe(4);
      expect(courseOverviewServiceMock.fetchCoursesList).toHaveBeenCalledWith(expect.objectContaining({ page: 4 }));
    });
  });

  describe('onSort', () => {
    it('should reset pageIndex and reload datatable with updated sort', () => {
      component.pageIndex = 2;
      component['sort'] = { active: 'name.sortable', direction: 'desc' } as any;
      courseOverviewServiceMock.fetchCoursesList.mockClear();

      component.onSort();

      expect(component.pageIndex).toBe(0);
      expect(courseOverviewServiceMock.fetchCoursesList).toHaveBeenCalledWith(
        expect.objectContaining({ sort: '-name.sortable', page: 0 }),
      );
    });
  });

  describe('onFilterChart', () => {
    it('should reload all charts with the provided filter', () => {
      courseOverviewServiceMock.fetchCourseTotals.mockClear();
      courseOverviewServiceMock.fetchCoursesResume.mockClear();
      courseOverviewServiceMock.fetchCoursesRating.mockClear();
      courseOverviewServiceMock.fetchCoursesCompletedRatio.mockClear();
      courseOverviewServiceMock.fetchCoursesContentConsumed.mockClear();
      courseOverviewServiceMock.fetchCoursesContentAvailable.mockClear();
      courseOverviewServiceMock.fetchCoursesCategories.mockClear();
      courseOverviewServiceMock.fetchCoursesContentTypes.mockClear();

      const filter: AnalyticsApiFilter = { start_date: '2024-01-01', end_date: '2024-12-31' };
      component.onFilterChart(filter);

      expect(courseOverviewServiceMock.fetchCourseTotals).toHaveBeenCalledWith(filter);
      expect(courseOverviewServiceMock.fetchCoursesResume).toHaveBeenCalledWith(filter);
      expect(courseOverviewServiceMock.fetchCoursesRating).toHaveBeenCalledWith(filter);
      expect(courseOverviewServiceMock.fetchCoursesCompletedRatio).toHaveBeenCalledWith(filter);
      expect(courseOverviewServiceMock.fetchCoursesContentConsumed).toHaveBeenCalledWith(filter);
      expect(courseOverviewServiceMock.fetchCoursesContentAvailable).toHaveBeenCalledWith(filter);
      expect(courseOverviewServiceMock.fetchCoursesCategories).toHaveBeenCalledWith(filter);
      expect(courseOverviewServiceMock.fetchCoursesContentTypes).toHaveBeenCalledWith(filter);
    });
  });

  describe('onDatatableExport', () => {
    it('should export as pdf', () => {
      const expectedColumns = [
        'COURSE.OVERVIEW.DATATABLE.COLUMN.NAME',
        'COURSE.OVERVIEW.DATATABLE.COLUMN.CATEGORY',
        'COURSE.OVERVIEW.DATATABLE.COLUMN.ENROLLMENT',
        'COURSE.OVERVIEW.DATATABLE.COLUMN.ENROLLMENT_COMPLETED',
        'COURSE.OVERVIEW.DATATABLE.COLUMN.ENROLLMENT_RATIO',
        'COURSE.OVERVIEW.DATATABLE.COLUMN.RATING',
      ];

      component.onDatatableExport('pdf');

      expect(kpExporterServiceMock.exportPDF).toHaveBeenCalledWith(
        '#coursesOverviewTable',
        'analytics-course-list.pdf',
        expectedColumns,
      );
    });

    it('should export as csv', () => {
      const exportSpy = jest.spyOn(KpExporterService, 'exportAsTabulatedData').mockImplementation();

      component.onDatatableExport('csv' as KpExportFormat);

      expect(exportSpy).toHaveBeenCalledWith('analytics-course-list', 'coursesOverviewTable');
    });
  });
});
