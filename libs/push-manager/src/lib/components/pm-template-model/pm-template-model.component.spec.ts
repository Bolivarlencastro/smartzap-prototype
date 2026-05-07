import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});
