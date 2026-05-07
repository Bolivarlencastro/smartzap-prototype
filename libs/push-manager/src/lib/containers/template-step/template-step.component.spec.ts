import { CdkStepper } from '@angular/cdk/stepper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TemplateForm } from '../../models/creation';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { TemplateStepComponent } from './template-step.component';

describe('TemplateStepComponent', () => {
  let component: TemplateStepComponent;
  let fixture: ComponentFixture<TemplateStepComponent>;

  const mockTemplates = [
    {
      id: 'template1',
      title: 'Template 1',
      body_preview: 'Hello {{name}}, your email is {{email}}',
      variables: [
        { name: 'name', position: 1, required: true },
        { name: 'email', position: 2, required: true },
      ],
    },
    {
      id: 'template2',
      title: 'Template 2',
      body_preview: 'Product: {{product}}, Price: ${{price}}',
      variables: [
        { name: 'product', position: 1, required: true },
        { name: 'price', position: 2, required: true },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateStepComponent, getTranslocoTestingModule()],
      providers: [{ provide: CdkStepper, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput(
      'form',
      new FormGroup<TemplateForm>({
        templateId: new FormControl(null),
        variables: new FormGroup({}),
      }),
    );

    fixture.componentRef.setInput('templates', mockTemplates);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set templates input', () => {
    expect(component.templates()).toEqual(mockTemplates);
  });

  it('should initialize with no selected template', () => {
    expect(component.selectedTemplateId()).toBeNull();
    expect(component.currentTemplate()).toBeNull();
    expect(component.selectedTemplateVariables()).toEqual([]);
  });

  it('should update form when template is selected', () => {
    const templateId = 'template1';
    component.onSelectTemplate(templateId);

    expect(component.form().get('templateId')?.value).toBe(templateId);
    expect(component.selectedTemplateId()).toBe(templateId);
  });

  it('should return current selected template', () => {
    component.onSelectTemplate('template1');
    expect(component.currentTemplate()).toEqual(mockTemplates[0]);
  });

  it('should return selected template variables', () => {
    component.onSelectTemplate('template1');
    expect(component.selectedTemplateVariables()).toEqual(mockTemplates[0].variables);

    component.onSelectTemplate('template2');
    expect(component.selectedTemplateVariables()).toEqual(mockTemplates[1].variables);
  });

  it('should return variables form group', () => {
    const variablesGroup = component.variablesFormGroup();
    expect(variablesGroup).toBeInstanceOf(FormGroup);
  });

  it('should create form controls for template variables when template is selected', () => {
    component.onSelectTemplate('template1');
    fixture.detectChanges();

    const variablesGroup = component.variablesFormGroup();
    expect(variablesGroup.get('name')).toBeTruthy();
    expect(variablesGroup.get('email')).toBeTruthy();
    expect(variablesGroup.get('name')?.hasValidator(Validators.required)).toBeTruthy();
    expect(variablesGroup.get('email')?.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should clear previous variable controls when switching templates', () => {
    component.onSelectTemplate('template1');
    fixture.detectChanges();

    let variablesGroup = component.variablesFormGroup();
    expect(variablesGroup.get('name')).toBeTruthy();
    expect(variablesGroup.get('email')).toBeTruthy();

    component.onSelectTemplate('template2');
    fixture.detectChanges();

    variablesGroup = component.variablesFormGroup();
    expect(variablesGroup.get('name')).toBeFalsy();
    expect(variablesGroup.get('email')).toBeFalsy();
    expect(variablesGroup.get('product')).toBeTruthy();
    expect(variablesGroup.get('price')).toBeTruthy();
  });

  it('should update form validity when variables change', () => {
    component.onSelectTemplate('template1');
    fixture.detectChanges();

    expect(component.form().valid).toBeFalsy();

    const variablesGroup = component.variablesFormGroup();
    variablesGroup.get('name')?.setValue('John');
    variablesGroup.get('email')?.setValue('john@example.com');

    expect(component.form().valid).toBeTruthy();
  });

  it('should handle empty templates array', () => {
    fixture.componentRef.setInput('templates', []);
    fixture.detectChanges();

    expect(component.templates()).toEqual([]);
    expect(component.currentTemplate()).toBeNull();
    expect(component.selectedTemplateVariables()).toEqual([]);
  });

  it('should not throw error when selecting non-existent template', () => {
    expect(() => {
      component.onSelectTemplate('non-existent');
    }).not.toThrow();

    expect(component.currentTemplate()).toBeNull();
    expect(component.selectedTemplateVariables()).toEqual([]);
  });

  it('should set selectedTemplateId when onSelectTemplate is called', () => {
    const templateId = 'template2';
    component.onSelectTemplate(templateId);

    expect(component.selectedTemplateId()).toBe(templateId);
  });

  it('should update form templateId when onSelectTemplate is called', () => {
    const templateId = 'template1';
    component.onSelectTemplate(templateId);

    expect(component.form().get('templateId')?.value).toBe(templateId);
  });

  it('should update variables form group after template selection', () => {
    component.onSelectTemplate('template1');
    fixture.detectChanges();

    const variablesGroup = component.variablesFormGroup();
    expect(Object.keys(variablesGroup.controls)).toEqual(['name', 'email']);
    expect(variablesGroup.valid).toBeFalsy();

    variablesGroup.get('name')?.setValue('Test Name');
    variablesGroup.get('email')?.setValue('test@email.com');

    expect(variablesGroup.valid).toBeTruthy();
  });
});
