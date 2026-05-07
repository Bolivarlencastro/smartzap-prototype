import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { QuickFilterType } from '@keeps-platform-frontend-workspace/ui/kp-filter';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LearningTrailFilter } from 'app/main/learning-trail/model/learning-trail';
import { LearningTrailListService } from 'app/main/learning-trail/services/learning-trail-list.service';
import { BehaviorSubject, EMPTY, of, Subject } from 'rxjs';
import { CollectionActions } from '../store/actions';
import { learningTrailsListFeatureKey, learningTrailsListInitialState } from '../store/reducers';
import { LearningTrailsListComponent } from './learning-trails-list.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('LearningTrailListComponent', () => {
  let component: LearningTrailsListComponent;
  let fixture: ComponentFixture<LearningTrailsListComponent>;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningTrailsListComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState: { [learningTrailsListFeatureKey]: learningTrailsListInitialState } }),
        {
          provide: LearningTrailListService,
          useValue: {
            isUserCreator$: of(true),
            filterActions$: of(EMPTY),
            loadLanguages: jest.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: new Subject(), params: new BehaviorSubject({ id: '123' }) },
        },
      ],
    }).compileComponents();

    const store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation();
    jest.spyOn(router, 'navigateByUrl').mockImplementation();
    fixture = TestBed.createComponent(LearningTrailsListComponent);
    component = fixture.componentInstance;
  });

  it(`should dispatch ${CollectionActions.fetchMoreLearningTrails.type} when onScroll is called`, () => {
    component.onScroll();

    expect(dispatchSpy).toHaveBeenCalledWith(CollectionActions.fetchMoreLearningTrails());
  });

  it(`should dispatch ${CollectionActions.filterLearningTrails.type} when onQuickFilter is called`, () => {
    const expectedQuickFilter = QuickFilterType.LEARNING_TRAILS;
    component.onQuickFilter(expectedQuickFilter);

    expect(dispatchSpy).toHaveBeenCalledWith(
      CollectionActions.filterLearningTrails({
        filter: {},
        newQuickFilterType: expectedQuickFilter,
      }),
    );
  });

  it(`should dispatch ${CollectionActions.filterLearningTrails.type} when onSaveFilter is called`, () => {
    const expectedFilter: LearningTrailFilter = { language: ['pt-BR'] };
    component.onSaveFilter({ languages: ['pt-BR'] });

    expect(dispatchSpy).toHaveBeenCalledWith(
      CollectionActions.filterLearningTrails({
        filter: expectedFilter,
      }),
    );
  });

  it(`should dispatch ${CollectionActions.filterLearningTrails.type} when onSearch is called`, () => {
    const expectedFilter: LearningTrailFilter = { search: 'test_trail' };
    component.onSearch('test_trail');

    expect(dispatchSpy).toHaveBeenCalledWith(
      CollectionActions.filterLearningTrails({
        filter: expectedFilter,
      }),
    );
  });
});
