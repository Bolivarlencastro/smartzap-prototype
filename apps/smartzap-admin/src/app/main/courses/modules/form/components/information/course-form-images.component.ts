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
    <form class="course-form-step" (ngSubmit)="onSubmit()">
      <div class="course-form-step__header">
        <div>
          <h2>{{ 'COURSE.FORM.TABS.IMAGES' | transloco }}</h2>
          <p>{{ 'COURSE.FORM.DESCRIPTION.IMAGES' | transloco }}</p>
        </div>
        <div class="course-form-step__actions">
          <a mat-stroked-button [routerLink]="['/courses', course.id, 'form']">{{ 'GENERAL.PREVIOUS' | transloco }}</a>
          <button mat-flat-button color="primary" [disabled]="isLoadingCourse || isLoadingImage" type="submit">
            {{ 'GENERAL.SAVE_AND_ADVANCE' | transloco }}
          </button>
        </div>
      </div>

      <div class="course-form-step__content">
        <div class="course-form-step__body">
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
        </div>
      </div>
    </form>
  `,
  styles: [
    `
      .course-form-step {
        display: flex;
        flex-direction: column;
        min-height: calc(100% + 6rem);
        margin: -3rem;
        background: var(--course-form-surface, #f7f1f8);
      }

      .course-form-step__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        height: var(--course-form-column-header-height, 160px);
        padding: 24px 48px;
        background: var(--course-form-surface, #f7f1f8);
        box-sizing: border-box;
      }

      .course-form-step__header > :first-child {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .course-form-step__header h2 {
        margin: 0 0 8px;
        font-size: 1.5rem;
        font-weight: 900;
      }

      .course-form-step__header p {
        margin: 0;
        color: rgb(32 25 40 / 68%);
      }

      .course-form-step__actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        align-self: center;
      }

      .course-form-step__body {
        padding: 48px;
      }

      .course-form-step__content {
        flex: 1;
        border-top: 1px solid var(--course-form-divider, var(--mat-sys-outline-variant));
      }

      @media (width <= 768px) {
        .course-form-step {
          min-height: auto;
        }

        .course-form-step__header,
        .course-form-step__actions {
          flex-direction: column;
          align-items: stretch;
        }

        .course-form-step__header {
          height: auto;
          padding: 24px 16px;
        }

        .course-form-step__body {
          padding: 16px;
        }
      }
    `,
  ],
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
