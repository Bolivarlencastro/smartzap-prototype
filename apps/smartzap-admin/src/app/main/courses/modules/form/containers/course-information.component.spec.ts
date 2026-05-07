import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Course } from '@app/main/courses/model';
import { CourseActions } from '@app/main/courses/store/actions';
import { initialState } from '@app/main/courses/store/reducers/course.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CourseInformationComponent } from './course-information.component';

describe('CourseInformationComponent', () => {
  let component: CourseInformationComponent;
  let fixture: ComponentFixture<CourseInformationComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CourseInformationComponent],
      providers: [provideMockStore({ initialState: { ['course']: initialState } })],
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CourseInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch createCourse action', () => {
    const course = { description: 'test' } as Course;
    component.onSave(course);
    expect(store.dispatch).toHaveBeenCalledWith(CourseActions.createCourse({ course }));
  });

  it('should dispatch updateCourse action', () => {
    const course = { id: '1', description: 'test' } as Course;
    component.onSave(course);
    expect(store.dispatch).toHaveBeenCalledWith(CourseActions.updateCourse({ id: '1', course }));
  });
});
