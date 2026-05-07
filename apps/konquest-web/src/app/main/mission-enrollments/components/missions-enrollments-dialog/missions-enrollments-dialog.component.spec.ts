import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { User } from '@core/model';
import { Enrollment } from '@core/model/enrollment.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReportService } from 'app/shared/services/report.service';
import { initialState } from '../../store/mission-enrollments.reducer';

import { MissionsEnrollmentsDialogComponent } from './missions-enrollments-dialog.component';
import { EnrollmentStatuses } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('MissionsEnrollmentsDialogComponent', () => {
  let component: MissionsEnrollmentsDialogComponent;
  let fixture: ComponentFixture<MissionsEnrollmentsDialogComponent>;
  let store: MockStore;

  const dataSource: Enrollment[] = [
    {
      approve_msg:
        '16/11/2021 - Gabriel Rodrigues dos Santos Mouta(67a1d5aa-5b29-4c5c-b717-2d50c348156f) aprovou o certificado',
      certificate_provider_url:
        'https://s3.amazonaws.com/keeps.reports/certificates_provider/e76b5082-f4fe-4f41-be79-1977840e16a8_gabriel_rodrigues_dos_santos_mouta_teste_novo.png',
      certificate_url: null,
      created_date: '2021-11-16T17:58:32.052687',
      end_date: '2021-11-22T00:00:00',
      enrolled_count: 1,
      give_up: false,
      give_up_comment: null,
      goal_date: '2021-11-17T14:58:00',
      id: '9298d8b8-f2d9-4165-8fe8-c55d5eefbab0',
      in_progress: false,
      mission: { name: 'Mission Name' },
      performance: 1,
      points: 1200,
      progress: 0,
      evaluated: false,
      required: false,
      start_date: '2021-11-16T17:58:32.052606',
      status: EnrollmentStatuses.COMPLETED,
      user: { name: 'Teste' } as User,
      updated_date: '2021-11-16T17:58:32.052694',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionsEnrollmentsDialogComponent, getTranslocoTestingModule()],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: dataSource },
        {
          provide: ReportService,
          useValue: { generateCourseCertificate: jest.fn(), openCertificate: jest.fn() },
        },
        { provide: MatSnackBar, useValue: { openFromComponent: jest.fn(), dismiss: jest.fn() } },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionsEnrollmentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and set the data source', () => {
    expect(component).toBeTruthy();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].id).toBe(dataSource[0].id);
  });

  it('should render table with given enrollments', () => {
    // given
    const missionName = fixture.debugElement.query(By.css('[data-test="mission-name"]')).nativeElement as HTMLElement;

    // expect
    expect(missionName.innerHTML).toBe(dataSource[0].mission.name);
  });

  it('should dispatch generateCourseCertificate', () => {
    // given
    const expectedId = dataSource[0].id;
    const storeDispatchSpy = jest.spyOn(store, 'dispatch');

    // when
    component.onGenerateCertificate(expectedId);

    // expect
    expect(storeDispatchSpy).toHaveBeenCalledWith({
      id: expectedId,
      type: '[MISSION ENROLLMENTS] Generate Certificate',
    } as any);
  });
});
