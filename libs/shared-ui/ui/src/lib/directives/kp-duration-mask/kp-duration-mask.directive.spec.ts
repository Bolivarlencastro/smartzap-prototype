import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { KpDurationMaskDirective } from './kp-duration-mask.directive';

class ElementRefMock {
  nativeElement = {
    selectionStart: 0,
    setSelectionRange: (start: number, _: number) => {
      this.nativeElement.selectionStart = start;
    },
  };
}

describe('KpDurationMaskDirective', () => {
  describe('KpDurationMaskDirectiveUnit', () => {
    const rendererSpy = { setProperty: jest.fn() } as any;
    let elementRefMock: ElementRef<HTMLInputElement>;

    beforeEach(() => {
      elementRefMock = new ElementRefMock() as ElementRef<HTMLInputElement>;
    });

    it('should create an instance', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      expect(directive).toBeTruthy();
    });

    it('should select hours when interacted with and selectionStart is less than 2', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      const setSelectionSpy = jest.spyOn(elementRefMock.nativeElement, 'setSelectionRange');

      directive.onInteraction();

      expect(setSelectionSpy).toHaveBeenCalledWith(0, 2);
    });

    it('should select minutes when interacted with and selectionStart is greater than 2', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      elementRefMock.nativeElement.selectionStart = 3;
      const setSelectionSpy = jest.spyOn(elementRefMock.nativeElement, 'setSelectionRange');

      directive.onInteraction();

      expect(setSelectionSpy).toHaveBeenCalledWith(3, 5);
    });

    it('should prevent alphabetical keyboard events', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      const keyEvent = new KeyboardEvent('keydown', { key: 'a' });
      const preventDefaultSpy = jest.spyOn(keyEvent, 'preventDefault');

      directive.onKeyDown(keyEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should select hours when ArrowLeft is pressed', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      const setSelectionSpy = jest.spyOn(elementRefMock.nativeElement, 'setSelectionRange');
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });

      directive.onKeyDown(keyEvent);

      expect(setSelectionSpy).toHaveBeenCalledWith(0, 2);
    });

    it('should select minutes when ArrowRight is pressed', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      const setSelectionSpy = jest.spyOn(elementRefMock.nativeElement, 'setSelectionRange');
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });

      directive.onKeyDown(keyEvent);

      expect(setSelectionSpy).toHaveBeenCalledWith(3, 5);
    });

    it('should select minutes tab is pressed', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      const setSelectionSpy = jest.spyOn(elementRefMock.nativeElement, 'setSelectionRange');
      const keyEvent = new KeyboardEvent('keydown', { key: 'Tab' });

      directive.onKeyDown(keyEvent);

      expect(setSelectionSpy).toHaveBeenCalledTimes(1);
      expect(setSelectionSpy).toHaveBeenCalledWith(3, 5);
    });

    it('should select hours when minutes are selected and shift + tab is pressed', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      const setSelectionSpy = jest.spyOn(elementRefMock.nativeElement, 'setSelectionRange');
      elementRefMock.nativeElement.selectionStart = 2;
      directive.onInteraction();
      const keyEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });

      directive.onKeyDown(keyEvent);

      expect(setSelectionSpy).toHaveBeenCalledWith(0, 2);
    });

    it('should set hours to 00 when hours are selected and delete is pressed', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      const valueChangesSpy = jest.fn();
      directive.registerOnChange(valueChangesSpy);
      elementRefMock.nativeElement.selectionStart = 0;
      directive.onInteraction();
      const keyEvent = new KeyboardEvent('keydown', { key: 'Delete' });

      directive.onKeyDown(keyEvent);

      expect(rendererSpy.setProperty).toHaveBeenCalledWith(elementRefMock.nativeElement, 'value', '00:00');
      expect(valueChangesSpy).toHaveBeenCalledWith('');
    });

    it('should set minutes to 00 when minutes are selected and delete is pressed', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      const valueChangesSpy = jest.fn();
      directive.registerOnChange(valueChangesSpy);
      elementRefMock.nativeElement.selectionStart = 3;
      directive.onInteraction();
      const keyEvent = new KeyboardEvent('keydown', { key: 'Delete' });

      directive.onKeyDown(keyEvent);

      expect(rendererSpy.setProperty).toHaveBeenCalledWith(elementRefMock.nativeElement, 'value', '00:00');
      expect(valueChangesSpy).toHaveBeenCalledWith('');
    });

    it('should not allow minutes to be greater than 59', () => {
      const directive = new KpDurationMaskDirective(elementRefMock, rendererSpy);
      const valueChangesSpy = jest.fn();
      directive.registerOnChange(valueChangesSpy);
      elementRefMock.nativeElement.selectionStart = 3;
      const firstKeyEvent = new KeyboardEvent('keydown', { key: '9' });
      const secondKeyEvent = new KeyboardEvent('keydown', { key: '5' });
      directive.onKeyDown(firstKeyEvent);
      directive.onKeyDown(secondKeyEvent);

      expect(rendererSpy.setProperty).toHaveBeenCalledWith(elementRefMock.nativeElement, 'value', '00:05');
      expect(valueChangesSpy).toHaveBeenCalledWith('00:05');
    });
  });

  describe('KpDurationMaskDirectiveIntegration', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [TestHostComponent],
        imports: [KpDurationMaskDirective, ReactiveFormsModule],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('should create host component', () => {
      expect(hostComponent).toBeTruthy();
    });

    it('should set formControlValue', () => {
      const firstKeyEvent = new KeyboardEvent('keydown', { key: '1' });
      const secondKeyEvent = new KeyboardEvent('keydown', { key: '5' });
      hostComponent.durationInput.nativeElement.dispatchEvent(firstKeyEvent);
      hostComponent.durationInput.nativeElement.dispatchEvent(secondKeyEvent);
      expect(hostComponent.formControl.value).toBe('15:00');
    });

    it('should set html input element value', () => {
      hostComponent.formControl.setValue('10:25');
      expect(hostComponent.durationInput.nativeElement.value).toBe('10:25');
    });
  });
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-host-component',
  template: '<input kpDurationMask #durationInput [formControl]="formControl"/>',
  standalone: false,
})
class TestHostComponent {
  formControl = new FormControl();
  @ViewChild('durationInput', { static: true }) durationInput: ElementRef<HTMLInputElement>;
}
