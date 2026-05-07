jest.mock('emoji-picker-element', () => ({}));
jest.mock('../../utils/emoji-picker.util', () => ({
  initEmojiPicker: jest.fn(),
}));

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentEditInlineComponent } from './comment-edit-inline.component';

describe('CommentEditInlineComponent', () => {
  let component: CommentEditInlineComponent;
  let fixture: ComponentFixture<CommentEditInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentEditInlineComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentEditInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('maxChars', () => {
    it('should be 500', () => {
      expect(component.maxChars).toBe(500);
    });
  });

  describe('charCount', () => {
    it('should return 0 when text is empty', () => {
      component.text.set('');
      expect(component.charCount()).toBe(0);
    });

    it('should return the length of the current text', () => {
      component.text.set('hello');
      expect(component.charCount()).toBe(5);
    });
  });

  describe('isOverLimit', () => {
    it('should be false when text is under the limit', () => {
      component.text.set('hello');
      expect(component.isOverLimit()).toBe(false);
    });

    it('should be false when text length equals maxChars (500)', () => {
      component.text.set('a'.repeat(500));
      expect(component.isOverLimit()).toBe(false);
    });

    it('should be true when text length exceeds 500 characters', () => {
      component.text.set('a'.repeat(501));
      expect(component.isOverLimit()).toBe(true);
    });
  });

  describe('confirm output', () => {
    it('should emit when confirm button is clicked and not over limit', () => {
      let emitted = false;
      component.confirm.subscribe(() => (emitted = true));

      component.text.set('some text');
      fixture.detectChanges();

      const confirmBtn = fixture.nativeElement.querySelector('button[mat-icon-button]:last-of-type');
      confirmBtn.click();

      expect(emitted).toBe(true);
    });

    it('confirm button should be disabled when isOverLimit is true', () => {
      component.text.set('a'.repeat(501));
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button[mat-icon-button]');
      const confirmBtn = buttons[buttons.length - 1];
      expect(confirmBtn.disabled).toBe(true);
    });

    it('confirm button should not be disabled when within limit', () => {
      component.text.set('hello');
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button[mat-icon-button]');
      const confirmBtn = buttons[buttons.length - 1];
      expect(confirmBtn.disabled).toBe(false);
    });
  });

  describe('editCancel output', () => {
    it('should emit when cancel button is clicked', () => {
      let emitted = false;
      component.editCancel.subscribe(() => (emitted = true));

      const buttons = fixture.nativeElement.querySelectorAll('button[mat-icon-button]');
      const cancelBtn = buttons[buttons.length - 2];
      cancelBtn.click();

      expect(emitted).toBe(true);
    });
  });
});
