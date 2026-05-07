import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevelopmentStatus } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LedEventItem } from '../../../models/led-event-item';
import { getTranslocoTestingModule } from '../../../transloco-testing.module';
import { LedEventItemComponent } from './led-event-item.component';

const itemMock: LedEventItem = {
  id: '1',
  name: 'Webinar: O Futuro do Trabalho',
  start_date: '2025-10-22T08:15:30.750-03:00',
  end_date: '2025-10-22T08:15:30.750-03:00',
  presence: true,
  development_status: DevelopmentStatus.CLOSED,
};

describe('LedEventItemComponent', () => {
  let component: LedEventItemComponent;
  let fixture: ComponentFixture<LedEventItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedEventItemComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LedEventItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', itemMock);
    fixture.detectChanges();
  });

  describe('presenceStatus()', () => {
    const cases = [
      {
        description: 'when presence is boolean true',
        item: {
          id: '1',
          name: 'Test Event',
          start_date: '2024-03-15T10:00:00',
          end_date: '2024-03-15T18:00:00',
          development_status: DevelopmentStatus.DONE,
          presence: true,
        } as LedEventItem,
        expected: {
          icon: 'check_circle',
          color: '#16a34a',
          labelKey: 'LEADER_PANEL.LED.EVENT.PRESENCE_STATUS.PRESENT',
        },
      },
      {
        description: 'when presence is boolean false',
        item: {
          id: '1',
          name: 'Test Event',
          start_date: '2024-03-15T10:00:00',
          end_date: '2024-03-15T18:00:00',
          development_status: DevelopmentStatus.DONE,
          presence: false,
        } as LedEventItem,
        expected: {
          icon: 'cancel',
          color: '#dc2626',
          labelKey: 'LEADER_PANEL.LED.EVENT.PRESENCE_STATUS.ABSENT',
        },
      },
      {
        description: 'when presence is null',
        item: {
          id: '1',
          name: 'Test Event',
          start_date: '2024-03-15T10:00:00',
          end_date: '2024-03-15T18:00:00',
          development_status: DevelopmentStatus.DONE,
          presence: null,
        } as LedEventItem,
        expected: {
          icon: 'event_seat',
          color: '#2563eb',
          labelKey: 'LEADER_PANEL.LED.EVENT.PRESENCE_STATUS.ENROLLED',
        },
      },
    ];

    test.each(cases)('should return correct status configuration for $description', ({ item, expected }) => {
      fixture.componentRef.setInput('item', item);
      expect(component.presenceStatus()).toEqual(expected);
    });
  });

  describe('eventStatus()', () => {
    const cases = [
      {
        description: 'when development_status is CLOSED',
        item: {
          id: '1',
          name: 'Test Event',
          start_date: '2024-03-15T10:00:00',
          end_date: '2024-03-15T18:00:00',
          development_status: DevelopmentStatus.CLOSED,
          presence: true,
        } as LedEventItem,
        expected: 'LEADER_PANEL.LED.EVENT.EVENT_STATUS.CLOSED',
      },
      {
        description: 'when development_status is DONE',
        item: {
          id: '1',
          name: 'Test Event',
          start_date: '2024-03-15T10:00:00',
          end_date: '2024-03-15T18:00:00',
          development_status: DevelopmentStatus.DONE,
          presence: true,
        } as LedEventItem,
        expected: 'LEADER_PANEL.LED.EVENT.EVENT_STATUS.SCHEDULED',
      },
    ];

    test.each(cases)('should return correct translation key for $description', ({ item, expected }) => {
      fixture.componentRef.setInput('item', item);
      expect(component.eventStatus()).toBe(expected);
    });
  });
});
