import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleEnrollmentsFilterComponent } from './cycle-enrollments-filter.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cycleEnrollmentsFilterFeature, cycleEnrollmentsFilterInitialState } from '../../store/features';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { CycleEnrollmentsFilterActions } from '../../store/actions';
import { CycleEnrollmentsFilterACType } from '../../models';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';

describe('CycleEnrollmentFilterComponent', () => {
  let component: CycleEnrollmentsFilterComponent;
  let fixture: ComponentFixture<CycleEnrollmentsFilterComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;
  let mockDialogRef: jest.Mocked<MatDialogRef<CycleEnrollmentsFilterComponent>>;
  let userProfileServiceMock: jest.Mocked<UserProfileService>;

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<CycleEnrollmentsFilterComponent>>;
    userProfileServiceMock = { isAdmin: jest.fn(() => true) } as unknown as jest.Mocked<UserProfileService>;

    TestBed.configureTestingModule({
      imports: [CycleEnrollmentsFilterComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore({
          initialState: { [cycleEnrollmentsFilterFeature.name]: cycleEnrollmentsFilterInitialState },
        }),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: UserProfileService, useValue: userProfileServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CycleEnrollmentsFilterComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  describe('onSearch', () => {
    const cases: CycleEnrollmentsFilterACType[] = ['learningObjects', 'users', 'leaders', 'normatives'];

    test.each(cases)(
      `should dispatch the ${CycleEnrollmentsFilterActions.autocompleteSearch.type} action for search type %p`,
      (searchType) => {
        component.onSearch('mock_search', searchType);

        expect(dispatchSpy).toHaveBeenCalledWith(
          CycleEnrollmentsFilterActions.autocompleteSearch({
            searchType,
            search: 'mock_search',
          }),
        );
      },
    );
  });

  describe('onFilter', () => {
    it('should close the dialog with the filter and formControl state', () => {
      component.onFilter();

      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });
});
