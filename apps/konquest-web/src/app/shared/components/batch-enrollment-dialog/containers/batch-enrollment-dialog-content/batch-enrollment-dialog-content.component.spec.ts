import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatchEnrollmentDialogContentComponent } from './batch-enrollment-dialog-content.component';
import * as BatchEnrollmentActions from 'app/shared/components/batch-enrollment-dialog/store/batch-enrollment.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { batchEnrollmentFeature, batchEnrollmentsInitialState } from 'app/shared/components/batch-enrollment-dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('BatchEnrollmentDialogContentComponent', () => {
  let component: BatchEnrollmentDialogContentComponent;
  let fixture: ComponentFixture<BatchEnrollmentDialogContentComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchEnrollmentDialogContentComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [batchEnrollmentFeature.name]: batchEnrollmentsInitialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchEnrollmentDialogContentComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should dispatch filter action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onSearch('test');

    expect(dispatchSpy).toHaveBeenCalledWith(BatchEnrollmentActions.filterUsers({ filter: 'test' }));
  });

  describe('onSelectUser', () => {
    it('should dispatch toggleSelectUser action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onSelectUser('mock_id');

      expect(dispatchSpy).toHaveBeenCalledWith(BatchEnrollmentActions.toggleSelectUser({ id: 'mock_id' }));
    });
  });

  describe('onToggleAll', () => {
    it('should dispatch toggleSelectUser action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onToggleAll(true);

      expect(dispatchSpy).toHaveBeenCalledWith(BatchEnrollmentActions.toggleSelectAll({ selected: true }));
    });
  });

  describe('selectViaFile', () => {
    it('should dispatch parseUsers action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const mockFile = new File([''], 'test');

      component.selectViaFile(mockFile);

      expect(dispatchSpy).toHaveBeenCalledWith(BatchEnrollmentActions.parseUsers({ file: mockFile }));
    });
  });

  describe('loadMore', () => {
    it('should dispatch loadMoreUsers action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.loadMore();

      expect(dispatchSpy).toHaveBeenCalledWith(BatchEnrollmentActions.loadMoreUsers());
    });
  });
});
