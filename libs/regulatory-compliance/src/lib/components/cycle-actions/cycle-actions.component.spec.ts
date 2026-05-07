import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CycleActionsComponent } from './cycle-actions.component';
import { EnrollmentCycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';

describe('CycleActionsComponent', () => {
  let component: CycleActionsComponent;
  let fixture: ComponentFixture<CycleActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleActionsComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(CycleActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit the renew event', () => {
    const emitSpy = jest.spyOn(component.renew, 'emit');

    component.onRenew();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit the inactivate event', () => {
    const emitSpy = jest.spyOn(component.inactivate, 'emit');

    component.onInactivate();

    expect(emitSpy).toHaveBeenCalled();
  });

  describe('getRenewDisabled', () => {
    it(`should return false if the cycle status is EXPIRED`, () => {
      fixture.componentRef.setInput('enrollment', {
        cycle: { id: 'mock_cycle_id' },
        status: 'EXPIRED',
      } as EnrollmentCycleDto);
      fixture.detectChanges();

      expect(component.renewDisabled).toBe(false);
    });

    it(`should return false if the enrollment status is DISABLED`, () => {
      fixture.componentRef.setInput('enrollment', {
        cycle: { id: 'mock_cycle_id' },
        status: 'DISABLED',
      } as EnrollmentCycleDto);
      fixture.detectChanges();

      expect(component.renewDisabled).toBe(false);
    });

    it(`should return true if the enrollment status is COMPLETED`, () => {
      fixture.componentRef.setInput('enrollment', {
        cycle: { id: 'mock_cycle_id' },
        status: 'COMPLETED',
      } as EnrollmentCycleDto);
      fixture.detectChanges();

      expect(component.renewDisabled).toBe(true);
    });

    it(`should return true if the enrollment cycle is undefined`, () => {
      fixture.componentRef.setInput('enrollment', { cycle: undefined } as EnrollmentCycleDto);
      fixture.detectChanges();

      expect(component.renewDisabled).toBe(true);
    });
  });

  describe('canRenew', () => {
    it('should return true if hasError is false', () => {
      fixture.componentRef.setInput('hasError', false);
      fixture.detectChanges();

      expect(component.canRenew).toBe(true);
    });
  });
});
