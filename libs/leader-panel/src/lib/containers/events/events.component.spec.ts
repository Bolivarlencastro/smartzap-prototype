import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsComponent } from './events.component';
import { provideMockStore } from '@ngrx/store/testing';
import { eventListInitialState, EVENTS_LIST_FEATURE_KEY } from '../../store/event';

jest.mock('@keeps-platform-frontend-workspace/ui/constants', () => ({
  constants: { defaultPageSizeOptions: [10, 25, 50, 100] },
}));

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [EVENTS_LIST_FEATURE_KEY]: eventListInitialState } })],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
