import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';
import { initialState } from '@app/main/courses/store/reducers/course.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { CourseFormComponent } from './course-form.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

describe('CourseFormComponent', () => {
  let component: CourseFormComponent;
  let fixture: ComponentFixture<CourseFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CourseFormComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { ['course']: initialState } }), provideNoopAnimations()],
    });

    fixture = TestBed.createComponent(CourseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return the animation data from the outlet', () => {
    const mockOutlet = { activatedRouteData: { animation: 'isLeft' } } as unknown as RouterOutlet;
    expect(component.prepareRoute(mockOutlet)).toBe('isLeft');
  });
});
