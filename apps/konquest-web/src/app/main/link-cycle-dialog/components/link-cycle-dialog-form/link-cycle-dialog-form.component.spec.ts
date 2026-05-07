import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LinkCycleDialogFormComponent } from './link-cycle-dialog-form.component';
import { CycleDto } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('LinkCycleDialogFormComponent', () => {
  let component: LinkCycleDialogFormComponent;
  let fixture: ComponentFixture<LinkCycleDialogFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LinkCycleDialogFormComponent, getTranslocoTestingModule()],
      providers: [provideNoopAnimations()],
    });
    fixture = TestBed.createComponent(LinkCycleDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('form validation', () => {
    it('should disable submit button when form is invalid', () => {
      expect(component.disabledSubmitButton).toBe(true);
    });

    it('should enable submit button when cycle form value is only a string', () => {
      component.form.get('cycle').setValue('mock_test');

      expect(component.disabledSubmitButton).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.form.get('cycle').setValue({ id: 'mock_id' } as CycleDto);

      expect(component.disabledSubmitButton).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should emit formSubmit event when clicking the submit button', () => {
      const spy = jest.spyOn(component.formSubmit, 'emit');
      component.form.get('cycle').setValue({ id: 'mock_cycle_id' } as CycleDto);

      component.onSubmit();

      expect(spy).toHaveBeenCalledWith('mock_cycle_id');
    });

    it('should not emit formSubmit event if the form value is invalid', () => {
      const spy = jest.spyOn(component.formSubmit, 'emit');
      component.onSubmit();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  it('should emit filterCycle event', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.filterCycle, 'emit');

    component.form.get('cycle').setValue('mock_cycle_name');
    tick(210);

    expect(emitSpy).toHaveBeenCalledWith('mock_cycle_name');
  }));
});
