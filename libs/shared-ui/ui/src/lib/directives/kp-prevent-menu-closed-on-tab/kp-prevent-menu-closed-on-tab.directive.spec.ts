import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { KpPreventMenuClosedOnTabDirective } from './kp-prevent-menu-closed-on-tab.directive';

describe('KpPreventMenuClosedOnTabDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [KpPreventMenuClosedOnTabDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new KpPreventMenuClosedOnTabDirective();
    expect(directive).toBeTruthy();
  });

  describe('keyboardEvents', () => {
    it('should stop propagation on Tab key press', () => {
      const divElement = fixture.debugElement.query(By.directive(KpPreventMenuClosedOnTabDirective));
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

      divElement.nativeElement.dispatchEvent(event);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should not stop propagation on other key press', () => {
      const divElement = fixture.debugElement.query(By.directive(KpPreventMenuClosedOnTabDirective));
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

      divElement.nativeElement.dispatchEvent(event);

      expect(stopPropagationSpy).not.toHaveBeenCalled();
    });
  });
});

@Component({
  template: `
    <div kpPreventMenuClosedOnTab>
      <input type="text" />
    </div>
  `,
  standalone: false,
})
class TestComponent {}
