import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SmartZapReportsTabComponent } from 'app/main/report/container';
import { ReportType } from '../../enums/report';
import { ReportListType } from '../../interfaces';
import { ReportActions } from '../../store/actions';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

const initialState = {
  reports: {},
};

describe('SmartZapReportsTabComponent', () => {
  let component: SmartZapReportsTabComponent;
  let fixture: ComponentFixture<SmartZapReportsTabComponent>;
  let dialog: jest.Mocked<MatDialog>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartZapReportsTabComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [provideMockStore({ initialState }), { provide: MatDialog, useValue: { open: jest.fn() } }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    dialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartZapReportsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open the filter dialog', () => {
    const reportListType: ReportListType = { reportType: ReportType.SMARTZAP_COURSE_OVERVIEW, icon: '' };

    component.onSelectReport(reportListType);

    expect(dialog.open).toHaveBeenCalled();
  });

  it('should dispatch the getReport action', () => {
    const reportListType: ReportListType = { reportType: ReportType.USER_OVERVIEW, icon: '' };
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onSelectReport(reportListType);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ReportActions.getReport({ filter: { reportType: reportListType.reportType } }),
    );
  });
});
