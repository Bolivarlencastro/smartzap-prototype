import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CycleCreateFormComponent } from './cycle-create-form.component';
import { CycleCreateFilter } from '../../models';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';

describe('CycleDialogFormComponent', () => {
  let component: CycleCreateFormComponent;
  let fixture: ComponentFixture<CycleCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleCreateFormComponent, getTranslocoTestingModule(), NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CycleCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should disable submit button when form is pristine or form is invalid', () => {
    expect(component.disabledSubmitButton).toBe(true);
  });

  describe('filterItem', () => {
    it('should emit filter when filtering a compliance', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.filterItem, 'emit');
      const expectedPayload: CycleCreateFilter = { type: 'compliances', search: 'mock_filter' };

      component.form.get('compliance').setValue('mock_filter');
      tick(210);

      expect(emitSpy).toHaveBeenCalledWith(expectedPayload);
    }));

    it('should emit filter when filtering a learning object', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.filterItem, 'emit');
      const expectedPayload: CycleCreateFilter = { type: 'learningObjects', search: 'mock_filter' };

      component.form.get('learningObject').setValue('mock_filter');
      tick(210);

      expect(emitSpy).toHaveBeenCalledWith(expectedPayload);
    }));
  });

  describe('onSubmit', () => {
    it('should emit the formSubmit event', () => {
      const emitSpy = jest.spyOn(component.formSubmit, 'emit');
      component.onSubmit();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should emit the deleteCycle event', () => {
      const emitSpy = jest.spyOn(component.deleteCycle, 'emit');
      component.onDelete();

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});
