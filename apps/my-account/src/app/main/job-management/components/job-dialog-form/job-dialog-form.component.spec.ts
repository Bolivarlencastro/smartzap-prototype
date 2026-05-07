import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JobModel } from '../../models';
import { JobDialogFormComponent, JobModelForm } from './job-dialog-form.component';
import { getTranslocoTestingModule } from 'app/shared/util/transloco-testing.module';

describe('JobDialogFormComponent', () => {
  let component: JobDialogFormComponent;
  let fixture: ComponentFixture<JobDialogFormComponent>;
  let form: FormGroup<JobModelForm>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobDialogFormComponent, getTranslocoTestingModule(), NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(JobDialogFormComponent);
    component = fixture.componentInstance;
    form = component.formValue;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(form).toBeDefined();
  });

  it('should disable submit button when form is pristine or form is invalid', () => {
    expect(component.disabledSubmitButton).toBe(true);
  });

  it('should enable submit button when form is dirty and form is valid', () => {
    form.get('name').setValue('Job 1');
    form.markAsDirty();
    expect(component.disabledSubmitButton).toBe(false);
  });

  it('should emit formSubmit event when clicking the submit button', () => {
    const spy = jest.spyOn(component.formSubmit, 'emit');
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith(form.value);
  });

  it('should populate the form with a job when is edition', () => {
    const job: JobModel = { id: '1', name: 'Job 1', created_date: '', updated_date: '', workspace: '' };
    fixture.componentRef.setInput('item', job);
    fixture.detectChanges();
    expect(form.value).toEqual(job);
  });

  it('should not populate the form with a job when is creation', () => {
    const job: JobModel = { id: null, name: null, created_date: null, updated_date: null, workspace: null };
    expect(form.value).toEqual(job);
  });
});
