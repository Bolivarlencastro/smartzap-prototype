import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpDatepickerMenuComponent } from './kp-datepicker-menu.component';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { DateFnsAdapter, DateFnsModule } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { enUS } from 'date-fns/locale';
import { KEEPS_DATE_FORMATS } from '@keeps-platform-frontend-workspace/kp-keeps';
import { isEqual } from 'date-fns';

describe('KpDatepickerMenuComponent', () => {
  let component: KpDatepickerMenuComponent;
  let fixture: ComponentFixture<KpDatepickerMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpDatepickerMenuComponent, getTranslocoTestingModule(), DateFnsModule],
      providers: [
        { provide: DateAdapter, useClass: DateFnsAdapter },
        { provide: MAT_DATE_LOCALE, useValue: enUS },
        { provide: MAT_DATE_FORMATS, useValue: KEEPS_DATE_FORMATS },
      ],
    });
    fixture = TestBed.createComponent(KpDatepickerMenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentDate', new Date());
    fixture.componentRef.setInput('opened', true);
    fixture.detectChanges();
  });

  it('should update the current date', () => {
    const expectedDate = new Date();
    component.onSelectedDateChange(expectedDate);
    expect(isEqual(expectedDate, component.selectedDate)).toBe(true);
  });

  describe('closeCalendar', () => {
    it('should emit closeCalendar event when to call the close method', () => {
      const emitSpy = jest.spyOn(component.closeCalendar, 'emit');

      component.close();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit closeCalendar event when to call the submit method with an invalid date', () => {
      const emitSpy = jest.spyOn(component.closeCalendar, 'emit');

      component.submit();

      expect(emitSpy).toHaveBeenCalledWith();
    });

    it('should emit closeCalendar event with the dateValue when a valid date is selected', () => {
      const emitSpy = jest.spyOn(component.closeCalendar, 'emit');
      const date = new Date();

      component.onSelectedDateChange(date);
      component.submit();

      expect(emitSpy).toHaveBeenCalledWith(date);
    });
  });
});
