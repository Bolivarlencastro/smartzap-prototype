import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import {
  EnrollmentCycleDto,
  KpExporterService,
  LEARNING_OBJECT_TYPE_ID,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';
import { CycleManagementSort } from '../../models';
import { CycleEnrollmentsListComponent } from './cycle-enrollments-list.component';

const MOCK_CYCLE: EnrollmentCycleDto = {
  id: 'c2716b17-21d3-46b0-9d84-727f5c6e421d',
  enrollment: {
    id: 'mock_enrollment_id',
    user: { id: 'mock_user_id', name: 'Luke Skywalker' },
    learningObject: {
      name: 'The ways of the Jedi',
      id: 'learning_object_id',
      learningObjectTypeId: LEARNING_OBJECT_TYPE_ID.MISSION,
    },
  },
  cyclesCount: 0,
  cycle: { id: 'mock_cycle_id', duration: 10, compliance: { id: 'mock_compliance_id', name: 'The Ways of the Jedi' } },
  deadline: '2023-09-01T20:37:25',
  status: 'IN_PROGRESS',
  createdDate: '2023-08-01T20:37:25',
};

describe('CycleEnrollmentsListComponent', () => {
  let component: CycleEnrollmentsListComponent;
  let fixture: ComponentFixture<CycleEnrollmentsListComponent>;
  let kpExporterServiceMock: jest.Mocked<KpExporterService>;

  beforeEach(async () => {
    kpExporterServiceMock = { exportPDF: jest.fn() } as unknown as jest.Mocked<KpExporterService>;

    await TestBed.configureTestingModule({
      imports: [CycleEnrollmentsListComponent, getTranslocoTestingModule()],
      providers: [{ provide: KpExporterService, useValue: kpExporterServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CycleEnrollmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the sortChange event', () => {
    const emitSpy = jest.spyOn(component.sortChange, 'emit');
    const expectedEvent: CycleManagementSort = { order: 'asc', order_by: 'name' };

    component.onSortChange({ direction: 'asc', active: 'name' } as Sort);

    expect(emitSpy).toHaveBeenCalledWith(expectedEvent);
  });

  it('should emit the renewCycle event', () => {
    const emitSpy = jest.spyOn(component.renewCycle, 'emit');
    const mockCycle: EnrollmentCycleDto = { ...MOCK_CYCLE };

    component.onRenewCycle(mockCycle);

    expect(emitSpy).toHaveBeenCalledWith(mockCycle);
  });

  it('should emit the inactivateCycle event', () => {
    const emitSpy = jest.spyOn(component.inactivateCycle, 'emit');
    const mockCycle: EnrollmentCycleDto = { ...MOCK_CYCLE };

    component.onInactivateCycle(mockCycle);

    expect(emitSpy).toHaveBeenCalledWith(mockCycle);
  });
});
