import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { KpBatchActionSelectionCounterComponent } from './kp-batch-action-selection-counter.component';

describe('KpBatchActionSelectionCounterComponent', () => {
  let component: KpBatchActionSelectionCounterComponent;
  let fixture: ComponentFixture<KpBatchActionSelectionCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpBatchActionSelectionCounterComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(KpBatchActionSelectionCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit selectAll event', () => {
    const emitSpy = jest.spyOn(component.selectAll, 'emit');
    component.isAllSelected.set(false);

    component.selectAllRecords();

    expect(emitSpy).toHaveBeenCalled();
    expect(component.isAllSelected()).toBe(true);
  });

  it('should emit clear event', () => {
    const emitSpy = jest.spyOn(component.clear, 'emit');
    component.isAllSelected.set(true);

    component.clearSelection();

    expect(emitSpy).toHaveBeenCalled();
    expect(component.isAllSelected()).toBe(false);
  });
});
