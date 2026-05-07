import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Course } from 'app/main/courses/model';

@Component({
  selector: 'app-course-form-settings',
  template: `
    <form [formGroup]="form" class="flex flex-col gap-2" (ngSubmit)="onSubmit()">
      <div class="flex items-start justify-between gap-4 w-full mb-4">
        <div>
          <h2 class="text-2xl font-black mb-2">{{ 'COURSE.FORM.TABS.CONFIGURATIONS' | transloco }}</h2>
          <p>{{ 'COURSE.FORM.NAVIGATION.CONFIGURATIONS' | transloco }}</p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <a mat-stroked-button [routerLink]="['/courses', course.id, 'form', 'images']">{{
            'GENERAL.PREVIOUS' | transloco
          }}</a>
          <button mat-flat-button color="primary" [disabled]="form.invalid || isLoadingCourse" type="submit">
            {{ 'GENERAL.SAVE_AND_ADVANCE' | transloco }}
          </button>
        </div>
      </div>

      <div class="settings-container w-full">
        <div class="flex w-full justify-between items-center">
          <span>{{ 'COURSE.FORM.INPUT.IS_ACTIVE' | transloco }}</span>
          <mat-slide-toggle color="accent" formControlName="is_active" aria-label="Ativo" id="toggle-form-active">
          </mat-slide-toggle>
        </div>

        <div class="flex w-full justify-between items-center">
          <span>{{ 'COURSE.FORM.INPUT.DISABLE_SENDING_CERTIFICATE' | transloco }}</span>
          <mat-slide-toggle
            color="accent"
            formControlName="disable_send_certificate"
            aria-label="disable sending certificate"
            id="toggle-disable-sending-certificate"
          >
          </mat-slide-toggle>
        </div>
      </div>
    </form>
  `,
  styles: [
    `
      .settings-container > * {
        @apply border-b last:border-b-0 border-default min-h-20 pr-4;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, MatAnchor, MatButton, MatSlideToggle, RouterLink, TranslocoPipe],
})
export class CourseFormSettingsComponent implements OnInit {
  @Input() course!: Course;
  @Input() isLoadingCourse!: boolean;
  @Output() save = new EventEmitter<Partial<Course>>();

  form!: UntypedFormGroup;

  constructor(private readonly formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      is_active: [this.course.is_active],
      disable_send_certificate: [this.course.disable_send_certificate],
    });
  }

  onSubmit(): void {
    const { id } = this.course;
    this.save.emit({ id, ...this.form.getRawValue() });
  }
}
