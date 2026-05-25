import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PanelActions, PushHistoryActions, UpcomingAppointmentsActions, panelInitialState } from '../../store';
import { pushHistoryInitialState } from '../../store/features/push-history.feature';
import { upcomingAppointmentsInitialState } from '../../store/features/upcoming-appointments.feature';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { PanelComponent } from './panel.component';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({
          initialState: {
            'pm-panel': panelInitialState,
            pmUpcomingAppointments: upcomingAppointmentsInitialState,
            pmPushHistory: pushHistoryInitialState,
          },
        }),
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch load actions on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(PanelActions.loadSummary());
    expect(store.dispatch).toHaveBeenCalledWith(UpcomingAppointmentsActions.load());
    expect(store.dispatch).toHaveBeenCalledWith(PushHistoryActions.load());
  });

  it('should navigate to creation page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.goToCreation();
    expect(navigateSpy).toHaveBeenCalledWith(['/push-manager/creation']);
  });

  it('should dispatch cancelPush action', () => {
    const id = '123';
    component.onCancelPush(id);
    expect(store.dispatch).toHaveBeenCalledWith(UpcomingAppointmentsActions.cancelPush({ id }));
  });

  it('should dispatch appointments search action', () => {
    component.onAppointmentsSearch('query');
    expect(store.dispatch).toHaveBeenCalledWith(UpcomingAppointmentsActions.search({ search: 'query' }));
  });

  it('should dispatch appointments sort action with sortBy when direction is set', () => {
    component.onAppointmentsSort({ active: 'scheduled_at', direction: 'asc' });
    expect(store.dispatch).toHaveBeenCalledWith(UpcomingAppointmentsActions.sort({ sortBy: ['scheduled_at:asc'] }));
  });

  it('should dispatch appointments sort action with empty sortBy when direction is cleared', () => {
    component.onAppointmentsSort({ active: 'scheduled_at', direction: '' });
    expect(store.dispatch).toHaveBeenCalledWith(UpcomingAppointmentsActions.sort({ sortBy: [] }));
  });

  it('should dispatch appointments changePage action', () => {
    component.onAppointmentsPage({ pageIndex: 1, pageSize: 25, length: 100 });
    expect(store.dispatch).toHaveBeenCalledWith(UpcomingAppointmentsActions.changePage({ page: 2, limit: 25 }));
  });

  it('should dispatch history search action', () => {
    component.onHistorySearch('query');
    expect(store.dispatch).toHaveBeenCalledWith(PushHistoryActions.search({ search: 'query' }));
  });

  it('should dispatch history sort action with sortBy when direction is set', () => {
    component.onHistorySort({ active: 'completed_at', direction: 'desc' });
    expect(store.dispatch).toHaveBeenCalledWith(PushHistoryActions.sort({ sortBy: ['completed_at:desc'] }));
  });

  it('should dispatch history sort action with empty sortBy when direction is cleared', () => {
    component.onHistorySort({ active: 'completed_at', direction: '' });
    expect(store.dispatch).toHaveBeenCalledWith(PushHistoryActions.sort({ sortBy: [] }));
  });

  it('should dispatch history changePage action', () => {
    component.onHistoryPage({ pageIndex: 0, pageSize: 10, length: 50 });
    expect(store.dispatch).toHaveBeenCalledWith(PushHistoryActions.changePage({ page: 1, limit: 10 }));
  });
});
