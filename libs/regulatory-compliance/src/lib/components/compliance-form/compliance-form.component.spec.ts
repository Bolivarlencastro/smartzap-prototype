import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplianceFormComponent } from './compliance-form.component';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';

describe('NormativeFormComponent', () => {
  let component: ComplianceFormComponent;
  let fixture: ComponentFixture<ComplianceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ComplianceFormComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('addCompliance', () => {
    it('should emit the name on submit', () => {
      const dispatchSpy = jest.spyOn(component.saveCompliance, 'emit');

      component.normativeFormGroup.setValue({ name: 'mock_name' });
      component.addCompliance();

      expect(dispatchSpy).toHaveBeenCalledWith('mock_name');
    });

    it('should not emit the name on submit when the formControl is invalid', () => {
      const dispatchSpy = jest.spyOn(component.saveCompliance, 'emit');

      component.normativeFormGroup.setValue({ name: '' });
      component.addCompliance();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  it('should set the value on the formControl when the complianceName input value changes', () => {
    fixture.componentRef.setInput('complianceName', 'mock_name');
    fixture.detectChanges();

    expect(component.normativeFormGroup.value.name).toBe('mock_name');
  });

  it('should call reset on the formGroupDirective when the complianceName input changes to an empty string', () => {
    const resetSpy = jest.spyOn(component.fgDirective, 'resetForm');

    fixture.componentRef.setInput('complianceName', '');
    fixture.detectChanges();

    expect(resetSpy).toHaveBeenCalled();
  });
});
