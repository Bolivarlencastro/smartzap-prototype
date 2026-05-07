import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { defaultConfig, FuseConfigService } from '@keeps-platform-frontend-workspace/layout';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MissionEvaluationsComponent } from './evaluation.component';
import { EvaluationsFilterActions, MissionDetailActions } from '../store/actions';
import { MissionDetailSelectors } from '../store/selectors';
import { missionDetailInitialState } from '../store/reducers';

describe('MissionEvaluationsComponent', () => {
  let component: MissionEvaluationsComponent;
  let fixture: ComponentFixture<MissionEvaluationsComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionEvaluationsComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        FuseConfigService,
        { provide: defaultConfig, useValue: FuseConfigService },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { parent: { params: of({ id: 'mission-123' }) } },
        },
        provideMockStore({
          initialState: missionDetailInitialState,
          selectors: [
            { selector: MissionDetailSelectors.selectEvaluationSummary, value: {} },
            { selector: MissionDetailSelectors.selectEvaluations, value: { results: [], next: null } },
          ],
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(MissionEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture.destroy();
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should set missionId from route params', () => {
      expect(component.missionId).toBe('mission-123');
    });

    it('should dispatch loadEvaluationSummary with missionId from route', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(MissionDetailActions.loadEvaluationSummary({ id: 'mission-123' }));
    });

    it('should dispatch loadEvaluationQuestions on init', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(MissionDetailActions.loadEvaluationQuestions());
    });

    it('should dispatch loadEvaluations on init', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        MissionDetailActions.loadEvaluations({
          filters: { per_page: 5, page: 1, mission__id: 'mission-123' },
        }),
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch cleanCache', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnDestroy();

      expect(dispatchSpy).toHaveBeenCalledWith(MissionDetailActions.cleanCache());
    });
  });

  describe('navigateBack', () => {
    it('should navigate to course management page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      component.navigateBack();

      expect(navigateSpy).toHaveBeenCalledWith(['/management/courses']);
    });
  });

  describe('openFiltersModal', () => {
    it('should dispatch openFilterDialog with missionId', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.missionId = 'mission-123';

      component.openFiltersModal();

      expect(dispatchSpy).toHaveBeenCalledWith(EvaluationsFilterActions.openFilterDialog({ id: 'mission-123' }));
    });
  });

  describe('applyInputFilter', () => {
    it('should dispatch loadEvaluations with search term and reset page to 1', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.missionId = 'mission-123';
      component.evaluationPage = 3;

      component.applyInputFilter('test');

      expect(component.evaluationPage).toBe(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        MissionDetailActions.loadEvaluations({
          filters: { per_page: 5, page: 1, mission__id: 'mission-123', search: 'test' },
        }),
      );
    });
  });

  describe('onChangePage', () => {
    it('should update pagination state and dispatch loadEvaluations', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const paginator = { pageSize: 10, pageIndex: 2 } as PageEvent;
      component.missionId = 'mission-123';

      component.onChangePage(paginator);

      expect(component.evaluationPerPage).toBe(10);
      expect(component.evaluationPage).toBe(3);
      expect(dispatchSpy).toHaveBeenCalledWith(
        MissionDetailActions.loadEvaluations({
          filters: { per_page: 10, page: 3, mission__id: 'mission-123' },
        }),
      );
    });
  });

  describe('getCountByPoint', () => {
    it('should return the count for a given index', () => {
      const summary = { count_by_point: { 1: 5, 2: 10, 3: 3 } } as any;
      expect(component.getCountByPoint(summary, 2)).toBe(10);
    });

    it('should return 0 when summary is undefined', () => {
      expect(component.getCountByPoint(undefined, 1)).toBe(0);
    });

    it('should return 0 when index is not in count_by_point', () => {
      const summary = { count_by_point: {} } as any;
      expect(component.getCountByPoint(summary, 99)).toBe(0);
    });
  });
});
