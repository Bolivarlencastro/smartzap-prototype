const childInputKeyUpMock = jest.fn();

jest.mock('./utils', () => ({
  onChildInputKeyUp: childInputKeyUpMock,
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpNumericRangeComponent } from './kp-numeric-range.component';
import { KpNumericRangeInputEndDirective, KpNumericRangeInputStartDirective } from '../directives';
import { Subject, take } from 'rxjs';

describe('KpNumericRangeComponent', () => {
  let component: KpNumericRangeComponent;
  let fixture: ComponentFixture<KpNumericRangeComponent>;
  let mockStartDirective: jest.Mocked<KpNumericRangeInputStartDirective>;
  let mockEndDirective: jest.Mocked<KpNumericRangeInputEndDirective>;
  const stateChangesSubject = new Subject<void>();

  beforeEach(async () => {
    mockStartDirective = {
      valueChanges: stateChangesSubject.asObservable(),
      focus: jest.fn(),
      onKeyUp: jest.fn(),
      empty: false,
      disabled: false,
      invalid: false,
    } as unknown as jest.Mocked<KpNumericRangeInputStartDirective>;

    mockEndDirective = {
      valueChanges: stateChangesSubject.asObservable(),
      focus: jest.fn(),
      onKeyUp: jest.fn(),
      empty: false,
      disabled: false,
      invalid: false,
    } as unknown as jest.Mocked<KpNumericRangeInputEndDirective>;

    await TestBed.configureTestingModule({
      imports: [KpNumericRangeComponent, KpNumericRangeInputStartDirective, KpNumericRangeInputEndDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(KpNumericRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngAfterContentInit', () => {
    it('should subscribe to the value changes of the child inputs', (done) => {
      component.startInput = mockStartDirective;
      component.endInput = mockEndDirective;

      component.ngAfterContentInit();

      component.stateChanges.pipe(take(1)).subscribe(() => {
        expect.assertions(0);
        done();
      });

      stateChangesSubject.next();
    });
  });

  describe('keyUp listener', () => {
    beforeEach(() => {
      component.startInput = mockStartDirective;
      component.endInput = mockEndDirective;
      component.ngAfterContentInit();
    });

    it('should onChildInputKeyUp input when a keyUp event occurs on the start input directive', () => {
      mockStartDirective.onKeyUp('0');

      expect(childInputKeyUpMock).toHaveBeenCalledWith(mockStartDirective, mockEndDirective, '0', true);
    });

    it('should onChildInputKeyUp input when a keyUp event occurs on the end input directive', () => {
      mockEndDirective.onKeyUp('0');

      expect(childInputKeyUpMock).toHaveBeenCalledWith(mockEndDirective, mockStartDirective, '0', false);
    });
  });

  describe('onContainerClick', () => {
    beforeEach(() => {
      component.startInput = mockStartDirective;
      component.endInput = mockEndDirective;
      component.ngAfterContentInit();
    });

    it('should focus the startInput if it is empty', () => {
      (mockStartDirective as any).empty = true;

      component.onContainerClick();

      expect(mockStartDirective.focus).toHaveBeenCalled();
    });

    it('should focus the endInput if the start input is not empty', () => {
      (mockStartDirective as any).empty = false;

      component.onContainerClick();

      expect(mockEndDirective.focus).toHaveBeenCalled();
    });

    it('should do nothing if the component is already focused or disabled', () => {
      component.focused = true;

      component.onContainerClick();

      expect(mockStartDirective.focus).not.toHaveBeenCalled();
      expect(mockEndDirective.focus).not.toHaveBeenCalled();
    });
  });

  describe('focusChanged', () => {
    it('should set the component as focused when a origin is defined', () => {
      component.focusChanged('mouse');

      expect(component.focused).toBe(true);
    });

    it('should emit on the stateChanges observable', (done) => {
      component.stateChanges.subscribe(() => {
        expect.assertions(0);
        done();
      });

      component.focusChanged('mouse');
    });
  });
});
