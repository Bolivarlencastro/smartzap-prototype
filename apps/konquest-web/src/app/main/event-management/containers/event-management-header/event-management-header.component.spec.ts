import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { EventManagementActions } from '../../store/actions';
import { EventManagementHeaderComponent } from './event-management-header.component';
import { DateRangePipe } from '../../pipes/date-range.pipe';

@Pipe({ name: 'dateRange' })
class MockDateRangePipe implements PipeTransform {
  transform(_value: any) {
    return '';
  }
}

describe('EventManagementHeaderComponent', () => {
  let component: EventManagementHeaderComponent;
  let fixture: ComponentFixture<EventManagementHeaderComponent>;
  let mockStore: jest.Mocked<Store>;
  let mockLocation: jest.Mocked<Location>;

  const mockViewModel = {
    event: {
      name: 'Test Event',
      users_enrolled: 100,
      mission_model: 'PRESENTIAL',
    },
    filterOptions: {
      dates: [
        { id: '1', start_date: '2024-01-01', end_date: '2024-01-02', count_users_attending: 50 },
        { id: '2', start_date: '2024-02-01', end_date: '2024-02-02', count_users_attending: 30 },
      ],
      present: ['all', 'present', 'absent'],
    },
    filter: {
      date_id: '1',
      search: '',
    },
  };

  beforeEach(async () => {
    mockStore = {
      dispatch: jest.fn(),
      select: jest.fn().mockReturnValue(of(mockViewModel)),
    } as unknown as jest.Mocked<Store>;

    mockLocation = {
      back: jest.fn(),
    } as unknown as jest.Mocked<Location>;

    TestBed.overrideComponent(EventManagementHeaderComponent, {
      remove: { imports: [DateRangePipe] },
      add: { imports: [MockDateRangePipe] },
    });

    await TestBed.configureTestingModule({
      imports: [EventManagementHeaderComponent, getTranslocoTestingModule()],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Location, useValue: mockLocation },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EventManagementHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call location.back() when go back button is clicked', () => {
    component.onGoBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should dispatch dispatchAction action when menu action is triggered', () => {
    const action = 'edit';
    component.onDispatchAction(action);

    expect(mockStore.dispatch).toHaveBeenCalledWith(EventManagementActions.dispatchAction({ action }));
  });
});
