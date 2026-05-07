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
    expect(component.form.get('lang')?.value).toBe('pt-BR');
    expect(component.form.get('assessment_mode')?.value).toBe('FULL');
  });

  it('should refresh editor values when course input changes', () => {
    const updatedCourse = {
      ...courseMock,
      description: 'Descricao longa vinda do edge case',
      message_description: '*Boas-vindas* ao novo fluxo',
    } as Course;

    component.course = updatedCourse;
    component.ngOnChanges({
      course: {
        currentValue: updatedCourse,
        previousValue: courseMock,
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(component.form.get('description')?.value).toBe(updatedCourse.description);
    expect(component.form.get('message_description')?.value).toBe(updatedCourse.message_description);
    expect(component.descriptionEditorValue).toContain(updatedCourse.description);
    expect(component.shortDescriptionEditorValue).toContain('<strong>Boas-vindas</strong>');
  });

  it('should render long and short description labels', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('COURSE.FORM.INPUT.LONG_DESCRIPTION');
    expect(content).toContain('COURSE.FORM.INPUT.SHORT_DESCRIPTION');
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

  describe('shortDescriptionLength', () => {
    it('should return the length of the short description field value', () => {
      component.form.patchValue({ message_description: 'Boas-vindas' });
      expect(component.shortDescriptionLength).toBe(11);
    });
  });

  it('should invalidate short description when longer than 120 characters', () => {
    component.form.patchValue({ message_description: 'a'.repeat(121) });

    expect(component.form.get('message_description')?.hasError('maxlength')).toBe(true);
  });
});
