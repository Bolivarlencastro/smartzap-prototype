import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpSpeedDialComponent } from './kp-speed-dial.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('KpSpeedDialComponent', () => {
  let component: KpSpeedDialComponent;
  let fixture: ComponentFixture<KpSpeedDialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpSpeedDialComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(KpSpeedDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('focusLost', () => {
    it('should close the options panel when the next focus element is not a speed dial option', () => {
      const mockEvent = {
        relatedTarget: {
          classList: { contains: jest.fn().mockReturnValue(false) },
        } as any,
      } as FocusEvent;

      const closeSpy = jest.spyOn(component, 'close');

      component.focusLost(mockEvent);
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should not close the options panel when the next focus element is a speed dial option', () => {
      const mockEvent = {
        relatedTarget: {
          classList: { contains: jest.fn().mockReturnValue(true) },
        } as any,
      } as FocusEvent;

      const closeSpy = jest.spyOn(component, 'close');

      component.focusLost(mockEvent);
      expect(closeSpy).not.toHaveBeenCalled();
    });
  });
});
