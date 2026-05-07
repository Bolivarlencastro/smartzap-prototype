import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { Course } from 'app/main/courses/model';
import { courseMock } from 'app/shared/test/courses';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';
import { CourseFormInformationComponent } from './course-form-information.component';

describe('CourseFormInformationComponent', () => {
  let component: CourseFormInformationComponent;
  let fixture: ComponentFixture<CourseFormInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFormInformationComponent, getTranslocoTestingModule()],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseFormInformationComponent);
    component = fixture.componentInstance;
    component.course = courseMock as Course;
    component.categories = [];
    component.languages = [];
    fixture.detectChanges();
  });

  it('should initialize form with course values on ngOnInit', () => {
    expect(component.form.get('name')?.value).toBe(courseMock.name);
    expect(component.form.get('description')?.value).toBe(courseMock.description);
    expect(component.form.get('category_id')?.value).toBe(courseMock.category_id);
    expect(component.form.get('lang')?.value).toBe(courseMock.lang);
    expect(component.form.get('assessment_mode')?.value).toBe('FULL');
  });

  it('should emit save event with form data on onSubmit', () => {
    jest.spyOn(component.save, 'emit');
    component.onSubmit();
    expect(component.save.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: courseMock.name,
        description: courseMock.description,
        content_performance_weight: 5,
        quiz_performance_weight: 5,
      }),
    );
  });

  describe('nameLength', () => {
    it('should return the length of the name field value', () => {
      component.form.patchValue({ name: 'Test' });
      expect(component.nameLength).toBe(4);
    });
  });

  describe('descriptionLength', () => {
    it('should return the length of the description field value', () => {
      component.form.patchValue({ description: 'Hello' });
      expect(component.descriptionLength).toBe(5);
    });
  });
});
