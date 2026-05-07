import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpDateRangeFilterComponent } from './kp-date-range-filter.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { enUS } from 'date-fns/locale';
import { KEEPS_DATE_FORMATS } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('KpDateRangeFilterComponent', () => {
  let component: KpDateRangeFilterComponent;
  let fixture: ComponentFixture<KpDateRangeFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpDateRangeFilterComponent],
      providers: [
        { provide: DateAdapter, useClass: DateFnsAdapter },
        { provide: MAT_DATE_LOCALE, useValue: enUS },
        { provide: MAT_DATE_FORMATS, useValue: KEEPS_DATE_FORMATS },
      ],
    });
    fixture = TestBed.createComponent(KpDateRangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.form).toBeDefined();
    expect(component).toBeTruthy();
  });

  it('should patch form', () => {
    const dateRange = { startDate: new Date('2024-02-01'), endDate: new Date('2024-02-25') };
    fixture.componentRef.setInput('currentDateRange', dateRange);
    expect(component.currentDateRange).toEqual(dateRange);
    expect(component.form.value).toEqual(dateRange);
  });

  describe('hasAppliedValue', () => {
    const cases = [
      [{ startDate: new Date('2024-02-01'), endDate: new Date('2024-02-25') }, true],
      [{ startDate: null, endDate: new Date('2024-02-25') }, false],
      [{ startDate: new Date('2024-02-01'), endDate: null }, false],
      [{ startDate: null, endDate: null }, false],
    ];

    test.each(cases)('for this case " %p " should return: %p', (dateRange, expectedValue) => {
      fixture.componentRef.setInput('currentDateRange', dateRange);
      expect(component.hasAppliedValue).toBe(expectedValue);
    });
  });

  it('should return formatted date', () => {
    const dateRange = { startDate: new Date('2024-02-01T00:00:00'), endDate: new Date('2024-02-25T00:00:00') };
    fixture.componentRef.setInput('currentDateRange', dateRange);
    expect(component.formattedAppliedDate).toBe('01/02/2024 - 25/02/2024');
  });

  it('should emit cleanDateRange event', () => {
    const event = new Event('');
    const eventSpy = jest.spyOn(event, 'stopPropagation');
    const emitSpy = jest.spyOn(component.cleanDateRange, 'emit');
    component.cleanFilter(event);
    expect(eventSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });
});
