import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { globalSettingsFeature } from '@app/shared/store/features';
import { Store } from '@ngrx/store';
import { Category, Course, Language } from '../../../model';
import { CourseActions } from '../../../store/actions';
import { CourseSelectors } from '../../../store/selectors';
import { CourseFormInformationComponent } from '../components/information/course-form-information.component';

@Component({
  selector: 'app-form-information',
  template: `
    @if (course()) {
      <app-course-form-information
        [isLoadingCourse]="isLoadingCourse()"
        [course]="course()"
        [languages]="languages()"
        [categories]="categories()"
        (save)="onSave($event)"
      ></app-course-form-information>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CourseFormInformationComponent],
})
export class CourseInformationComponent {
  course: Signal<Course>;
  isLoadingCourse: Signal<boolean>;
  languages: Signal<Language[]>;
  categories: Signal<Category[]>;

  constructor(private store: Store) {
    this.course = toSignal(store.select(CourseSelectors.selectCourse));
    this.isLoadingCourse = toSignal(store.select(CourseSelectors.selectIsLoading));
    this.languages = toSignal(store.select(globalSettingsFeature.selectLanguages));
    this.categories = toSignal(store.select(globalSettingsFeature.selectCategories));
  }

  onSave(course: Course): void {
    const { id } = course;

    if (!id) {
      this.store.dispatch(CourseActions.createCourse({ course }));
      return;
    }

    this.store.dispatch(CourseActions.updateCourse({ id, course, nextRoute: ['/courses', id, 'form', 'images'] }));
  }
}
