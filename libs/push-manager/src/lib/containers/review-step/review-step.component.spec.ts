import { CdkStepper } from '@angular/cdk/stepper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ContactsForm, ScheduleForm, TemplateForm } from '../../models/creation';
import { CreationActions, creationInitialState } from '../../store';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { ReviewStepComponent } from './review-step.component';

function createTemplateForm(): FormGroup<TemplateForm> {
  return new FormGroup<TemplateForm>({
    templateId: new FormControl<string>('tpl-1'),
    variables: new FormGroup({}),
  });
}

function createScheduleForm(): FormGroup<ScheduleForm> {
  return new FormGroup<ScheduleForm>({
    courseId: new FormControl<string>(null),
    courseName: new FormControl<string>(null),
    campaign: new FormControl<string>(null),
    date: new FormControl<Date>(new Date(2025, 5, 15)),
    hour: new FormControl<string>('10:30'),
  });
}

function createContactsForm(): FormGroup<ContactsForm> {
  return new FormGroup<ContactsForm>({
    contacts: new FormControl<File>(null),
  });
}

describe('ReviewStepComponent', () => {
  let component: ReviewStepComponent;
  let fixture: ComponentFixture<ReviewStepComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewStepComponent, getTranslocoTestingModule()],
      providers: [
        { provide: CdkStepper, useValue: {} },
        provideMockStore({ initialState: { 'pm-creation': creationInitialState } }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ReviewStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('templateForm', createTemplateForm());
    fixture.componentRef.setInput('scheduleForm', createScheduleForm());
    fixture.componentRef.setInput('contactsForm', createContactsForm());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('destination', () => {
    it('should return courseName when set', () => {
      const form = createScheduleForm();
      form.get('courseName').setValue('Angular Basics');
      fixture.componentRef.setInput('scheduleForm', form);
      fixture.detectChanges();

      expect(component.destination()).toBe('Angular Basics');
    });

    it('should fall back to campaign when courseName is not set', () => {
      const form = createScheduleForm();
      form.get('campaign').setValue('Free Campaign');
      fixture.componentRef.setInput('scheduleForm', form);
      fixture.detectChanges();

      expect(component.destination()).toBe('Free Campaign');
    });

    it('should return empty string when both courseName and campaign are null', () => {
      expect(component.destination()).toBe('');
    });
  });

  describe('startDate', () => {
    it('should compute startDate from date and hour', () => {
      const form = createScheduleForm();
      form.get('date').setValue(new Date(2025, 5, 15));
      form.get('hour').setValue('14:30');
      fixture.componentRef.setInput('scheduleForm', form);
      fixture.detectChanges();

      const result = component.startDate();
      expect(result?.getHours()).toBe(14);
      expect(result?.getMinutes()).toBe(30);
    });

    it('should return null when date is not set', () => {
      const form = createScheduleForm();
      form.get('date').setValue(null);
      fixture.componentRef.setInput('scheduleForm', form);
      fixture.detectChanges();

      expect(component.startDate()).toBeNull();
    });

    it('should return null when hour is not set', () => {
      const form = createScheduleForm();
      form.get('hour').setValue(null);
      fixture.componentRef.setInput('scheduleForm', form);
      fixture.detectChanges();

      expect(component.startDate()).toBeNull();
    });
  });

  describe('computed properties from store', () => {
    beforeEach(() => {
      store.setState({
        'pm-creation': {
          ...creationInitialState,
          validationResult: {
            template_id: 'tpl-1',
            template_name: 'Template A',
            valid_rows: 100,
            invalid_rows: 2,
            total_rows: 102,
            invalid_rows_preview: [],
            missing_fields: [],
            estimated_cost: '50.00',
            cost_per_message: '0.50',
            current_balance: '200.00',
            has_sufficient_balance: true,
            detected_columns: [],
            file_name: 'test.csv',
            can_proceed: true,
            validation_message: '',
          },
          validating: false,
          submitting: false,
        },
      });
      fixture.detectChanges();
    });

    it('should return template name from validation result', () => {
      expect(component.templateName()).toBe('Template A');
    });

    it('should return valid rows count from validation result', () => {
      expect(component.contactsCount()).toBe(100);
    });

    it('should return estimated cost from validation result', () => {
      expect(component.estimatedCost()).toBe('50.00');
    });

    it('should return hasSufficientBalance from validation result', () => {
      expect(component.hasSufficientBalance()).toBe(true);
    });
  });

  describe('validating and submitting states', () => {
    it('should reflect validating true from store', () => {
      store.setState({ 'pm-creation': { ...creationInitialState, validating: true } });
      fixture.detectChanges();
      expect(component.validating()).toBe(true);
    });

    it('should reflect submitting true from store', () => {
      store.setState({ 'pm-creation': { ...creationInitialState, submitting: true } });
      fixture.detectChanges();
      expect(component.submitting()).toBe(true);
    });
  });

  describe('finish', () => {
    it('should dispatch createCampaign with correct params', () => {
      const file = new File(['content'], 'contacts.csv');

      const templateForm = createTemplateForm();
      const scheduleForm = createScheduleForm();
      const contactsForm = createContactsForm();

      scheduleForm.get('courseName').setValue('Course A');
      scheduleForm.get('date').setValue(new Date(2025, 5, 15));
      scheduleForm.get('hour').setValue('10:30');
      contactsForm.get('contacts').setValue(file);

      fixture.componentRef.setInput('templateForm', templateForm);
      fixture.componentRef.setInput('scheduleForm', scheduleForm);
      fixture.componentRef.setInput('contactsForm', contactsForm);

      component.finish();

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: '[Push Manager - Creation] Create Campaign',
          params: expect.objectContaining({
            name: 'Course A',
            template_id: 'tpl-1',
            file,
            template_variables: '{}',
          }),
        }),
      );
    });

    it('should use campaign as name when courseName is not set', () => {
      const scheduleForm = createScheduleForm();
      scheduleForm.get('campaign').setValue('Manual Campaign');
      scheduleForm.get('date').setValue(new Date(2025, 5, 15));
      scheduleForm.get('hour').setValue('09:00');

      fixture.componentRef.setInput('scheduleForm', scheduleForm);
      component.finish();

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: '[Push Manager - Creation] Create Campaign',
          params: expect.objectContaining({ name: 'Manual Campaign' }),
        }),
      );
    });

    it('should not dispatch if scheduleForm is not set', () => {
      store.dispatch.mockClear();
      fixture.componentRef.setInput('scheduleForm', null);
      component.finish();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch if templateForm is not set', () => {
      store.dispatch.mockClear();
      fixture.componentRef.setInput('templateForm', null);
      component.finish();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
