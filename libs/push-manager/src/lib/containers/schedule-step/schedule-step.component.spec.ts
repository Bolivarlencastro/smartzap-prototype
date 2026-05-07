import { CdkStepper } from '@angular/cdk/stepper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { KEEPS_DATE_FORMATS } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ScheduleForm } from '../../models/creation';
import { getTranslocoTestingModule } from '../../transloco-testing.module';
import { ScheduleStepComponent } from './schedule-step.component';

describe('ScheduleStepComponent', () => {
  let component: ScheduleStepComponent;
  let fixture: ComponentFixture<ScheduleStepComponent>;
  let store: MockStore;

  const mockCourses = [
    { id: 'course-1', name: 'Course 1' },
    { id: 'course-2', name: 'Course 2' },
  ] as any[];

  function createScheduleForm(): FormGroup<ScheduleForm> {
    return new FormGroup<ScheduleForm>({
      courseId: new FormControl<string>(null),
      campaign: new FormControl<string>(null),
      date: new FormControl<Date>(null),
      hour: new FormControl<string>(null),
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleStepComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore(),
        { provide: CdkStepper, useValue: {} },
        { provide: DateAdapter, useClass: DateFnsAdapter },
        { provide: MAT_DATE_FORMATS, useValue: KEEPS_DATE_FORMATS },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ScheduleStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('form', createScheduleForm());
    fixture.componentRef.setInput('courses', mockCourses);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with bondType as "course"', () => {
    expect(component.bondType()).toBe('course');
  });

  it('should set courses input', () => {
    expect(component.courses()).toEqual(mockCourses);
  });

  describe('isCourseType', () => {
    it('should return true when bondType is "course"', () => {
      expect(component.isCourseType()).toBe(true);
    });

    it('should return false when bondType is "campaign"', () => {
      component.setBondType('campaign');
      expect(component.isCourseType()).toBe(false);
    });
  });

  describe('setBondType', () => {
    it('should change bondType to "campaign"', () => {
      component.setBondType('campaign');
      expect(component.bondType()).toBe('campaign');
    });

    it('should change bondType back to "course"', () => {
      component.setBondType('campaign');
      component.setBondType('course');
      expect(component.bondType()).toBe('course');
    });
  });

  describe('displayCourseName', () => {
    it('should return the course name', () => {
      const course = { id: 'c1', name: 'Angular Basics' } as any;
      expect(component.displayCourseName(course)).toBe('Angular Basics');
    });

    it('should return empty string when course is null', () => {
      expect(component.displayCourseName(null)).toBe('');
    });

    it('should return empty string when course is undefined', () => {
      expect(component.displayCourseName(undefined)).toBe('');
    });
  });

  describe('validators on bond type change', () => {
    it('should set required validator on courseId when bondType is "course"', () => {
      const courseIdControl = component.form().get('courseId');
      expect(courseIdControl.hasValidator(Validators.required)).toBe(true);
    });

    it('should not have required validator on campaign when bondType is "course"', () => {
      const campaignControl = component.form().get('campaign');
      expect(campaignControl.hasValidator(Validators.required)).toBe(false);
    });

    it('should set required validator on campaign when bondType is "campaign"', () => {
      component.setBondType('campaign');
      fixture.detectChanges();

      const campaignControl = component.form().get('campaign');
      expect(campaignControl.hasValidator(Validators.required)).toBe(true);
    });

    it('should remove required validator from courseId when bondType is "campaign"', () => {
      component.setBondType('campaign');
      fixture.detectChanges();

      const courseIdControl = component.form().get('courseId');
      expect(courseIdControl.hasValidator(Validators.required)).toBe(false);
    });
  });

  describe('form reset on bond type change', () => {
    it('should reset form when switching bond type', () => {
      component.form().get('hour').setValue('10:00');
      component.setBondType('campaign');
      fixture.detectChanges();

      expect(component.form().get('hour').value).toBeNull();
    });

    it('should reset courseSearchControl when switching back to course type', () => {
      component.setBondType('campaign');
      fixture.detectChanges();

      component.courseSearchControl.setValue('previous search');
      component.setBondType('course');
      fixture.detectChanges();

      expect(component.courseSearchControl.value).toBeNull();
    });
  });
});
