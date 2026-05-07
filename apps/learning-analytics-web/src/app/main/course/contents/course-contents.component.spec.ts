import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseContentsComponent } from './course-contents.component';
import { KpExporterService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of } from 'rxjs';
import { CourseContentsService, CONTENT_TYPE } from './course-contents.service';
import { provideRouter } from '@angular/router';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';

describe('CourseContentsComponent', () => {
  let component: CourseContentsComponent;
  let fixture: ComponentFixture<CourseContentsComponent>;
  let kpExporterServiceMock: jest.Mocked<KpExporterService>;
  let courseContentsServiceMock: {
    response$: ReturnType<typeof of>;
    courseData$: ReturnType<typeof of>;
    contentList$: ReturnType<typeof of>;
    fetchCourseData: jest.Mock;
    fetchCourseContents: jest.Mock;
  };

  beforeEach(async () => {
    courseContentsServiceMock = {
      response$: of(EMPTY),
      courseData$: of(EMPTY),
      contentList$: of(EMPTY),
      fetchCourseData: jest.fn(),
      fetchCourseContents: jest.fn(),
    };

    TestBed.overrideComponent(CourseContentsComponent, {
      remove: { providers: [CourseContentsService] },
      add: {
        providers: [
          {
            provide: CourseContentsService,
            useValue: courseContentsServiceMock,
          },
        ],
      },
    });

    kpExporterServiceMock = { exportPDF: jest.fn() } as unknown as jest.Mocked<KpExporterService>;
    await TestBed.configureTestingModule({
      imports: [CourseContentsComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        provideRouter([]),
        {
          provide: KpExporterService,
          useValue: kpExporterServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch course data and contents on init when courseId is present', () => {
      jest.spyOn(component, 'reloadCourseData');
      jest.spyOn(component, 'reloadContentsDatatable');
      component.courseId = 'course-123';

      component.ngOnInit();

      expect(component.reloadCourseData).toHaveBeenCalled();
      expect(component.reloadContentsDatatable).toHaveBeenCalled();
    });
  });

  describe('reloadCourseData', () => {
    it('should call fetchCourseData when courseId is set', () => {
      component.courseId = 'course-123';
      component.reloadCourseData();
      expect(courseContentsServiceMock.fetchCourseData).toHaveBeenCalledWith('course-123');
    });

    it('should not call fetchCourseData when courseId is null', () => {
      component.courseId = null;
      courseContentsServiceMock.fetchCourseData.mockClear();
      component.reloadCourseData();
      expect(courseContentsServiceMock.fetchCourseData).not.toHaveBeenCalled();
    });
  });

  describe('reloadContentsDatatable', () => {
    it('should call fetchCourseContents with default filters', () => {
      component.courseId = 'course-123';
      courseContentsServiceMock.fetchCourseContents.mockClear();

      component.reloadContentsDatatable();

      expect(courseContentsServiceMock.fetchCourseContents).toHaveBeenCalledWith('course-123', {
        page: 0,
        page_size: 10,
      });
    });

    it('should include search_term in filters when listSearchTerm is set', () => {
      component.courseId = 'course-123';
      component.listSearchTerm = 'angular';
      courseContentsServiceMock.fetchCourseContents.mockClear();

      component.reloadContentsDatatable();

      expect(courseContentsServiceMock.fetchCourseContents).toHaveBeenCalledWith(
        'course-123',
        expect.objectContaining({ search_term: 'angular' }),
      );
    });

    it('should include type in filters when listTypeFilter is set', () => {
      component.courseId = 'course-123';
      component.listTypeFilter = { key: 'Video', id: 'video-id', name: 'Video' } as CONTENT_TYPE;
      courseContentsServiceMock.fetchCourseContents.mockClear();

      component.reloadContentsDatatable();

      expect(courseContentsServiceMock.fetchCourseContents).toHaveBeenCalledWith(
        'course-123',
        expect.objectContaining({ type: 'Video' }),
      );
    });

    it('should not call fetchCourseContents when courseId is null', () => {
      component.courseId = null;
      courseContentsServiceMock.fetchCourseContents.mockClear();

      component.reloadContentsDatatable();

      expect(courseContentsServiceMock.fetchCourseContents).not.toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('should reset pageIndex, set search term and reload datatable', () => {
      component.pageIndex = 3;
      const reloadSpy = jest.spyOn(component, 'reloadContentsDatatable').mockImplementation();

      component.applyFilter('test term');

      expect(component.pageIndex).toBe(0);
      expect(component.listSearchTerm).toBe('test term');
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('onDatatableTypeFilter', () => {
    it('should reset pageIndex, set type filter and reload datatable', () => {
      component.pageIndex = 2;
      const reloadSpy = jest.spyOn(component, 'reloadContentsDatatable').mockImplementation();
      const typeFilter = { key: 'PDF', id: 'pdf-id', name: 'PDF' } as CONTENT_TYPE;
      const change = { value: typeFilter } as MatSelectChange;

      component.onDatatableTypeFilter(change);

      expect(component.pageIndex).toBe(0);
      expect(component.listTypeFilter).toBe(typeFilter);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('onPaging', () => {
    it('should update pageIndex and reload datatable', () => {
      const reloadSpy = jest.spyOn(component, 'reloadContentsDatatable').mockImplementation();
      const event = { pageIndex: 4 } as PageEvent;

      component.onPaging(event);

      expect(component.pageIndex).toBe(4);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('onDatatableSortChanged', () => {
    it('should reset pageIndex and reload datatable', () => {
      component.pageIndex = 5;
      const reloadSpy = jest.spyOn(component, 'reloadContentsDatatable').mockImplementation();

      component.onDatatableSortChanged();

      expect(component.pageIndex).toBe(0);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('onDatatableExport', () => {
    it('should export as pdf', () => {
      const expectedColumns = [
        'COURSE.CONTENTS.DATATABLE.COLUMN.NAME',
        'COURSE.CONTENTS.DATATABLE.COLUMN.QUANTITY',
        'COURSE.CONTENTS.DATATABLE.COLUMN.VIEW_TIME',
        'COURSE.CONTENTS.DATATABLE.COLUMN.ENGAGEMENT',
      ];
      const expectedTableId = '#course-contents-table';
      const expectedFileName = 'analytics-course-contents.pdf';

      component.onDatatableExport('pdf');

      expect(kpExporterServiceMock.exportPDF).toHaveBeenCalledWith(expectedTableId, expectedFileName, expectedColumns);
    });

    it('should export as csv', () => {
      const expectedFileName = 'analytics-course-contents';
      const expectedTableId = 'course-contents-table';
      const exportSpy = jest.spyOn(KpExporterService, 'exportAsTabulatedData').mockImplementation();

      component.onDatatableExport('csv');

      expect(exportSpy).toHaveBeenCalledWith(expectedFileName, expectedTableId);
    });
  });
});
