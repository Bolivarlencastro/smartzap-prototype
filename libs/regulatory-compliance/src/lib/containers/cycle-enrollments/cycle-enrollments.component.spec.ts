import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { EnrollmentCycleDto, KpExporterService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpExportFormat } from '@keeps-platform-frontend-workspace/ui/kp-export-menu';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';
import { CycleManagementSort } from '../../models';
import { CycleEnrollmentsActions, CycleEnrollmentsFilterActions } from '../../store/actions';
import { cycleEnrollmentsFeature, cycleEnrollmentsInitialState } from '../../store/features';
import { CycleEnrollmentsComponent } from './cycle-enrollments.component';

describe('CycleEnrollmentsComponent', () => {
  let component: CycleEnrollmentsComponent;
  let fixture: ComponentFixture<CycleEnrollmentsComponent>;
  let store: MockStore;
  let pdfExporterService: jest.Mocked<KpExporterService>;

  beforeEach(async () => {
    pdfExporterService = {
      exportPDF: jest.fn(),
    } as unknown as jest.Mocked<KpExporterService>;

    await TestBed.configureTestingModule({
      imports: [CycleEnrollmentsComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState: { [cycleEnrollmentsFeature.name]: cycleEnrollmentsInitialState } }),
        { provide: KpExporterService, useValue: pdfExporterService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CycleEnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should dispatch loadEnrollments on construction', () => {
      expect(store.dispatch).toHaveBeenCalledWith(CycleEnrollmentsActions.loadEnrollments());
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch reset', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(CycleEnrollmentsActions.reset());
    });
  });

  describe('searchEnrollments', () => {
    it('should dispatch searchEnrollments with the filter term', () => {
      component.searchEnrollments('mock_search');
      expect(store.dispatch).toHaveBeenCalledWith(CycleEnrollmentsActions.searchEnrollments({ filter: 'mock_search' }));
    });
  });

  describe('onPageChange', () => {
    it('should dispatch pageChange with page = pageIndex + 1', () => {
      const event: PageEvent = { pageIndex: 2, pageSize: 25, length: 100 };

      component.onPageChange(event);

      expect(store.dispatch).toHaveBeenCalledWith(
        CycleEnrollmentsActions.pageChange({ event: { page: 3, per_page: 25 } }),
      );
    });
  });

  describe('sortChange', () => {
    it('should dispatch sortEnrollments with the sort event', () => {
      const sort: CycleManagementSort = { order: 'asc', order_by: 'name' };

      component.sortChange(sort);

      expect(store.dispatch).toHaveBeenCalledWith(CycleEnrollmentsActions.sortEnrollments({ sort }));
    });
  });

  describe('renewCycle', () => {
    it('should dispatch renewCycle with the cycle', () => {
      const cycle = { id: 'cycle-1' } as EnrollmentCycleDto;

      component.renewCycle(cycle);

      expect(store.dispatch).toHaveBeenCalledWith(CycleEnrollmentsActions.renewCycle({ cycle }));
    });
  });

  describe('inactivateCycle', () => {
    it('should dispatch inactivateCycle with the cycle', () => {
      const cycle = { id: 'cycle-1' } as EnrollmentCycleDto;

      component.inactivateCycle(cycle);

      expect(store.dispatch).toHaveBeenCalledWith(CycleEnrollmentsActions.inactivateCycle({ cycle }));
    });
  });

  describe('openFilters', () => {
    it('should dispatch openFilterDialog', () => {
      component.openFilters();
      expect(store.dispatch).toHaveBeenCalledWith(CycleEnrollmentsFilterActions.openFilterDialog());
    });
  });

  describe('generateReport', () => {
    it('should dispatch generateReport', () => {
      component.generateReport();
      expect(store.dispatch).toHaveBeenCalledWith(CycleEnrollmentsActions.generateReport());
    });
  });

  describe('exportTable', () => {
    it('should call pdfExporterService.exportPDF when format is pdf', () => {
      component.exportTable('pdf' as KpExportFormat);

      expect(pdfExporterService.exportPDF).toHaveBeenCalledWith(
        '#cycle-enrollments-table',
        'cycle-enrollments.pdf',
        expect.any(Array),
      );
    });

    it('should call KpExporterService.exportAsTabulatedData when format is not pdf', () => {
      const exportSpy = jest.spyOn(KpExporterService, 'exportAsTabulatedData').mockImplementation(() => {});

      component.exportTable('xlsx' as KpExportFormat);

      expect(exportSpy).toHaveBeenCalledWith('cycle-enrollments', 'cycle-enrollments-table');
    });
  });
});
