import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Category, Course, Language } from 'app/main/courses/model';

import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpReplacePipe } from '@keeps-platform-frontend-workspace/ui/kp-replace';
import { KpWhatsAppMarkdownHelperComponent } from '@keeps-platform-frontend-workspace/ui/kp-whatsapp-markdown-helper';

type CourseAssessmentMode = 'CONTENT' | 'FULL' | 'QUIZ';

@Component({
  selector: 'app-course-form-information',
  templateUrl: './course-form-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatHint,
    MatSelect,
    MatOption,
    MatAnchor,
    RouterLink,
    MatButton,
    TranslocoPipe,
    KpReplacePipe,
    KpWhatsAppMarkdownHelperComponent,
  ],
})
export class CourseFormInformationComponent implements OnInit {
  @Input() course!: Course;
  @Input() categories!: Category[];
  @Input() languages!: Language[];
  @Input() isLoadingCourse!: boolean;
  @Output() save = new EventEmitter<any>();

  form!: UntypedFormGroup;

  private _mission: any;

  constructor(private _formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: [this.course.name || '', [Validators.required, Validators.maxLength(100)]],
      category_id: [this.course.category_id || '', Validators.required],
      lang: [this.course.lang || '', Validators.required],
      description: [this.course.description || '', [Validators.required, Validators.maxLength(200)]],
      message_description: [this.course.message_description || ''],
      assessment_mode: [this.getAssessmentMode(), Validators.required],
    });
  }

  onSubmit(): void {
    const data = this.form.getRawValue();
    const { id } = this.course;
    const { content_performance_weight, quiz_performance_weight } = this.getAssessmentWeights(data.assessment_mode);

    this.save.emit({
      ...data,
      id,
      content_performance_weight,
      quiz_performance_weight,
    });
  }

  @Input() set mission(mission: any) {
    this._mission = mission || {};
    this.form.patchValue({ ...this._mission });
  }

  get mission(): any {
    return this._mission;
  }

  get nameLength(): number {
    return this.form.get('name')?.value?.length || 0;
  }

  get descriptionLength(): number {
    return this.form.get('description')?.value?.length || 0;
  }

  private getAssessmentMode(): CourseAssessmentMode {
    const contentWeight = this.course.content_performance_weight ?? 5;
    const quizWeight = this.course.quiz_performance_weight ?? 5;

    if (contentWeight === 10 && quizWeight === 0) {
      return 'CONTENT';
    }

    if (contentWeight === 0 && quizWeight === 10) {
      return 'QUIZ';
    }

    return 'FULL';
  }

  private getAssessmentWeights(mode: CourseAssessmentMode): {
    content_performance_weight: number;
    quiz_performance_weight: number;
  } {
    if (mode === 'CONTENT') {
      return { content_performance_weight: 10, quiz_performance_weight: 0 };
    }

    if (mode === 'QUIZ') {
      return { content_performance_weight: 0, quiz_performance_weight: 10 };
    }

    return { content_performance_weight: 5, quiz_performance_weight: 5 };
  }
}
