import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpSidenavItemComponent } from './kp-sidenav-item.component';

describe('KpSidenavItemComponent', () => {
  let component: KpSidenavItemComponent;
  let fixture: ComponentFixture<KpSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpSidenavItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpSidenavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('toggle', () => {
    it('should change the active status and emit the active change event', () => {
      const emitSpy = jest.spyOn(component.activeChange, 'emit');

      component.toggle();

      expect(component.active()).toBe(true);
      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should not emit the active change if emitEvent is false', () => {
      const emitSpy = jest.spyOn(component.activeChange, 'emit');

      component.toggle(false);

      expect(component.active()).toBe(true);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not toggle the active state is the item is disabled', () => {
      const emitSpy = jest.spyOn(component.activeChange, 'emit');

      component.disabled.set(true);
      component.toggle();

      expect(component.active()).toBe(false);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
