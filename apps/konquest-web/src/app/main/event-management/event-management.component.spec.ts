import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EventManagementComponent } from './event-management.component';
import { EventManagementActions } from './store/actions';
import { eventManagementInitialState } from './store/features';

const initialState = { eventManagement: eventManagementInitialState };

describe('EventManagementComponent', () => {
  let component: EventManagementComponent;
  let fixture: ComponentFixture<EventManagementComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventManagementComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(EventManagementComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('eventId', '123');

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should dispatch init action with eventId', () => {
      expect(store.dispatch).toHaveBeenCalledWith(EventManagementActions.init({ eventId: '123' }));
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch reset action', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(EventManagementActions.reset());
    });
  });

  describe('onSearch', () => {
    it('should dispatch setFilter with the search term', () => {
      component.onSearch('my search');

      expect(store.dispatch).toHaveBeenCalledWith(
        EventManagementActions.setFilter({ filter: { search: 'my search' } }),
      );
    });
  });
});
