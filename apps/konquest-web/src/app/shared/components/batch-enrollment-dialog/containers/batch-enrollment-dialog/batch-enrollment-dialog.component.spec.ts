import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BatchEnrollmentDialogComponent } from './batch-enrollment-dialog.component';
import * as BatchEnrollmentActions from '../../store/batch-enrollment.actions';
import { batchEnrollmentFeature, batchEnrollmentsInitialState } from '../../store';
import { MatDialogRef } from '@angular/material/dialog';
import { EnrollmentConfig, EnrollmentType } from '@keeps-platform-frontend-workspace/ui/kp-enrollment-settings-form';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';

describe('BatchEnrollmentDialogComponent', () => {
  let component: BatchEnrollmentDialogComponent;
  let fixture: ComponentFixture<BatchEnrollmentDialogComponent>;
  let store: MockStore;
  let mockDialogRef: jest.Mocked<MatDialogRef<BatchEnrollmentDialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<BatchEnrollmentDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [BatchEnrollmentDialogComponent, getTranslocoTestingModule()],
      providers: [
        provideDateFnsAdapter(),
        provideMockStore({ initialState: { [batchEnrollmentFeature.name]: batchEnrollmentsInitialState } }),
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchEnrollmentDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      component.closeDialog();

      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('enrollOthers', () => {
    it('should dispatch backToEnrollList action when reset state is true', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.enrollOthers(true);

      expect(dispatchSpy).toHaveBeenCalledWith(BatchEnrollmentActions.backToEnrollList());
    });

    it('should dispatch changeViewMode action when reset state is false', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.enrollOthers(false);

      expect(dispatchSpy).toHaveBeenCalledWith(BatchEnrollmentActions.changeViewMode({ viewMode: 'list' }));
    });
  });

  describe('onEnroll', () => {
    it('should dispatch the batchEnrollment action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onEnroll();

      expect(dispatchSpy).toHaveBeenCalledWith(BatchEnrollmentActions.batchEnrollment());
    });
  });

  describe('onContinue', () => {
    it('should dispatch the changeViewMode action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onContinue();

      expect(dispatchSpy).toHaveBeenCalledWith(BatchEnrollmentActions.changeViewMode({ viewMode: 'resume' }));
    });
  });

  describe('setEnrollmentConfig', () => {
    it('should dispatch the setEnrollmentConfig action', () => {
      const mockEnrollmentConfig: EnrollmentConfig = { enrollmentType: EnrollmentType.REQUIRED, date: '2023-09-19' };
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.setEnrollmentConfig(mockEnrollmentConfig);

      expect(dispatchSpy).toHaveBeenCalledWith(
        BatchEnrollmentActions.setEnrollmentConfig({ config: mockEnrollmentConfig }),
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should dispatch the resetState action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnDestroy();

      expect(dispatchSpy).toHaveBeenCalledWith(BatchEnrollmentActions.resetState());
    });
  });
});
