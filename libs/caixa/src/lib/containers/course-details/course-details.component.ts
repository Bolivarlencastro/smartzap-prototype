import { DatePipe, DOCUMENT } from '@angular/common';
import { Component, computed, Inject, OnDestroy, Renderer2, Signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  CaixaCourse,
  CaixaSmartZapCourseEnrollmentDto,
  EnrollmentStatuses,
} from '@keeps-platform-frontend-workspace/kp-keeps';
import { RouteDetailDialogWrapper } from '@keeps-platform-frontend-workspace/ui/kp-route-detail-dialog-wrapper';
import { CourseListFacade } from '../../facades/course-list.facade';
import { KpCardTagComponent } from '@keeps-platform-frontend-workspace/ui/kp-card-tag';
import { LearnContentCardTag } from '@keeps-platform-frontend-workspace/ui/models';

@Component({
  selector: 'cx-course-details',
  imports: [MatIcon, MatIconButton, MatDialogModule, DatePipe, MatButton, KpCardTagComponent],
  template: `
    @let currentCourse = course();
    @let enrollment = courseEnrollment();
    <div
      class="h-72 w-full flex justify-end items-start bg-cover rounded-t-[16px] relative"
      [style.backgroundImage]="'url(' + currentCourse?.holder_image + ')'"
    >
      <button
        mat-icon-button
        mat-dialog-close
        class="bg-black bg-opacity-0 hover:bg-opacity-25 transition m-3 text-white"
      >
        <mat-icon>close</mat-icon>
      </button>
      <div class="absolute flex gap-2.5 bottom-7 right-7">
        @if (enrollment) {
          <kp-card-tag
            [dotColor]="enrollment?.tag.dotColor"
            [label]="enrollment?.tag.label"
            [keepOpen]="true"
          ></kp-card-tag>
        }
      </div>
    </div>
    <div class="p-7 w-full grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-5 min-h-48">
      <div class="flex flex-col">
        <span class="text-xl font-bold">{{ currentCourse?.name }}</span>
        <div class="text-xs flex gap-1 text-secondary">
          <span>Categoria: {{ currentCourse?.category.name }}</span>
          &vert;
          <span>Criado em: {{ currentCourse?.created | date: 'dd/MM/yyyy' }}</span>
        </div>
      </div>
      <span class="text-sm sm:col-span-2">{{ currentCourse?.description }}</span>
      <div class="sm:col-start-2 sm:row-start-1">
        @if (canCancelEnrollment()) {
          <button matButton="filled" class="min-w-full sm:min-w-0" (click)="cancelEnrollment()">
            Cancelar matrícula
          </button>
        } @else {
          <button matButton="filled" class="min-w-full sm:min-w-0" (click)="onEnroll()">Matricular-se</button>
        }
      </div>
    </div>
  `,
})
export class CourseDetailsComponent extends RouteDetailDialogWrapper<CourseDetailsComponent> implements OnDestroy {
  protected readonly course: Signal<CaixaCourse>;
  protected readonly courseEnrollment: Signal<{
    enrollment: CaixaSmartZapCourseEnrollmentDto;
    tag: LearnContentCardTag;
  }>;
  protected readonly canCancelEnrollment = computed(() => {
    const enrollment = this.courseEnrollment()?.enrollment;
    return enrollment?.status && enrollment.status !== EnrollmentStatuses.COMPLETED;
  });

  constructor(
    @Inject(DOCUMENT) protected override _document: Document,
    protected override _renderer2: Renderer2,
    protected override dialogRef: MatDialogRef<CourseDetailsComponent>,
    private readonly courseListFacade: CourseListFacade,
  ) {
    super(_document, _renderer2, dialogRef);
    this.course = courseListFacade.currentOpenCourse;
    this.courseEnrollment = courseListFacade.currentCourseEnrollment;
  }

  onEnroll() {
    this.courseListFacade.dispatchAction({ actionId: 'enroll', courseId: this.course().id });
  }

  cancelEnrollment() {
    this.courseListFacade.openEnrollmentCancelConfirmationDialog();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.courseListFacade.detailsDialogClosed();
  }
}
