import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../../transloco-testing.module';
import { LedOverviewAlertStatusComponent } from './led-overview-alert-status.component';
import { LedOverviewTabModel } from '../../../models/led-overview-tab';

const dataMock: LedOverviewTabModel = {
  id: '1',
  overdue_training: 0,
  due_soon_training: 0,
  last_activity: 1,
  completed_enrollments: 10,
  total_enrollments: 20,
  completion_rate: 0.5,
  ranking_points: 100,
  ranking_position: 1,
  chart: null,
};

describe('LedOverviewAlertStatusComponent', () => {
  let component: LedOverviewAlertStatusComponent;
  let fixture: ComponentFixture<LedOverviewAlertStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedOverviewAlertStatusComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LedOverviewAlertStatusComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', dataMock);
    fixture.detectChanges();
  });

  describe('alertStatusType()', () => {
    const cases = [
      {
        description: 'when overdue_training is greater than 0',
        data: {
          ...dataMock,
          overdue_training: 3,
          due_soon_training: 0,
        },
        expected: 'overdue',
      },
      {
        description: 'when overdue_training is 0 but due_soon_training is greater than 0',
        data: {
          ...dataMock,
          overdue_training: 0,
          due_soon_training: 5,
        },
        expected: 'due-soon',
      },
      {
        description: 'when both overdue_training and due_soon_training are 0',
        data: {
          ...dataMock,
          overdue_training: 0,
          due_soon_training: 0,
        },
        expected: 'up-to-date',
      },
      {
        description: 'when overdue_training has priority over due_soon_training',
        data: {
          ...dataMock,
          overdue_training: 1,
          due_soon_training: 10,
        },
        expected: 'overdue',
      },
    ];

    test.each(cases)('should return correct status type for $description', ({ data, expected }) => {
      fixture.componentRef.setInput('data', data);
      expect(component.alertStatusType()).toBe(expected);
    });
  });

  describe('alertStatusData()', () => {
    const cases = [
      {
        description: 'when status is overdue',
        data: {
          ...dataMock,
          overdue_training: 2,
          due_soon_training: 0,
        },
        expected: {
          icon: 'error',
          color: 'rgb(220, 38, 38)',
          title: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TITLE.OVERDUE',
          trainingCountLabel: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TRAINING_COUNT.OVERDUE',
          trainingCountColor: 'rgb(153, 27, 27)',
        },
      },
      {
        description: 'when status is due-soon',
        data: {
          ...dataMock,
          overdue_training: 0,
          due_soon_training: 3,
        },
        expected: {
          icon: 'warning',
          color: 'rgb(202, 138, 4)',
          title: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TITLE.DUE_SOON',
          trainingCountLabel: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TRAINING_COUNT.DUE_SOON',
          trainingCountColor: 'rgb(133, 77, 14)',
        },
      },
      {
        description: 'when status is up-to-date',
        data: {
          ...dataMock,
          overdue_training: 0,
          due_soon_training: 0,
        },
        expected: {
          icon: 'check_circle',
          color: 'rgb(22, 163, 74)',
          title: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TITLE.UP_TO_DATE',
          trainingCountLabel: 'LEADER_PANEL.LED.OVERVIEW.ALERT_STATUS.TRAINING_COUNT.UP_TO_DATE',
          trainingCountColor: 'rgb(22, 101, 52)',
        },
      },
    ];

    test.each(cases)('should return correct status data for $description', ({ data, expected }) => {
      fixture.componentRef.setInput('data', data);
      const result = component.alertStatusData();
      expect(result).toEqual(expected);
    });
  });

  describe('host binding', () => {
    test('should have correct class when status is overdue', () => {
      const testData = { ...dataMock, overdue_training: 1 };
      fixture.componentRef.setInput('data', testData);
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.classList.contains('overdue')).toBe(true);
      expect(hostElement.classList.contains('due-soon')).toBe(false);
      expect(hostElement.classList.contains('up-to-date')).toBe(false);
    });

    test('should have correct class when status is due-soon', () => {
      const testData = { ...dataMock, overdue_training: 0, due_soon_training: 1 };
      fixture.componentRef.setInput('data', testData);
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.classList.contains('overdue')).toBe(false);
      expect(hostElement.classList.contains('due-soon')).toBe(true);
      expect(hostElement.classList.contains('up-to-date')).toBe(false);
    });

    test('should have correct class when status is up-to-date', () => {
      const testData = { ...dataMock, overdue_training: 0, due_soon_training: 0 };
      fixture.componentRef.setInput('data', testData);
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.classList.contains('overdue')).toBe(false);
      expect(hostElement.classList.contains('due-soon')).toBe(false);
      expect(hostElement.classList.contains('up-to-date')).toBe(true);
    });
  });
});
