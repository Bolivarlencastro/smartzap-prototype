import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { EnrollmentsFilterComponent } from 'app/main/settings/components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

describe('EnrollmentsFilterComponent', () => {
  let component: EnrollmentsFilterComponent;
  let fixture: ComponentFixture<EnrollmentsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentsFilterComponent, getTranslocoTestingModule()],
      providers: [{ provide: MAT_DATE_LOCALE, useValue: ptBR }, provideDateFnsAdapter()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterEvent with joined status__in when statuses are selected', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.filterEvent, 'emit');

    component['form'].patchValue({ status__in: ['COMPLETED', 'STARTED'] });
    tick(300);

    expect(emitSpy).toHaveBeenCalledWith({ status__in: 'COMPLETED,STARTED' });
  }));

  it('should emit empty filterEvent when no status is selected', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.filterEvent, 'emit');

    component['form'].patchValue({ status__in: [] });
    tick(300);

    expect(emitSpy).toHaveBeenCalledWith({});
  }));

  it('should patch initial filters on init', () => {
    fixture.componentRef.setInput('filters', {
      status__in: 'COMPLETED,WAITING',
      start_date__gte: '2026-04-01',
      end_date__lte: '2026-04-30',
      performance__gte: '0.2',
      performance__lte: '0.9',
    });
    component.ngOnInit();

    expect(component['form'].value.status__in).toEqual(['COMPLETED', 'WAITING']);
    expect(format(component['form'].value.start_date__gte, 'yyyy-MM-dd')).toBe('2026-04-01');
    expect(format(component['form'].value.end_date__lte, 'yyyy-MM-dd')).toBe('2026-04-30');
    expect(component['form'].value.performance__gte).toBe(20);
    expect(component['form'].value.performance__lte).toBe(90);
  });

  it('should emit date and performance filters serialized for the API', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.filterEvent, 'emit');
    const startDate = new Date('2026-04-10T00:00:00');
    const endDate = new Date('2026-04-20T00:00:00');

    component['form'].patchValue({
      start_date__gte: startDate,
      end_date__lte: endDate,
      performance__gte: 25,
      performance__lte: 80,
    });
    tick(300);

    expect(emitSpy).toHaveBeenCalledWith({
      start_date__gte: '2026-04-10',
      end_date__lte: '2026-04-20',
      performance__gte: '0.25',
      performance__lte: '0.8',
    });
  }));
});
