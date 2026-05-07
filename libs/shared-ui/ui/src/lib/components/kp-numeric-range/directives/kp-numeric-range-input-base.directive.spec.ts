import { KpNumericRangeInputBaseDirective } from './kp-numeric-range-input-base.directive';
import { NgControl } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

describe('KpNumericRangeInputDirective', () => {
  let controlMock: jest.Mocked<NgControl>;
  let elementRefMock: jest.Mocked<ElementRef<HTMLInputElement>>;
  let valueChangesSubject: BehaviorSubject<string>;
  let directive: KpNumericRangeInputBaseDirective;

  beforeEach(() => {
    valueChangesSubject = new BehaviorSubject('');

    controlMock = {
      value: '',
      disabled: false,
      touched: false,
      invalid: false,
      valueChanges: valueChangesSubject.asObservable(),
    } as unknown as jest.Mocked<NgControl>;

    elementRefMock = { nativeElement: { focus: jest.fn() } } as unknown as jest.Mocked<ElementRef<HTMLInputElement>>;

    directive = new KpNumericRangeInputBaseDirective(controlMock, elementRefMock);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('getters', () => {
    it('should return whether the related ngControl is empty', () => {
      expect(directive.empty).toBe(true);
    });

    it('should return whether the related ngControl is disabled', () => {
      (controlMock as any).disabled = true;

      expect(directive.disabled).toBe(true);
    });

    it('should return whether the related control is invalid', () => {
      (controlMock as any).touched = true;
      (controlMock as any).invalid = true;

      expect(directive.invalid).toBe(true);
    });

    it('should return the related control value', () => {
      (controlMock as any).value = 'mock_value';

      expect(directive.value).toBe('mock_value');
    });
  });

  describe('valueChanges', () => {
    it('should emit when a input event happens in the directive', (done) => {
      directive.valueChanges.subscribe(() => {
        expect.assertions(0);
        done();
      });

      directive.inputChanged();
    });
  });

  describe('keyUp', () => {
    it('should call the keyUp callback function', () => {
      const keyupCallback = jest.fn();
      directive.onKeyUp = keyupCallback;

      directive.keyUp('a');

      expect(keyupCallback).toHaveBeenCalledWith('a');
    });
  });

  describe('focus', () => {
    it('should focus the native element ', () => {
      directive.focus();

      expect(elementRefMock.nativeElement.focus).toHaveBeenCalled();
    });
  });
});
