import { SelectionModel } from '@angular/cdk/collections';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MissionEnrollmentAttendance } from '@app/main/mission/mission.model';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { BatchAction } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EventManagementUserActions } from '../../store/actions';
import { eventManagementInitialState } from '../../store/features';
import { EventManagementListComponent } from './event-management-list.component';

describe('EventManagementListComponent', () => {
  let component: EventManagementListComponent;
  let fixture: ComponentFixture<EventManagementListComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventManagementListComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: eventManagementInitialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(EventManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('User Actions', () => {
    it('should dispatch addNote action when onAddNote is called', () => {
      const user = { id: '1', observation: 'Test note' } as MissionEnrollmentAttendance;

      component.onAddNote(user);

      expect(store.dispatch).toHaveBeenCalledWith(
        EventManagementUserActions.addNote({
          presenceId: '1',
          observation: 'Test note',
        }),
      );
    });

    it('should dispatch togglePresence action when onTogglePresence is called', () => {
      const mockEvent = { checked: true } as MatSlideToggleChange;
      const presenceId = '1';

      component.onTogglePresence(mockEvent, presenceId);

      expect(store.dispatch).toHaveBeenCalledWith(
        EventManagementUserActions.togglePresence({
          checked: true,
          presenceId: '1',
        }),
      );
    });

    it('should dispatch sendInvite action when onSendInvite is called', () => {
      const user = { enrollment: { id: '1123' } } as MissionEnrollmentAttendance;

      component.onSendInvite(user);

      expect(store.dispatch).toHaveBeenCalledWith(
        EventManagementUserActions.sendInvite({
          enrollmentId: ['1123'],
        }),
      );
    });

    it('should dispatch removeUser action when onRemoveUser is called', () => {
      const user = { enrollment: { id: '1123' } } as MissionEnrollmentAttendance;

      component.onRemoveUser(user);

      expect(store.dispatch).toHaveBeenCalledWith(
        EventManagementUserActions.removeUser({
          enrollmentId: '1123',
        }),
      );
    });
  });

  describe('Batch Actions', () => {
    beforeEach(() => {
      const selectedItems = [
        { id: '1', enrollment: { id: '1123' } },
        { id: '2', enrollment: { id: '2123' } },
      ] as MissionEnrollmentAttendance[];

      const selectionModel = new SelectionModel<MissionEnrollmentAttendance>(true, selectedItems);
      component.selection.set(selectionModel);
    });

    it('should dispatch ADD_NOTE batch action', () => {
      const batchAction: BatchAction = 'ADD_NOTE';

      component.onDispatchBatchAction(batchAction);

      expect(store.dispatch).toHaveBeenCalledWith(
        EventManagementUserActions.addNote({
          presenceId: ['1', '2'],
          observation: null,
          batch: true,
        }),
      );
    });

    it('should dispatch SEND_INVITE batch action', () => {
      const batchAction: BatchAction = 'SEND_INVITE';

      component.onDispatchBatchAction(batchAction);

      expect(store.dispatch).toHaveBeenCalledWith(
        EventManagementUserActions.sendInvite({
          enrollmentId: ['1123', '2123'],
        }),
      );
    });

    it('should dispatch REMOVE_USER batch action', () => {
      const batchAction: BatchAction = 'REMOVE_USER';

      component.onDispatchBatchAction(batchAction);

      expect(store.dispatch).toHaveBeenCalledWith(
        EventManagementUserActions.removeUser({
          enrollmentId: ['1123', '2123'],
          batch: true,
        }),
      );
    });

    it('should dispatch MARK_AS_ABSENT batch action', () => {
      const batchAction: BatchAction = 'MARK_AS_ABSENT';

      component.onDispatchBatchAction(batchAction);

      expect(store.dispatch).toHaveBeenCalledWith(
        EventManagementUserActions.togglePresence({
          checked: false,
          presenceId: ['1', '2'],
          batch: true,
        }),
      );
    });

    it('should dispatch MARK_AS_PRESENT batch action', () => {
      const batchAction: BatchAction = 'MARK_AS_PRESENT';

      component.onDispatchBatchAction(batchAction);

      expect(store.dispatch).toHaveBeenCalledWith(
        EventManagementUserActions.togglePresence({
          checked: true,
          presenceId: ['1', '2'],
          batch: true,
        }),
      );
    });
  });

  describe('Selection Methods', () => {
    const mockItems = [{ id: '1' }, { id: '2' }, { id: '3' }] as MissionEnrollmentAttendance[];

    beforeEach(() => {
      const selectionModel = new SelectionModel<MissionEnrollmentAttendance>(true);
      component.selection.set(selectionModel);
    });

    it('should return true when all items are selected', () => {
      component.selection().select(...mockItems);

      const result = component.isAllSelected(mockItems);

      expect(result).toBe(true);
    });

    it('should return false when not all items are selected', () => {
      component.selection().select(mockItems[0]);

      const result = component.isAllSelected(mockItems);

      expect(result).toBe(false);
    });

    it('should toggle all rows when toggleAllRows is called', () => {
      const toggleSpy = jest.spyOn(component.selection(), 'select');
      const clearSpy = jest.spyOn(component.selection(), 'clear');

      component.toggleAllRows(mockItems);
      expect(toggleSpy).toHaveBeenCalledWith(...mockItems);

      component.selection().select(...mockItems);
      component.toggleAllRows(mockItems);
      expect(clearSpy).toHaveBeenCalled();
    });

    it('should toggle single row when toggleOneRow is called', () => {
      const item = mockItems[0];
      const toggleSpy = jest.spyOn(component.selection(), 'toggle');

      component.toggleOneRow(item);

      expect(toggleSpy).toHaveBeenCalledWith(item);
    });

    it('should clear selection when clearSelection is called', () => {
      const clearSpy = jest.spyOn(component.selection(), 'clear');

      component.clearSelection();

      expect(clearSpy).toHaveBeenCalled();
    });
  });
});
