import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PushTemplate } from '@keeps-platform-frontend-workspace/kp-keeps';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { PmTemplateModelComponent } from './pm-template-model.component';

describe('PmTemplateModelComponent', () => {
  let component: PmTemplateModelComponent;
  let fixture: ComponentFixture<PmTemplateModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmTemplateModelComponent, getTranslocoTestingModule()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PmTemplateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit selectTemplate event', () => {
    const emitSpy = jest.spyOn(component.selectTemplate, 'emit');
    const id = '123';

    component.onSelectTemplate(id);

    expect(emitSpy).toHaveBeenCalledWith(id);
  });

  it('should compute count from templates length', () => {
    const templates: PushTemplate[] = [
      { id: '1', name: 'Template A', body_preview: 'preview A' } as PushTemplate,
      { id: '2', name: 'Template B', body_preview: 'preview B' } as PushTemplate,
    ];
    fixture.componentRef.setInput('templates', templates);
    fixture.detectChanges();
    expect(component.count()).toBe(2);
  });
});
