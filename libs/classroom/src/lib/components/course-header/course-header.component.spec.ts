import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTranslocoTestingModule } from '../../transloco-scope.factory';
import { CourseHeaderComponent } from './course-header.component';

describe('CourseHeaderComponent', () => {
  let component: CourseHeaderComponent;
  let fixture: ComponentFixture<CourseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule(), NoopAnimationsModule, CourseHeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should go to previous step', () => {
    const spy = jest.spyOn(component.previous, 'emit');
    component.previousStep();
    expect(spy).toHaveBeenCalled();
  });

  it('should go to next step', () => {
    const spy = jest.spyOn(component.next, 'emit');
    component.nextStep();
    expect(spy).toHaveBeenCalled();
  });
});
