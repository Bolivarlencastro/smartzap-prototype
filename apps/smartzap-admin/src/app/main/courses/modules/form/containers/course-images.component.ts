import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Course } from '../../../model';
import { CourseActions, UploadActions } from '../../../store/actions';
import { CourseSelectors, UploadSelectors } from '../../../store/selectors';
import { CourseFormImagesComponent } from '../components/information/course-form-images.component';

@Component({
  selector: 'app-course-images',
  template: `
    @if (course()) {
      <app-course-form-images
        [course]="course()"
        [isLoadingCourse]="isLoadingCourse()"
        [isLoadingImage]="isLoadingImage()"
        (uploadHolder)="uploadHolder($event)"
        (uploadThumb)="uploadThumb($event)"
        (save)="onSave($event)"
      ></app-course-form-images>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CourseFormImagesComponent],
})
export class CourseImagesComponent {
  course: Signal<Course>;
  isLoadingImage: Signal<boolean>;
  isLoadingCourse: Signal<boolean>;

  constructor(private readonly store: Store) {
    this.course = toSignal(store.select(CourseSelectors.selectCourse));
    this.isLoadingImage = toSignal(store.select(UploadSelectors.selectIsLoadingImage));
    this.isLoadingCourse = toSignal(store.select(CourseSelectors.selectIsLoading));
  }

  uploadHolder(file: File): void {
    this.store.dispatch(UploadActions.uploadImage({ file, imageType: 'holder_image' }));
  }

  uploadThumb(file: File): void {
    this.store.dispatch(UploadActions.uploadImage({ file, imageType: 'thumb_image' }));
  }

  onSave(course: Partial<Course>): void {
    const currentCourse = this.course();
    const id = currentCourse?.id;

    if (!id) {
      return;
    }

    this.store.dispatch(
      CourseActions.updateCourse({
        id,
        course: { ...currentCourse, ...course },
        nextRoute: ['/courses', id, 'form', 'settings'],
      }),
    );
  }
}
