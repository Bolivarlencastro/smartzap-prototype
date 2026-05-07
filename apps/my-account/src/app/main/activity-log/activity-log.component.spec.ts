import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivityLogComponent } from './activity-log.component';
import { ActivityLogFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '@app/shared/util/transloco-testing.module';
import { ACTIVITY_LOG_FEATURE_NAME, activityLogInitialState } from './store/activity-log.feature';
import { ActivityLogActions } from './store';

describe('ActivityLogComponent', () => {
  let component: ActivityLogComponent;
  let fixture: ComponentFixture<ActivityLogComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLogComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [provideMockStore({ initialState: { [ACTIVITY_LOG_FEATURE_NAME]: activityLogInitialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch clearCache action on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(ActivityLogActions.resetState());
  });

  it('should dispatch filterByTerm action', () => {
    const search = 'test';
    component.filterByTerm(search);
    expect(store.dispatch).toHaveBeenCalledWith(ActivityLogActions.filterByTerm({ search }));
  });

  it('should dispatch setFilter action', () => {
    const filter: ActivityLogFilter = {
      createdDateGte: new Date(),
      createdDateLte: null,
      userId: 'u1',
      actionKey: null,
      status: 'PROCESSING',
    };
    component.onFilter(filter);
    expect(store.dispatch).toHaveBeenCalledWith(ActivityLogActions.setFilter({ filter }));
  });

  it('should dispatch exportLog action', () => {
    const id = 'log1';
    component.onExport(id);
    expect(store.dispatch).toHaveBeenCalledWith(ActivityLogActions.exportLog({ id }));
  });
});
