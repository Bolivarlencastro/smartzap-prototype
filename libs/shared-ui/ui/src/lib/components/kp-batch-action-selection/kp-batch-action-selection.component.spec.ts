import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpBatchActionSelectionComponent } from './kp-batch-action-selection.component';

describe('KpBatchActionSelectionComponent', () => {
  let component: KpBatchActionSelectionComponent;
  let fixture: ComponentFixture<KpBatchActionSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpBatchActionSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpBatchActionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should build actions correctly', () => {
    fixture.componentRef.setInput('actions', [
      'APPROVE_ENROLLMENT',
      'REJECT_CERTIFICATE',
      'RESTART_ENROLLMENT',
      'RE_ENROLL_ENROLLMENT',
      'GOAL_DATE_ENROLLMENT',
      'DELETE_ENROLLMENT',
    ]);

    expect(component.buildedActions).toEqual([
      { id: 'APPROVE_ENROLLMENT', icon: 'check', iconClass: 's-5' },
      { id: 'REJECT_CERTIFICATE', icon: 'close', iconClass: 's-5' },
      { id: 'RESTART_ENROLLMENT', icon: 'fast_rewind', iconClass: 's-5' },
      { id: 'RE_ENROLL_ENROLLMENT', icon: 'autorenew', iconClass: 's-5' },
      { id: 'GOAL_DATE_ENROLLMENT', icon: 'today', iconClass: 's-5 filled' },
      { id: 'DELETE_ENROLLMENT', icon: 'delete', iconClass: 's-5' },
    ]);
  });

  it('should emit dispatch event', () => {
    const action = 'APPROVE_ENROLLMENT';
    const emitSpy = jest.spyOn(component.dispatch, 'emit');

    component.dispatchAction(action);

    expect(emitSpy).toHaveBeenCalledWith(action);
  });

  it('should emit clear event', () => {
    const emitSpy = jest.spyOn(component.clear, 'emit');

    component.clearSelection();

    expect(emitSpy).toHaveBeenCalled();
  });
});
