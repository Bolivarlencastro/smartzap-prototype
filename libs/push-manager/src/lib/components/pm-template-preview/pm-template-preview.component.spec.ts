import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PushTemplate } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { PmTemplatePreviewComponent } from './pm-template-preview.component';

describe('PmTemplatePreviewComponent', () => {
  let component: PmTemplatePreviewComponent;
  let fixture: ComponentFixture<PmTemplatePreviewComponent>;

  const mockTemplate: PushTemplate = {
    id: 'template1',
    title: 'Template 1',
    name: '',
    content_sid: '',
    body_preview: 'Hello {{name}}, your email is {{email}}. Product: {{product}}',
    variables: [
      { name: 'name', position: 1, required: true },
      { name: 'email', position: 2, required: true },
      { name: 'product', position: 3, required: true },
    ],
    category: '',
    language: '',
    is_active: true,
    cost_per_message: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmTemplatePreviewComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PmTemplatePreviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize processedContent as empty string', () => {
    expect(component.processedContent()).toBe('');
  });

  describe('when template is not selected', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not update processedContent', () => {
      fixture.componentRef.setInput('selectedTemplate', null);
      fixture.detectChanges();

      expect(component.processedContent()).toBe('');
    });

    it('should render default content', () => {
      const defaultContent = fixture.debugElement.query(By.css('.default-content'));
      expect(defaultContent).toBeTruthy();
    });
  });

  describe('when template is selected', () => {
    let formGroup: FormGroup;

    beforeEach(() => {
      formGroup = new FormGroup({
        name: new FormControl(''),
        email: new FormControl(''),
        product: new FormControl(''),
      });

      fixture.componentRef.setInput('selectedTemplate', mockTemplate);
      fixture.componentRef.setInput('variablesFormGroup', formGroup);
      fixture.detectChanges();
    });

    it('should update processedContent with empty form values', () => {
      expect(component.processedContent()).toBe('Hello {{name}}, your email is {{email}}. Product: {{product}}');
    });

    it('should update processedContent when form values are set', () => {
      formGroup.patchValue({
        name: 'John Doe',
        email: 'john@example.com',
        product: 'Laptop',
      });

      fixture.detectChanges();
      expect(component.processedContent()).toBe('Hello John Doe, your email is john@example.com. Product: Laptop');
    });

    it('should replace newlines with <br> tags', () => {
      const templateWithNewlines: PushTemplate = {
        ...mockTemplate,
        body_preview: 'Line 1\nLine 2\nLine 3',
        variables: [],
      };

      fixture.componentRef.setInput('selectedTemplate', templateWithNewlines);
      fixture.detectChanges();

      expect(component.processedContent()).toBe('Line 1<br>Line 2<br>Line 3');
    });

    it('should handle partial form values', () => {
      formGroup.patchValue({
        name: 'John',
        email: '',
        product: null,
      });

      fixture.detectChanges();
      expect(component.processedContent()).toBe('Hello John, your email is {{email}}. Product: {{product}}');
    });

    it('should update processedContent when form values change', () => {
      expect(component.processedContent()).toBe('Hello {{name}}, your email is {{email}}. Product: {{product}}');

      formGroup.patchValue({
        name: 'Jane',
        email: 'jane@example.com',
        product: 'Phone',
      });

      fixture.detectChanges();
      expect(component.processedContent()).toBe('Hello Jane, your email is jane@example.com. Product: Phone');
    });

    it('should render content when template is selected', () => {
      const contentDiv = fixture.debugElement.query(By.css('.content'));
      const defaultContent = fixture.debugElement.query(By.css('.default-content'));

      expect(contentDiv).toBeTruthy();
      expect(defaultContent).toBeFalsy();
    });

    it('should render WhatsApp notification', () => {
      const notification = fixture.debugElement.query(By.css('.notification'));
      const waIcon = fixture.debugElement.query(By.css('.wa-icon'));

      expect(notification).toBeTruthy();
      expect(waIcon).toBeTruthy();
      expect(waIcon.nativeElement.textContent).toContain('W');
    });
  });

  describe('form value changes subscription', () => {
    it('should trigger processedContent update when form values change', () => {
      const formGroup = new FormGroup({
        name: new FormControl(''),
        email: new FormControl(''),
      });

      fixture.componentRef.setInput('selectedTemplate', mockTemplate);
      fixture.componentRef.setInput('variablesFormGroup', formGroup);
      fixture.detectChanges();

      const initialContent = component.processedContent();

      formGroup.patchValue({ name: 'Test' });
      fixture.detectChanges();

      expect(component.processedContent()).not.toBe(initialContent);
    });
  });

  describe('effect triggering', () => {
    it('should trigger processContent when selectedTemplate changes', () => {
      const formGroup = new FormGroup({
        name: new FormControl('Initial'),
      });

      fixture.componentRef.setInput('variablesFormGroup', formGroup);
      fixture.detectChanges();

      fixture.componentRef.setInput('selectedTemplate', mockTemplate);
      fixture.detectChanges();

      expect(component.processedContent()).toBe('Hello Initial, your email is {{email}}. Product: {{product}}');
    });
  });
});
