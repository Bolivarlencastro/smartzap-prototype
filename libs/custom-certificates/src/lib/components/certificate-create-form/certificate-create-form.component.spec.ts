import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateCreateFormComponent } from './certificate-create-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../helpers/transloco-testing.module';

describe('CertificateCreateFormComponent', () => {
  let component: CertificateCreateFormComponent;
  let fixture: ComponentFixture<CertificateCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateCreateFormComponent, getTranslocoTestingModule(), NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit formSubmit event', () => {
    const emitSpy = jest.spyOn(component.formSubmit, 'emit');
    component.onSubmit();
    expect(emitSpy).toHaveBeenCalledWith(component.form.value);
  });

  it('should update the form with the text color', () => {
    const value = '#0091ff';
    const event = { target: { value } } as unknown as Event;

    component.onColorChange('textColor', event);

    expect(component.form.get('textColor').value).toBe(value);
  });
});
