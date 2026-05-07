import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EvaluationsFilterActions } from '../../store/actions';
import { evaluationsFilterInitialState } from '../../store/reducers/evaluations-filter.reducer';
import { EvaluationsFilterComponent } from './evaluations-filter.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('EvaluationsFilterComponent', () => {
  let component: EvaluationsFilterComponent;
  let fixture: ComponentFixture<EvaluationsFilterComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationsFilterComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { ['evaluations-filter']: evaluationsFilterInitialState } })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(EvaluationsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should dispatch event to open filters modal', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const id = '123';
    fixture.componentRef.setInput('missionId', id);
    fixture.detectChanges();

    component.openFiltersModal();
    expect(spy).toHaveBeenCalledWith(EvaluationsFilterActions.openFilterDialog({ id }));
  });

  it('should dispatch action to search term', () => {
    const emitSpy = jest.spyOn(component.applyInputFilter, 'emit');
    const term = 'test';
    fixture.detectChanges();

    component.searchTerm(term);
    expect(emitSpy).toHaveBeenCalledWith(term);
  });
});
