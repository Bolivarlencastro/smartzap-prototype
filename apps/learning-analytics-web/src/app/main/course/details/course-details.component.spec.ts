import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseDetailsComponent } from './course-details.component';
import { KpExporterService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { EMPTY, firstValueFrom, of } from 'rxjs';
import { CourseDetailsService } from './course-details.service';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { KpCourseDetailsChartsComponent } from '@keeps-platform-frontend-workspace/ui/kp-course-details-charts';
import { PageEvent } from '@angular/material/paginator';
import { Intervals } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CourseDetailsComponent', () => {
  let component: CourseDetailsComponent;
  let fixture: ComponentFixture<CourseDetailsComponent>;
  let kpExporterServiceMock: jest.Mocked<KpExporterService>;
  let courseDetailsServiceMock: {
    response$: ReturnType<typeof of>;
    courseData$: ReturnType<typeof of>;
    courseStats$: ReturnType<typeof of>;
    courseNps$: ReturnType<typeof of>;
    firstContentType$: ReturnType<typeof of>;
    rankContentTypes$: ReturnType<typeof of>;
    enrollmentDistribution$: ReturnType<typeof of>;
    enrollmentList$: ReturnType<typeof of>;
    fetchCourseData: jest.Mock;
    fetchCourseEnrollmentList: jest.Mock;
  };

  beforeEach(async () => {
    courseDetailsServiceMock = {
      response$: of(EMPTY),
      courseData$: of(EMPTY),
      courseStats$: of(EMPTY),
      courseNps$: of(EMPTY),
      firstContentType$: of(EMPTY),
      rankContentTypes$: of(EMPTY),
      enrollmentDistribution$: of(EMPTY),
      enrollmentList$: of(EMPTY),
      fetchCourseData: jest.fn(),
      fetchCourseEnrollmentList: jest.fn(),
    };

    TestBed.overrideComponent(CourseDetailsComponent, {
      remove: { providers: [CourseDetailsService], imports: [KpCourseDetailsChartsComponent] },
      add: {
        providers: [
          {
            provide: CourseDetailsService,
            useValue: courseDetailsServiceMock,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      },
    });

    kpExporterServiceMock = { exportPDF: jest.fn() } as unknown as jest.Mocked<KpExporterService>;
    await TestBed.configureTestingModule({
      imports: [CourseDetailsComponent, getTranslocoTestingModule()],
      providers: [
        provideRouter([]),
        {
          provide: KpExporterService,
          useValue: kpExporterServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call reloadCourseData and reloadEnrollmentsDatatable on init', () => {
      const reloadCourseDataSpy = jest.spyOn(component, 'reloadCourseData').mockImplementation();
      const reloadEnrollmentsSpy = jest.spyOn(component, 'reloadEnrollmentsDatatable').mockImplementation();

      component.ngOnInit();

      expect(reloadCourseDataSpy).toHaveBeenCalled();
      expect(reloadEnrollmentsSpy).toHaveBeenCalled();
    });
  });

  describe('reloadCourseData', () => {
    it('should call fetchCourseData with courseId', () => {
      component.courseId = 'course-abc';
      component.reloadCourseData();
      expect(courseDetailsServiceMock.fetchCourseData).toHaveBeenCalledWith('course-abc');
    });
  });

  describe('reloadEnrollmentsDatatable', () => {
    it('should call fetchCourseEnrollmentList with default filters', () => {
      component.courseId = 'course-abc';
      courseDetailsServiceMock.fetchCourseEnrollmentList.mockClear();

      component.reloadEnrollmentsDatatable();

      expect(courseDetailsServiceMock.fetchCourseEnrollmentList).toHaveBeenCalledWith(
        'course-abc',
        undefined,
        expect.objectContaining({ page: 0, page_size: 10, search_term: '' }),
      );
    });

    it('should include search_term in filters when listSearchTerm is set', () => {
      component.courseId = 'course-abc';
      component.listSearchTerm = 'maria';
      courseDetailsServiceMock.fetchCourseEnrollmentList.mockClear();

      component.reloadEnrollmentsDatatable();

      expect(courseDetailsServiceMock.fetchCourseEnrollmentList).toHaveBeenCalledWith(
        'course-abc',
        undefined,
        expect.objectContaining({ search_term: 'maria' }),
      );
    });

    it('should pass the listInterval to the service', () => {
      component.courseId = 'course-abc';
      component.listInterval = 'last_30_days' as Intervals;
      courseDetailsServiceMock.fetchCourseEnrollmentList.mockClear();

      component.reloadEnrollmentsDatatable();

      expect(courseDetailsServiceMock.fetchCourseEnrollmentList).toHaveBeenCalledWith(
        'course-abc',
        'last_30_days',
        expect.any(Object),
      );
    });
  });

  describe('onDatatableIntervalFilter', () => {
    it('should set listInterval, reset pageIndex and reload datatable', () => {
      component.pageIndex = 3;
      const reloadSpy = jest.spyOn(component, 'reloadEnrollmentsDatatable').mockImplementation();

      component.onDatatableIntervalFilter({ value: 'last_7_days' as Intervals });

      expect(component.listInterval).toBe('last_7_days');
      expect(component.pageIndex).toBe(0);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('should reset pageIndex, set search term and reload datatable', () => {
      component.pageIndex = 2;
      const reloadSpy = jest.spyOn(component, 'reloadEnrollmentsDatatable').mockImplementation();

      component.applyFilter('test search');

      expect(component.pageIndex).toBe(0);
      expect(component.listSearchTerm).toBe('test search');
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('onPaging', () => {
    it('should update pageIndex and reload datatable', () => {
      const reloadSpy = jest.spyOn(component, 'reloadEnrollmentsDatatable').mockImplementation();
      const event = { pageIndex: 5 } as PageEvent;

      component.onPaging(event);

      expect(component.pageIndex).toBe(5);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('onDatatableSortChanged', () => {
    it('should reset pageIndex and reload datatable', () => {
      component.pageIndex = 4;
      const reloadSpy = jest.spyOn(component, 'reloadEnrollmentsDatatable').mockImplementation();
      component['sort'] = { active: 'start_date', direction: 'asc' } as any;

      component.onDatatableSortChanged();

      expect(component.pageIndex).toBe(0);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('columnForm', () => {
    it('should initialize columnForm with all column definitions', () => {
      const controlKeys = Object.keys(component.columnForm.controls);
      const expectedDefs = component.columnDefinitions.map((c) => c.def);
      expect(controlKeys).toEqual(expectedDefs);
    });

    it('should disable fixed columns', () => {
      expect(component.columnForm.controls['user_name.sortable']?.disabled).toBe(true);
      expect(component.columnForm.controls['performance']?.disabled).toBe(true);
      expect(component.columnForm.controls['progress']?.disabled).toBe(true);
    });

    it('should enable non-fixed columns', () => {
      expect(component.columnForm.controls['start_date']?.disabled).toBe(false);
      expect(component.columnForm.controls['end_date']?.disabled).toBe(false);
    });

    it('listDisplayedColumns$ should emit all enabled columns initially', async () => {
      const columns = await firstValueFrom(component.listDisplayedColumns$);
      expect(columns).toContain('user_name.sortable');
      expect(columns).toContain('performance');
      expect(columns).toContain('progress');
    });

    it('listDisplayedColumns$ should exclude columns toggled off', async () => {
      component.columnForm.controls['start_date'].setValue(false);
      const columns = await firstValueFrom(component.listDisplayedColumns$);
      expect(columns).not.toContain('start_date');
    });
  });

  describe('onDatatableExport', () => {
    it('should export as pdf', () => {
      const expectedColumns = [
        'COURSE.CONTENTS.DATATABLE.COLUMN.NAME',
        'COURSE.CONTENTS.DATATABLE.COLUMN.START_DATE',
        'COURSE.CONTENTS.DATATABLE.COLUMN.END_DATE',
        'COURSE.CONTENTS.DATATABLE.COLUMN.PERFORMANCE',
        'COURSE.CONTENTS.DATATABLE.COLUMN.PROGRESS',
      ];
      const expectedTableId = '#course-details-table';
      const expectedFileName = 'analytics-course-enrollments.pdf';

      component.onDatatableExport('pdf');

      expect(kpExporterServiceMock.exportPDF).toHaveBeenCalledWith(expectedTableId, expectedFileName, expectedColumns);
    });

    it('should export as csv', () => {
      const expectedFileName = 'analytics-course-enrollments';
      const expectedTableId = 'course-details-table';
      const exportSpy = jest.spyOn(KpExporterService, 'exportAsTabulatedData').mockImplementation();

      component.onDatatableExport('csv');

      expect(exportSpy).toHaveBeenCalledWith(expectedFileName, expectedTableId);
    });
  });
});
