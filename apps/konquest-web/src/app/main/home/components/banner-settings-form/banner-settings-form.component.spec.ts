import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { KEEPS_DATE_FORMATS } from '@keeps-platform-frontend-workspace/kp-keeps';
import { LearningResource } from '../../models/banner-settings';
import { BannerSettingsFormComponent } from './banner-settings-form.component';

describe('BannerSettingsFormComponent', () => {
  let component: BannerSettingsFormComponent;
  let fixture: ComponentFixture<BannerSettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerSettingsFormComponent, getTranslocoTestingModule()],
      providers: [
        { provide: DateAdapter, useClass: DateFnsAdapter },
        { provide: MAT_DATE_FORMATS, useValue: KEEPS_DATE_FORMATS },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'form',
      new FormGroup({
        start_date: new FormControl(null, Validators.required),
        end_date: new FormControl(null, Validators.required),
        learning_resources: new FormControl(null, Validators.required),
      }),
    );
    fixture.detectChanges();
  });

  it('should display the content title', () => {
    const content = { title: 'Test Ttile' } as LearningResource;
    expect(component.displayFn(content)).toBe('Test Ttile');
  });

  it('should addContent into property learningResources and main form', () => {
    const item = { resource_id: '123' };
    component.contentControl.setValue(item);

    component.addContent();

    expect(component.learningResources()).toEqual([item]);
    expect(component.form().get('learning_resources').value).toEqual([item]);
    expect(component.contentControl.value).toBe(null);
  });

  it('should delete content from drag drop', () => {
    component.learningResources.set([
      { resource_id: '000' },
      { resource_id: '111' },
      { resource_id: '222' },
    ] as LearningResource[]);
    const expectedResult = [{ resource_id: '000' }, { resource_id: '222' }];

    component.deleteContent(1);

    expect(component.learningResources()).toEqual(expectedResult);
    expect(component.form().get('learning_resources').value).toEqual(expectedResult);
  });

  it('should add an external content', () => {
    component.urlControl.setValue('https://www.google.com');
    component.urlTitleControl.setValue('Google');
    component.urlImageControl.setValue('Image');

    const expectResult = {
      resource_type: 'EXTERNAL_CONTENT',
      external_resource_title: 'Google',
      external_resource_url: 'https://www.google.com',
      external_resource_image: 'Image',
      icon: 'link',
    };

    component.addExternalContent();

    expect(component.learningResources()).toEqual([expectResult]);
    expect(component.form().get('learning_resources').value).toEqual([expectResult]);
    expect(component.urlControl.value).toBe(null);
    expect(component.urlTitleControl.value).toBe(null);
    expect(component.urlImageControl.value).toBe(null);
  });
});
