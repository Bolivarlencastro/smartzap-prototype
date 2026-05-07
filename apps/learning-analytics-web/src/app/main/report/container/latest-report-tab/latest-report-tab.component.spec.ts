import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthService, ChatbotDialogData, UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LatestReportFilter } from '../../interfaces';
import { LatestReportActions } from '../../store/actions';
import { initialLatestReportState } from '../../store/reducers/latest-report.reducers';
import { LatestReportTabComponent } from './latest-report-tab.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { LatestReportService } from '../../services/latest-report.service';

const initialState = {
  reports: {
    latestReports: initialLatestReportState,
  },
};

const mockUserId = '123123';

describe('LatestReportTabComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let store: MockStore;
  let latestReportServiceMock: jest.Mocked<Pick<LatestReportService, 'updateFilter'>>;

  beforeEach(async () => {
    latestReportServiceMock = {
      updateFilter: jest.fn((filter: LatestReportFilter) => filter),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({ initialState }),
        provideDateFnsAdapter(),
        {
          provide: AuthService,
          useValue: { userId: mockUserId },
        },
        {
          provide: UserProfileService,
          useValue: { isAnalyticsLeader: jest.fn(() => false) },
        },
        {
          provide: LatestReportService,
          useValue: latestReportServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(hostComponent.tabComponent).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch refreshResult after the initial timer delay', fakeAsync(() => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      hostComponent.tabComponent.ngOnInit();
      tick(1000);

      expect(dispatchSpy).toHaveBeenCalledWith(LatestReportActions.refreshResult());
      hostComponent.tabComponent.ngOnDestroy();
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from the timer', () => {
      const unsubscribeSpy = jest.spyOn(hostComponent.tabComponent.timerSub$, 'unsubscribe');
      hostComponent.tabComponent.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('filterChange', () => {
    it('should update lastFilter and dispatch loadLatestReports', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const filter: LatestReportFilter = { page: 1, user_creator_name__ilike: 'test' };

      hostComponent.tabComponent.filterChange(filter);

      expect(latestReportServiceMock.updateFilter).toHaveBeenCalledWith(filter);
      expect(dispatchSpy).toHaveBeenCalledWith(LatestReportActions.loadLatestReports({ filter }));
    });

    it('should merge searchTerm into filter when applySearch was called before', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      latestReportServiceMock.updateFilter.mockImplementation((f) => f);

      hostComponent.tabComponent.applySearch('maria');
      dispatchSpy.mockClear();

      const filter: LatestReportFilter = { page: 1 };
      hostComponent.tabComponent.filterChange(filter);

      expect(latestReportServiceMock.updateFilter).toHaveBeenCalledWith(
        expect.objectContaining({ user_creator_name__ilike: 'maria' }),
      );
    });
  });

  describe('applySearch', () => {
    it('should set searchTerm and dispatch loadLatestReports with merged filter', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      hostComponent.tabComponent.applySearch('maria');

      expect(latestReportServiceMock.updateFilter).toHaveBeenCalledWith(
        expect.objectContaining({ user_creator_name__ilike: 'maria', page: 1 }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        LatestReportActions.loadLatestReports({
          filter: expect.objectContaining({ user_creator_name__ilike: 'maria' }),
        }),
      );
    });

    it('should not include user_creator_name__ilike when searchTerm is empty', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      hostComponent.tabComponent.applySearch('');

      expect(latestReportServiceMock.updateFilter).toHaveBeenCalledWith(
        expect.not.objectContaining({ user_creator_name__ilike: expect.anything() }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        LatestReportActions.loadLatestReports({
          filter: expect.not.objectContaining({ user_creator_name__ilike: expect.anything() }),
        }),
      );
    });
  });

  describe('loadMoreItems', () => {
    it('should dispatch loadMoreItemsReport action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      hostComponent.tabComponent.loadMoreItems();

      expect(dispatchSpy).toHaveBeenCalledWith(LatestReportActions.loadMoreItemsReport());
    });
  });

  describe('refreshResults', () => {
    it('should dispatch refreshResult action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      hostComponent.tabComponent.refreshResults();

      expect(dispatchSpy).toHaveBeenCalledWith(LatestReportActions.refreshResult());
    });
  });

  describe('openChatbotDialog', () => {
    it('should dispatch openChatbotDialog action with data', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const data = { reportId: 'report-1' } as unknown as ChatbotDialogData;

      hostComponent.tabComponent.openChatbotDialog(data);

      expect(dispatchSpy).toHaveBeenCalledWith(LatestReportActions.openChatbotDialog({ data }));
    });
  });

  describe('updateFilter integration', () => {
    it('should apply user_creator_id when updateFilter adds it (leader flow)', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const leaderFilter: LatestReportFilter = { page: 1, user_creator_id: mockUserId };
      latestReportServiceMock.updateFilter.mockReturnValue(leaderFilter);

      hostComponent.tabComponent.filterChange({ page: 1 });

      expect(dispatchSpy).toHaveBeenCalledWith(LatestReportActions.loadLatestReports({ filter: leaderFilter }));
    });
  });
});

// Needed because the infiniteScroll throws an error while looking for the container-3 element from the root
@Component({
  selector: 'app-host-component',
  template: '<div id="container-3"><app-latest-report-tab></app-latest-report-tab></div>',
  imports: [LatestReportTabComponent],
})
class TestHostComponent {
  @ViewChild(LatestReportTabComponent)
  tabComponent: LatestReportTabComponent;
}
