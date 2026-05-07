import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollmentFilterComponent } from './enrollment-filter.component';
import { format } from 'date-fns';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ptBR } from 'date-fns/locale';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';

describe('EnrollmentFilterComponent', () => {
  let component: EnrollmentFilterComponent;
  let fixture: ComponentFixture<EnrollmentFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentFilterComponent, getTranslocoTestingModule()],
      providers: [{ provide: MAT_DATE_LOCALE, useValue: ptBR }, provideDateFnsAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.resetAllMocks();
  });

  describe('onSelectStatus', () => {
    it('should add chip to selected statuses when it is selected', () => {
      const chip = {
        selected: false,
        status: 'CHIP',
      } as any;
      const control = component.form.get('status__in');
      jest.spyOn(control, 'setValue');

      component.onSelectStatus(chip);

      expect(control.setValue).toHaveBeenCalledWith([chip.status]);
    });

    it('should remove chip from selected statuses when it is not selected', () => {
      const chip = {
        selected: true,
        status: 'CHIP',
      } as any;
      const control = component.form.get('status__in');
      jest.spyOn(control, 'setValue');

      component.onSelectStatus(chip);

      expect(control.setValue).toHaveBeenCalledWith([]);
    });

    it('should call handleSubmit when a chip is toggled', () => {
      const chip = { selected: true, value: 'CHIP' } as any;
      jest.spyOn(component, 'handleSubmit');
      component.onSelectStatus(chip);
      expect(component.handleSubmit).toHaveBeenCalled();
    });
  });

  describe('handleClear', () => {
    it('should clear filter form', () => {
      jest.spyOn(component.form, 'patchValue');

      component.handleClear();

      expect(component.form.patchValue).toHaveBeenCalled();
    });

    it('should deselect chips', () => {
      component.availableStatuses[0].selected = false;

      component.handleClear();

      const isAllUnselected = component.availableStatuses.every((status) => !status.selected);

      expect(isAllUnselected).toBe(true);
    });
  });

  describe('handleSubmit', () => {
    it('should emit filter', () => {
      jest.spyOn(component.filter, 'emit');

      component.handleSubmit();

      expect(component.filter.emit).toHaveBeenCalled();
    });

    it('should parse selected statuses to string', () => {
      component.form.patchValue({ status__in: ['COMPLETED', 'WAITING'] });
      const expectedFilter = { status__in: 'COMPLETED,WAITING' };
      jest.spyOn(component.filter, 'emit');

      component.handleSubmit();

      expect(component.filter.emit).toHaveBeenCalledWith(expectedFilter);
    });

    it('should format start date to string', () => {
      const mockDate = new Date('2022-01-01');
      component.form.patchValue({ start_date__gte: mockDate });
      const expectedFilter = { start_date__gte: format(mockDate, 'yyyy-MM-dd') };
      jest.spyOn(component.filter, 'emit');

      component.handleSubmit();

      expect(component.filter.emit).toHaveBeenCalledWith(expectedFilter);
    });

    it('should format end date to string', () => {
      const mockDate = new Date('2022-01-31');
      component.form.patchValue({ end_date__lte: mockDate });
      const expectedFilter = { end_date__lte: format(mockDate, 'yyyy-MM-dd') };
      jest.spyOn(component.filter, 'emit');

      component.handleSubmit();

      expect(component.filter.emit).toHaveBeenCalledWith(expectedFilter);
    });

    it('should format performance min value', () => {
      const performanceMin = 20;
      component.form.patchValue({ performance__gte: performanceMin });
      const expectedFilter = { performance__gte: '0.2' };
      jest.spyOn(component.filter, 'emit');

      component.handleSubmit();

      expect(component.filter.emit).toHaveBeenCalledWith(expectedFilter);
    });

    it('should format performance max value', () => {
      const performanceMax = 95;
      component.form.patchValue({ performance__lte: performanceMax });
      const expectedFilter = { performance__lte: '0.95' };
      jest.spyOn(component.filter, 'emit');

      component.handleSubmit();

      expect(component.filter.emit).toHaveBeenCalledWith(expectedFilter);
    });

    it('should add search query to filter', () => {
      const searchQuery = 'search query';
      component.form.patchValue({ search: searchQuery });
      const expectedFilter = { search: searchQuery };
      jest.spyOn(component.filter, 'emit');

      component.handleSubmit();

      expect(component.filter.emit).toHaveBeenCalledWith(expectedFilter);
    });

    it('should not emit filter when form is invalid', () => {
      const invalidPerformanceMaxValue = 101;
      component.form.patchValue({ performance__lte: invalidPerformanceMaxValue });
      jest.spyOn(component.filter, 'emit');

      component.handleSubmit();

      expect(component.filter.emit).not.toHaveBeenCalled();
    });
  });
});
