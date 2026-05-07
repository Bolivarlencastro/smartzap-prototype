import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  KpSelectMenuTriggerComponent,
  KpSelectTriggerContentDirective,
} from '@keeps-platform-frontend-workspace/ui/kp-select-menu';
import { debounceTime } from 'rxjs';
import { Category } from '@app/main/courses/model';
import { CoursesFilter } from '@app/main/courses/store/reducers/courses.reducer';

@Component({
  selector: 'kp-course-filter',
  templateUrl: './kp-course-filter.component.html',
  imports: [
    ReactiveFormsModule,
    NgClass,
    MatButton,
    MatSelect,
    MatOption,
    MatIcon,
    KpSelectMenuTriggerComponent,
    KpSelectTriggerContentDirective,
    TranslocoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpCourseFilterComponent implements OnInit {
  readonly filters = input<CoursesFilter>();
  readonly categories = input<Category[]>();
  readonly filterEvent = output<CoursesFilter>();

  protected readonly availableLanguages = ['pt-BR', 'en', 'es'];
  protected readonly availableStatuses = [
    { value: 'CREATING', label: 'STATUS.CREATING' },
    { value: 'REVIEWING', label: 'STATUS.REVIEWING' },
    { value: 'PROCESSING', label: 'STATUS.PROCESSING' },
    { value: 'FINISHED', label: 'STATUS.FINISHED' },
  ];

  protected readonly form = new FormGroup({
    languages: new FormControl<string[]>([]),
    categories: new FormControl<string[]>([]),
    statuses: new FormControl<string[]>([]),
    createdByMe: new FormControl<boolean>(false),
  });

  private readonly destroyRef = inject(DestroyRef);

  get createdByMeActive(): boolean {
    return !!this.form.get('createdByMe')?.value;
  }

  toggleCreatedByMe(): void {
    this.form.patchValue({ createdByMe: !this.createdByMeActive });
  }

  clearCreatedByMe(): void {
    this.form.patchValue({ createdByMe: false });
  }

  ngOnInit(): void {
    const initial = this.filters();
    if (initial) {
      this.form.patchValue(
        {
          languages: initial.languages ?? [],
          categories: initial.categories ?? [],
          statuses: initial.statuses ?? [],
          createdByMe: initial.createdByMe ?? false,
        },
        { emitEvent: false },
      );
    }

    this.form.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ languages, categories, statuses, createdByMe }) => {
        this.filterEvent.emit({
          languages: languages ?? [],
          categories: categories ?? [],
          statuses: statuses ?? [],
          createdByMe: createdByMe ?? false,
        });
      });
  }
}
