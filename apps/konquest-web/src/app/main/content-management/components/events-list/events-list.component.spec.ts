import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { LearnContentListItem } from '../../models/learn-content-list-item';
import { LEARN_CONTENT_LIST_ITEM_ACTION } from '../../models/learn-content-list-item-action';
import { EventsListComponent } from './events-list.component';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsListComponent, getTranslocoTestingModule()],
      providers: [{ provide: ActivatedRoute, useValue: null }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onItemAction', () => {
    const cases: any[] = [
      ['should emit itemAction event with remaining seats', 3, 1],
      ['should emit itemAction event without remaining seats', null, null],
    ];

    test.each(cases)('%s', (_, seats, expectedValue) => {
      const emitSpy = jest.spyOn(component.itemAction, 'emit');
      const action = LEARN_CONTENT_LIST_ITEM_ACTION.ENROLL_USERS;
      const item = { meta: { seats, enrolledCount: 2 } } as unknown as LearnContentListItem;

      component.onItemAction(action, item);

      expect(emitSpy).toHaveBeenCalledWith({ action, item, contentType: 'events', remainingSeats: expectedValue });
    });
  });

  describe('onViewDetails', () => {
    it('should emit itemAction event to view details', () => {
      const emitSpy = jest.spyOn(component.itemAction, 'emit');

      component.onViewDetails(null);

      expect(emitSpy).toHaveBeenCalledWith({
        action: LEARN_CONTENT_LIST_ITEM_ACTION.DETAILS,
        item: null,
        contentType: 'events',
      });
    });
  });
});
