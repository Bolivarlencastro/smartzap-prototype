import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ImageUploadV2Component } from '@keeps-platform-frontend-workspace/ui/kp-image-upload-v2';
import { Course } from 'app/main/courses/model';

@Component({
  selector: 'app-course-form-images',
  template: `
    <form class="flex flex-col gap-2" (ngSubmit)="onSubmit()">
      <div class="flex items-start justify-between gap-4 w-full mb-4">
        <div>
          <h2 class="text-2xl font-black mb-2">{{ 'COURSE.FORM.TABS.IMAGES' | transloco }}</h2>
          <p>{{ 'COURSE.FORM.NAVIGATION.IMAGES' | transloco }}</p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <a mat-stroked-button [routerLink]="['/courses', course.id, 'form']">{{ 'GENERAL.PREVIOUS' | transloco }}</a>
          <button mat-flat-button color="primary" [disabled]="isLoadingCourse || isLoadingImage" type="submit">
            {{ 'GENERAL.SAVE_AND_ADVANCE' | transloco }}
          </button>
        </div>
      </div>

      <mat-tab-group class="mb-6">
        <mat-tab [label]="'COURSE.FORM.INPUT.BANNER_IMAGE' | transloco">
          <kp-image-upload-v2
            class="aspect-[3] mt-1"
            [imageSrc]="course.holder_image"
            [aspectRatio]="3"
            [resizeToWidth]="1920"
            [resizeToHeight]="640"
            (uploadImage)="uploadHolder.emit($event)"
          ></kp-image-upload-v2>
        </mat-tab>
        <mat-tab [label]="'COURSE.FORM.INPUT.CARD_IMAGE' | transloco">
          <kp-image-upload-v2
            class="aspect-[9/16] max-w-80 mx-auto mt-1"
            [imageSrc]="course.thumb_image"
            [aspectRatio]="9 / 16"
            [resizeToWidth]="400"
            [resizeToHeight]="713"
            (uploadImage)="uploadThumb.emit($event)"
          ></kp-image-upload-v2>
        </mat-tab>
      </mat-tab-group>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ImageUploadV2Component, MatAnchor, MatButton, MatTab, MatTabGroup, RouterLink, TranslocoPipe],
})
export class CourseFormImagesComponent {
  @Input() course!: Course;
  @Input() isLoadingCourse!: boolean;
  @Input() isLoadingImage!: boolean;
  @Output() save = new EventEmitter<Partial<Course>>();
  @Output() uploadHolder = new EventEmitter<File>();
  @Output() uploadThumb = new EventEmitter<File>();

  onSubmit(): void {
    const { id, holder_image, thumb_image } = this.course;
    this.save.emit({ id, holder_image, thumb_image });
  }
}
