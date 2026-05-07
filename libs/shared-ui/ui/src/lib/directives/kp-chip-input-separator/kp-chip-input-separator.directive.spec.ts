import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInput } from '@angular/material/chips';
import { By } from '@angular/platform-browser';
import { KpChipInputSeparatorDirective } from './kp-chip-input-separator.directive';

describe('KpChipInputSeparatorDirective', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let inputElement: DebugElement;
  let chipInput: MatChipInput;
  let chipEndSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [KpChipInputSeparatorDirective],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: MatChipInput, useValue: { _emitChipEnd: jest.fn() } }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    inputElement = fixture.debugElement.query(By.directive(KpChipInputSeparatorDirective));
    chipInput = inputElement.injector.get(MatChipInput);
    chipEndSpy = jest.spyOn(chipInput, '_emitChipEnd');

    fixture.detectChanges();
  });

  it('should create host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should call _emitChipEnd when semicolon key is pressed', () => {
    const event = new KeyboardEvent('keydown', { key: ';' });
    inputElement.nativeElement.dispatchEvent(event);
    expect(chipEndSpy).toHaveBeenCalled();
  });

  it('should call _emitChipEnd when comma key is pressed', () => {
    const event = new KeyboardEvent('keydown', { key: ',' });
    inputElement.nativeElement.dispatchEvent(event);
    expect(chipEndSpy).toHaveBeenCalled();
  });

  it('should not call _emitChipEnd when any other key is pressed', () => {
    const anotherKeys = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '`',
      '~',
      '!',
      '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '-',
      '_',
      '=',
      '+',
      '[',
      '{',
      ']',
      '}',
      '\\',
      '|',
      ':',
      "'",
      '"',
      '<',
      '.',
      '>',
      '/',
      '?',
    ];
    for (const key of anotherKeys) {
      const event = new KeyboardEvent('keydown', { key });
      inputElement.nativeElement.dispatchEvent(event);
      expect(chipEndSpy).not.toHaveBeenCalled();
    }
  });
});

@Component({
  template: ` <input [kpChipInputSeparator]="chipInput" /> `,
  standalone: false,
})
class TestHostComponent {
  chipInput: MatChipInput;
}
