import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { UsersConsumptionFilterDialogComponent } from './users-consumption-filter-dialog.component';
import { KpFilterController } from '@keeps-platform-frontend-workspace/ui/kp-buildable-filter';

describe('UsersConsumptionFilterDialogComponent', () => {
  let component: UsersConsumptionFilterDialogComponent;
  let fixture: ComponentFixture<UsersConsumptionFilterDialogComponent>;
  let dialogRefMock: jest.Mocked<MatDialogRef<UsersConsumptionFilterDialogComponent>>;

  beforeEach(async () => {
    dialogRefMock = { close: jest.fn() } as unknown as jest.Mocked<MatDialogRef<UsersConsumptionFilterDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [UsersConsumptionFilterDialogComponent, getTranslocoTestingModule()],
      providers: [{ provide: MatDialogRef, useValue: dialogRefMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersConsumptionFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filterOptions', () => {
    it('should have 2 filter options', () => {
      expect(component['filterOptions']).toHaveLength(2);
    });

    describe('status filter', () => {
      it('should be of type selectMultiple with filterKey "status"', () => {
        const [statusFilter] = component['filterOptions'];
        expect(statusFilter.filterKey).toBe('status');
        expect(statusFilter.type).toBe('selectMultiple');
      });

      it('should have 5 enrollment status options with correct values', () => {
        const [statusFilter] = component['filterOptions'];
        expect(statusFilter.options?.map((o) => o.value)).toEqual([
          'COMPLETED',
          'STARTED',
          'REFUSED',
          'WAITING',
          'CANCELED',
        ]);
      });

      it('should have non-empty labels for all options', () => {
        const [statusFilter] = component['filterOptions'];
        statusFilter.options?.forEach((option) => {
          expect(option.label).toBeTruthy();
        });
      });
    });

    describe('concluded filter', () => {
      it('should be of type dateRange with filterKey "concluded"', () => {
        const [, concludedFilter] = component['filterOptions'];
        expect(concludedFilter.filterKey).toBe('concluded');
        expect(concludedFilter.type).toBe('dateRange');
      });

      it('should map to concluded_after and concluded_before API params', () => {
        const [, concludedFilter] = component['filterOptions'];
        expect(concludedFilter.rangeConfig).toEqual({
          fromKey: 'concluded_after',
          toKey: 'concluded_before',
        });
      });

      it('should allow less, more, and between range options', () => {
        const [, concludedFilter] = component['filterOptions'];
        expect(concludedFilter.rangeOptions).toEqual(['less', 'more', 'between']);
      });
    });
  });

  describe('onSubmit', () => {
    it('should close the dialog with the current form group values', () => {
      component.onSubmit();
      expect(dialogRefMock.close).toHaveBeenCalledWith(component['filterFormGroup'].getRawValue());
    });
  });

  describe('clearFilter', () => {
    it('should call resetSelection on the filter controller', () => {
      const resetSelectionSpy = jest.fn();
      component['filterController'] = { resetSelection: resetSelectionSpy } as unknown as KpFilterController;

      component.clearFilter();

      expect(resetSelectionSpy).toHaveBeenCalled();
    });
  });
});
