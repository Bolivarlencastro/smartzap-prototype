import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpEditableComponent } from './kp-editable.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';

describe('KpEditableComponent', () => {
  let component: KpEditableComponent;
  let fixture: ComponentFixture<KpEditableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatCheckboxModule, KpEditableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('toggleEditEditMode', () => {
    it('should set the edit-mode class on the host element', () => {
      component.toggleEditMode();

      fixture.detectChanges();

      expect(fixture.nativeElement.classList).toContain('edit-mode');
    });

    it('should display the edit input and with the current item value', () => {
      fixture.componentRef.setInput('value', 'mock_value');

      component.toggleEditMode();
      fixture.detectChanges();

      const inputElement = fixture.debugElement.query(By.css('#edit-input'));
      const value = inputElement.nativeElement.value;

      expect(inputElement).toBeTruthy();
      expect(value).toBe('mock_value');
    });

    it('should return to viewMode if is in edit mode', () => {
      fixture.componentRef.setInput('viewMode', 'edit');
      fixture.detectChanges();

      component.toggleEditMode();

      const inputElement = fixture.debugElement.query(By.css('#edit-input'));
      expect(inputElement).toBeFalsy();
    });
  });

  describe('saveChanges', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('viewMode', 'edit');
      fixture.detectChanges();
    });

    it('should emit the current input value', () => {
      const emitSpy = jest.spyOn(component.savedChanges, 'emit');
      const event = new Event('input');
      const inputElement = fixture.debugElement.query(By.css('#edit-input')).nativeElement;
      inputElement.value = 'mock_value';
      inputElement.dispatchEvent(event);

      component.saveChanges();

      expect(emitSpy).toHaveBeenCalledWith('mock_value');
    });

    it('should should not emit if the formControl is invalid', () => {
      const emitSpy = jest.spyOn(component.savedChanges, 'emit');

      component.saveChanges();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should emit the deleteItem event', () => {
      const emitSpy = jest.spyOn(component.deleteItem, 'emit');

      component.onDelete();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onCheckChange', () => {
    it('should emit the checkedChange event', () => {
      const emitSpy = jest.spyOn(component.checkedChange, 'emit');

      component.onCheckChange({ checked: true } as MatCheckboxChange);

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});
