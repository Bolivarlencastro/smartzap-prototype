import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LearnContentActions } from '@app/shared/store';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { LearnContentActionData } from '@keeps-platform-frontend-workspace/ui/models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EventsActions } from '../../store/actions';
import { eventsInitialState } from '../../store/features';
import { EventsComponent } from './events.component';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventsComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      providers: [provideMockStore({ initialState: { ['events']: eventsInitialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch loadMoreEvents action', () => {
    component.onScroll();
    expect(store.dispatch).toHaveBeenCalledWith(EventsActions.loadMoreEvents());
  });

  it('should dispatch learnContentAction action', () => {
    const learnContentAction: LearnContentActionData = {
      learnContent: null,
      contentType: 'mission',
      action: 'share',
    };
    component.onLearnContentAction(learnContentAction);
    expect(store.dispatch).toHaveBeenCalledWith(LearnContentActions.learnContentAction({ learnContentAction }));
  });
});
