import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { KonquestReportsTabComponent } from 'app/main/report/container';
import {
  pdfReports,
  xlsxMissionReports,
  xlsxPulsesReports,
  xlsxTrailReports,
  xlsxUserReports,
} from 'app/shared/model/konquest-reports';
import { of } from 'rxjs';
import { ReportType } from '../../enums/report';
import { ReportListType, ReportTopics } from '../../interfaces';
import { ReportActions, ReportFiltersActions } from '../../store/actions';
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('KonquestReportsTabComponent', () => {
  let component: KonquestReportsTabComponent;
  let fixture: ComponentFixture<KonquestReportsTabComponent>;
  let dialog: jest.Mocked<MatDialog>;
  let store: MockStore;

  beforeEach(async () => {
    const initialState = { reports: {} };

    await TestBed.configureTestingModule({
      imports: [KonquestReportsTabComponent, getTranslocoTestingModule(), MatIconTestingModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: MatDialog,
          useValue: { open: jest.fn().mockReturnValue({ afterClosed: jest.fn(() => of()) }) },
        },
        {
          provide: UserProfileService,
          useValue: { isAnalyticsLeader: jest.fn(() => false) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    dialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(KonquestReportsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with the correct reports topics', () => {
    const expectedTopics: ReportTopics = {
      users: xlsxUserReports,
      trails: xlsxTrailReports,
      missions: xlsxMissionReports,
      pulses: xlsxPulsesReports,
      pdf: pdfReports,
    };

    expect(component.reports).toEqual(expectedTopics);
  });

  it('should build the correct reports topics when the user is only a leader', () => {
    const expectedTopics: ReportTopics = {
      pdf: [{ reportType: ReportType.USER_OVERVIEW, icon: 'people_black' }],
      missions: [
        {
          reportType: ReportType.MISSION_ENROLLMENTS,
          icon: 'featured_play_list',
        },
      ],
      pulses: null,
      users: [
        {
          reportType: ReportType.USER_GENERAL_STATISTICS,
          icon: 'fingerprint',
        },
        {
          reportType: ReportType.USERS_GENERAL_CONSUMPTION,
          icon: 'contact-page',
        },
      ],
    };

    expect(KonquestReportsTabComponent.buildReportsTopics(true)).toEqual(expectedTopics);
  });

  describe('onSelectReport', () => {
    describe('openFilterDialog', () => {
      const cases: any[] = [
        [
          ReportType.USER_OVERVIEW,
          {
            reportType: ReportType.USER_OVERVIEW,
            title: 'REPORT.USER_OVERVIEW',
            subtitle: 'REPORTS.KONQUEST_TAB.FILTER_USERS_SUBTITLE',
            columnTitle: 'GENERAL.USER',
            selectionLabel: 'REPORT_MODAL.SELECTION_LABEL.USER',
          },
        ],
        [
          ReportType.COURSE_OVERVIEW,
          {
            reportType: ReportType.COURSE_OVERVIEW,
            title: 'REPORT.COURSE_OVERVIEW',
            subtitle: 'REPORTS.KONQUEST_TAB.FILTER_MISSIONS_SUBTITLE',
            columnTitle: 'GENERAL.MISSION',
            selectionLabel: 'REPORT_MODAL.SELECTION_LABEL.MISSION',
          },
        ],
        [
          ReportType.MISSION_QUIZ,
          {
            reportType: ReportType.MISSION_QUIZ,
            title: 'REPORT.MISSION_QUIZ',
            subtitle: 'REPORTS.KONQUEST_TAB.MISSION_QUIZ_SUBTITLE',
            columnTitle: 'GENERAL.MISSION',
            selectionLabel: 'REPORT_MODAL.SELECTION_LABEL.MISSION',
          },
        ],
        [
          ReportType.PULSES_QUIZ,
          {
            reportType: ReportType.PULSES_QUIZ,
            title: 'REPORT.PULSES_QUIZ',
            subtitle: 'REPORTS.KONQUEST_TAB.PULSES_QUIZ_SUBTITLE',
            columnTitle: 'GENERAL.CHANNEL',
            selectionLabel: 'REPORT_MODAL.SELECTION_LABEL.CHANNEL',
          },
        ],
        [
          ReportType.MISSION_EVALUATIONS,
          {
            reportType: ReportType.MISSION_EVALUATIONS,
            title: 'REPORT.MISSION_EVALUATIONS',
            subtitle: 'REPORTS.KONQUEST_TAB.MISSION_EVALUATIONS_SUBTITLE',
            columnTitle: 'GENERAL.MISSION',
            selectionLabel: 'REPORT_MODAL.SELECTION_LABEL.MISSION',
          },
        ],
      ];

      test.each(cases)('should open ReportModalComponent for this report type: %p', (reportType, data) => {
        component.onSelectReport({ reportType } as ReportListType);
        expect(dialog.open).toHaveBeenCalledWith(ReportModalComponent, {
          width: '500px',
          autoFocus: false,
          data,
          disableClose: true,
        });
      });
    });

    describe('openReportFilterDialogV2', () => {
      const cases: any[] = [
        [ReportType.WORKSPACE_MISSION],
        [ReportType.MISSION_ENROLLMENTS],
        [ReportType.MISSION_ENROLLMENTS_QUIZZES],
        [ReportType.TRAIL_ENROLLMENTS],
        [ReportType.TRAIL_LIST],
        [ReportType.TRAIL_CONCLUSION_RATE],
        [ReportType.ALL_USERS],
        [ReportType.USERS_ACCESS],
      ];

      test.each(cases)('should dispatch openDialog action for this report type: %p', (reportType) => {
        component.onSelectReport({ reportType } as ReportListType);
        expect(store.dispatch).toHaveBeenCalledWith(ReportFiltersActions.openDialog({ reportType }));
      });
    });

    describe('getReport', () => {
      const cases: any[] = [
        [ReportType.GROUP_CHANNEL_USER],
        [ReportType.GROUP_MISSION_USER],
        [ReportType.MISSION_EVALUATION_ANALYSIS],
        [ReportType.PULSES_ACTIVITIES],
        [ReportType.PULSE_CHANNELS],
        [ReportType.SMARTZAP_COURSE_OVERVIEW],
        [ReportType.USERS_GENERAL_CONSUMPTION],
        [ReportType.USER_GENERAL_STATISTICS],
        [ReportType.USER_PERMISSIONS],
        [ReportType.WORKSPACE_OVERVIEW],
      ];

      test.each(cases)('should dispatch getReport action for this report type: %p', (reportType) => {
        component.onSelectReport({ reportType } as ReportListType);
        expect(store.dispatch).toHaveBeenCalledWith(ReportActions.getReport({ filter: { reportType } }));
      });
    });
  });
});
