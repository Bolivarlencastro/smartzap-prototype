import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { ptBR } from 'date-fns/locale';
import { LatestReportFilter, ReportStatus } from '../../interfaces';
import { LatestReportsFilterComponent } from './latest-reports-filter.component';

const defaultStatuses: ReportStatus[] = [
  { name: 'DONE', active: false },
  { name: 'ERROR', active: false },
  { name: 'QUEUED', active: false },
  { name: 'PROCESSING', active: false },
  { name: 'TIMEOUT', active: false },
];

describe('LatestReportsFilterComponent', () => {
  let component: LatestReportsFilterComponent;
  let fixture: ComponentFixture<LatestReportsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestReportsFilterComponent, getTranslocoTestingModule()],
      providers: [provideDateFnsAdapter(), { provide: MAT_DATE_LOCALE, useValue: ptBR }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestReportsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit a filter event when the creatorName form control value is changed', fakeAsync(() => {
    jest.spyOn(component.filterChange, 'emit').mockImplementation(() => {});
    const filterName = 'test';
    component.filterForm.get('creatorName').setValue(filterName);
    tick(210); // We wait 200ms before firing the filter event

    const expectedFilter: LatestReportFilter = {
      user_creator_name__ilike: filterName,
      status__in: ['DONE', 'ERROR', 'QUEUED', 'PROCESSING', 'TIMEOUT'],
      page: 1,
    };
    expect(component.filterChange.emit).toHaveBeenCalledWith(expectedFilter);
  }));

  it('should emit the correct filter when the menu is closed', () => {
    jest.spyOn(component.filterChange, 'emit').mockImplementation(() => {});
    component.filterForm.setValue(
      {
        creatorName: 'test',
        startDate: new Date(2022, 6, 20),
        endDate: new Date(2022, 6, 28),
      },
      { emitEvent: false },
    );

    const expectedFilter: LatestReportFilter = {
      user_creator_name__ilike: 'test',
      created__gte: '2022-07-20',
      created__lte: '2022-07-28T23:59:59',
      status__in: ['DONE', 'ERROR', 'QUEUED', 'PROCESSING', 'TIMEOUT'],
      page: 1,
    };
    component.menuTrigger.openMenu();
    fixture.detectChanges();
    component.menuTrigger.closeMenu();
    fixture.detectChanges();
    expect(component.filterChange.emit).toHaveBeenCalledWith(expectedFilter);
  });

  it('should should reset the filter', () => {
    jest.spyOn(component.filterChange, 'emit').mockImplementation(() => {});
    component.resetFilter();

    const expectedFilter: LatestReportFilter = {
      status__in: ['DONE', 'ERROR', 'QUEUED', 'PROCESSING', 'TIMEOUT'],
      page: 1,
    };
    expect(component.filterChange.emit).toHaveBeenCalledWith(expectedFilter);
  });

  it('should create with the correct filter statuses', () => {
    expect(component.statuses).toEqual(defaultStatuses);
  });

  it('should toggle an active status', () => {
    // Deep cloning the status array to avoid effecting later tests
    const expectedResult = defaultStatuses.map((status) => ({ ...status }));
    expectedResult[0].active = true;

    component.statusChanged({ name: 'DONE' });
    expect(component.statuses).toEqual(expectedResult);
  });
});

describe('LatestReportsFilterComponent integration test', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(LatestReportsFilterComponent, { set: { styles: [] } });

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, getTranslocoTestingModule()],
      providers: [provideDateFnsAdapter(), { provide: MAT_DATE_LOCALE, useValue: ptBR }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not display the creator input when showCreatorInput is set to false', () => {
    component.showCreatorInput = false;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('[data-test="creator-input"]');
    expect(input).toBeFalsy();
  });
});

@Component({
  selector: 'app-host-component',
  template: '<latest-reports-filter [showCreatorInput]="showCreatorInput"></latest-reports-filter>',
  imports: [LatestReportsFilterComponent],
})
class TestHostComponent {
  showCreatorInput = true;
}
