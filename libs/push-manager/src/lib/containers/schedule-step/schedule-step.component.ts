import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoPipe } from '@jsverse/transloco';
import { SmartzapCourse } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs';
import { ScheduleForm } from '../../models/creation';
import { CreationActions } from '../../store';

export type BondType = 'course' | 'campaign';

@Component({
  selector: 'pm-schedule-step',
  imports: [
    TranslocoPipe,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    FormsModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  template: `
    <form [formGroup]="form()" class="mt-1">
      <div class="form-container">
        <span class="label">{{ 'PUSH_MANAGER.CREATION.SCHEDULE.TITLE' | transloco }}</span>
        <div class="flex gap-4 mb-4">
          <div class="bond-type-button" [class.selected]="isCourseType()" (click)="setBondType('course')">
            <span class="type-name">{{ 'PUSH_MANAGER.CREATION.SCHEDULE.COURSE' | transloco }}</span>
          </div>
          <div class="bond-type-button" [class.selected]="!isCourseType()" (click)="setBondType('campaign')">
            <span class="type-name">{{ 'PUSH_MANAGER.CREATION.SCHEDULE.CAMPAIGN' | transloco }}</span>
          </div>
        </div>

        @if (isCourseType()) {
          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label class="label">{{ 'PUSH_MANAGER.CREATION.SCHEDULE.TARGET_COURSE' | transloco }}</mat-label>
            <input matInput [matAutocomplete]="auto" [formControl]="courseSearchControl" required />
            <mat-icon matSuffix>search</mat-icon>
            <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayCourseName">
              @for (course of courses(); track course.id) {
                <mat-option [value]="course">
                  {{ course.name }}
                </mat-option>
              }
            </mat-autocomplete>
          </mat-form-field>
        } @else {
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="mb-4">
            <mat-label class="label">{{ 'PUSH_MANAGER.CREATION.SCHEDULE.CAMPAIGN_NAME' | transloco }}</mat-label>
            <input matInput formControlName="campaign" />
          </mat-form-field>
        }

        <div class="flex gap-2">
          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label class="label">{{ 'PUSH_MANAGER.CREATION.SCHEDULE.DATE' | transloco }}</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" />
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label class="label">{{ 'PUSH_MANAGER.CREATION.SCHEDULE.HOUR' | transloco }}</mat-label>
            <input matInput type="time" formControlName="hour" />
          </mat-form-field>
        </div>
      </div>

      <div class="w-full pt-2 flex justify-end gap-1">
        <button matButton matStepperPrevious class="text-xs">{{ 'PUSH_MANAGER.CREATION.GO_BACK' | transloco }}</button>
        <button matButton="filled" matStepperNext [disabled]="form()?.invalid" class="text-xs">
          {{ 'PUSH_MANAGER.CREATION.NEXT' | transloco }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .form-container {
        @apply p-8 flex flex-col gap-2 border border-default rounded-xl mx-auto;

        width: 28rem;
      }

      .label {
        @apply text-xs font-bold opacity-75;
      }

      .bond-type-button {
        @apply flex items-center justify-center border border-default rounded-xl w-full cursor-pointer h-11;

        .type-name {
          @apply text-xs opacity-75;
        }

        &.selected {
          border: 2px solid var(--mat-sys-primary);
          color: var(--mat-sys-primary);
          background-color: var(--mat-sys-primary-container);

          .type-name {
            @apply opacity-100 font-bold;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleStepComponent {
  form = model<FormGroup<ScheduleForm>>();
  courses = input<SmartzapCourse[]>();

  bondType = signal<BondType>('course');
  isCourseType = computed(() => this.bondType() === 'course');
  courseSearchControl = new FormControl<string | SmartzapCourse>('');

  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly store: Store) {
    this.registerCourseAc();
    this.initBondTypeListener();
  }

  setBondType(type: BondType) {
    this.bondType.set(type);
  }

  displayCourseName(course: SmartzapCourse): string {
    return course?.name || '';
  }

  private initBondTypeListener() {
    effect(() => {
      const type = this.bondType();
      const courseIdControl = this.form()?.get('courseId');
      const campaignControl = this.form()?.get('campaign');

      this.form().reset();

      courseIdControl.clearValidators();
      campaignControl.clearValidators();

      if (type === 'course') {
        this.courseSearchControl.reset();
        this.fetchCourses();
        courseIdControl.setValidators([Validators.required]);
      } else {
        campaignControl.setValidators([Validators.required]);
      }

      courseIdControl.updateValueAndValidity();
      campaignControl.updateValueAndValidity();
    });
  }

  private registerCourseAc() {
    this.courseSearchControl.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (typeof value === 'string') {
          this.form()?.get('courseId')?.setValue(null);
          this.fetchCourses(value);
        }

        if (value && typeof value === 'object') {
          this.form()?.get('courseId')?.setValue(value.id);
        }
      });
  }

  private fetchCourses(term?: string) {
    this.store.dispatch(CreationActions.loadCourses({ term }));
  }
}
