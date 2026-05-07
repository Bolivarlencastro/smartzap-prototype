import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CourseActions } from '@app/main/courses/store/actions';
import { initialState } from '@app/main/courses/store/reducers/course.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CourseFinishComponent } from './course-finish.component';
import { getTranslocoTestingModule } from 'app/shared/test/transloco-testing.module';

describe('CourseFinishComponent', () => {
  let component: CourseFinishComponent;
  let fixture: ComponentFixture<CourseFinishComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CourseFinishComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { ['course']: initialState } }), provideNoopAnimations()],
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CourseFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch startPublish action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onPublish('1');
    expect(spy).toHaveBeenCalledWith(CourseActions.startPublish({ id: '1' }));
  });
});
