import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Category, Course, Language } from 'app/main/courses/model';

import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpEditorComponent } from '@keeps-platform-frontend-workspace/ui/kp-editor';
import { KpReplacePipe } from '@keeps-platform-frontend-workspace/ui/kp-replace';

type CourseAssessmentMode = 'FULL' | 'QUIZ';

@Component({
  selector: 'app-course-form-information',
  templateUrl: './course-form-information.component.html',
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
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 48px;
      }

      .course-form-step__content {
        flex: 1;
        border-top: 1px solid var(--course-form-divider, var(--mat-sys-outline-variant));
      }

      .course-form-step__editor-note {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .course-form-step__editor-note strong {
        font-size: 1rem;
        line-height: 1.4;
        color: #241f2a;
      }

      .course-form-step__editor-note p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.5;
        color: rgb(32 25 40 / 72%);
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
    KpEditorComponent,
    KpReplacePipe,
  ],
})
export class CourseFormInformationComponent implements OnInit, OnChanges {
  private readonly fallbackLanguages: Language[] = [
    { name: 'Portugues (Brasil)', value: 'pt-BR' },
    { name: 'English', value: 'en' },
    { name: 'Espanol', value: 'es' },
  ];

  @Input() course!: Course;
  @Input() categories!: Category[];
  @Input() languages!: Language[];
  @Input() isLoadingCourse!: boolean;
  @Output() save = new EventEmitter<any>();

  form!: UntypedFormGroup;
  descriptionEditorValue = '';
  shortDescriptionEditorValue = '';

  private _mission: any;

  constructor(private _formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      category_id: ['', Validators.required],
      lang: ['', Validators.required],
      description: ['', [this.visibleTextMaxLengthValidator(200)]],
      message_description: ['', [this.requiredVisibleTextValidator(), this.visibleTextMaxLengthValidator(120)]],
      assessment_mode: [this.getAssessmentMode(), Validators.required],
    });

    this.syncFormWithCourse();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) {
      return;
    }

    if (changes['course']) {
      this.syncFormWithCourse();
    }

    if (changes['languages'] && !this.form.get('lang')?.value) {
      this.form.patchValue({ lang: this.course?.lang || this.availableLanguages[0]?.value || '' });
    }
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
    return this.getVisibleTextLength(this.form.get('description')?.value);
  }

  get shortDescriptionLength(): number {
    return this.getVisibleTextLength(this.form.get('message_description')?.value);
  }

  get availableLanguages(): Language[] {
    return this.languages?.length ? this.languages : this.fallbackLanguages;
  }

  onDescriptionChanged(value: string): void {
    this.descriptionEditorValue = value;
    this.form.patchValue({ description: value });
    this.form.get('description')?.markAsDirty();
    this.form.get('description')?.markAsTouched();
  }

  onShortDescriptionChanged(value: string): void {
    this.shortDescriptionEditorValue = value;
    this.form.patchValue({ message_description: this.htmlToWhatsAppMarkdown(value) });
    this.form.get('message_description')?.markAsDirty();
    this.form.get('message_description')?.markAsTouched();
  }

  private getAssessmentMode(): CourseAssessmentMode {
    const contentWeight = this.course.content_performance_weight ?? 5;
    const quizWeight = this.course.quiz_performance_weight ?? 5;

    if (contentWeight === 0 && quizWeight === 10) {
      return 'QUIZ';
    }

    return 'FULL';
  }

  private getAssessmentWeights(mode: CourseAssessmentMode): {
    content_performance_weight: number;
    quiz_performance_weight: number;
  } {
    if (mode === 'QUIZ') {
      return { content_performance_weight: 0, quiz_performance_weight: 10 };
    }

    return { content_performance_weight: 5, quiz_performance_weight: 5 };
  }

  private syncFormWithCourse(): void {
    const description = this.course?.description || '';
    const messageDescription = this.course?.message_description || '';

    this.descriptionEditorValue = this.normalizeEditorValue(description);
    this.shortDescriptionEditorValue = this.whatsAppMarkdownToHtml(messageDescription);

    this.form.patchValue({
      name: this.course?.name || '',
      category_id: this.course?.category_id || '',
      lang: this.course?.lang || this.availableLanguages[0]?.value || '',
      description,
      message_description: messageDescription,
      assessment_mode: this.getAssessmentMode(),
    });
  }

  private requiredVisibleTextValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.getVisibleTextLength(control.value) > 0 ? null : { required: true };
    };
  }

  private visibleTextMaxLengthValidator(limit: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const length = this.getVisibleTextLength(control.value);

      if (length <= limit) {
        return null;
      }

      return { maxlength: { requiredLength: limit, actualLength: length } };
    };
  }

  private getVisibleTextLength(value: string | null | undefined): number {
    return this.extractTextContent(value).length;
  }

  private extractTextContent(value: string | null | undefined): string {
    const trimmedValue = value?.trim() || '';

    if (!trimmedValue) {
      return '';
    }

    if (!/<\/?[a-z][\s\S]*>/i.test(trimmedValue)) {
      return this.stripWhatsAppMarkdown(trimmedValue).replace(/\s+/g, ' ').trim();
    }

    const document = new DOMParser().parseFromString(trimmedValue, 'text/html');
    return document.body.textContent?.replace(/\s+/g, ' ').trim() || '';
  }

  private normalizeEditorValue(value: string): string {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return '';
    }

    if (/<\/?[a-z][\s\S]*>/i.test(trimmedValue)) {
      return trimmedValue;
    }

    const escapedValue = trimmedValue
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    return `<p>${escapedValue}</p>`;
  }

  private stripWhatsAppMarkdown(value: string): string {
    return value
      .replace(/```([\s\S]*?)```/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*([^*\n]+)\*/g, '$1')
      .replace(/_([^_\n]+)_/g, '$1')
      .replace(/~([^~\n]+)~/g, '$1')
      .replace(/^\s*>\s?/gm, '')
      .replace(/^\s*[*-]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '');
  }

  private whatsAppMarkdownToHtml(value: string): string {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return '';
    }

    if (/<\/?[a-z][\s\S]*>/i.test(trimmedValue)) {
      return trimmedValue;
    }

    const lines = trimmedValue.split('\n');
    const blocks: string[] = [];
    let currentListType: 'ul' | 'ol' | null = null;
    let listItems: string[] = [];
    let paragraphLines: string[] = [];

    const flushList = () => {
      if (!currentListType || !listItems.length) {
        return;
      }

      blocks.push(`<${currentListType}>${listItems.join('')}</${currentListType}>`);
      currentListType = null;
      listItems = [];
    };

    const flushParagraph = () => {
      if (!paragraphLines.length) {
        return;
      }

      blocks.push(`<p>${paragraphLines.join('<br>')}</p>`);
      paragraphLines = [];
    };

    for (const line of lines) {
      const orderedMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);
      const bulletMatch = line.match(/^\s*[*-]\s+(.*)$/);

      if (!line.trim()) {
        flushList();
        flushParagraph();
        continue;
      }

      if (orderedMatch) {
        flushParagraph();
        if (currentListType !== 'ol') {
          flushList();
          currentListType = 'ol';
        }
        listItems.push(`<li>${this.formatInlineMarkdown(orderedMatch[2])}</li>`);
        continue;
      }

      if (bulletMatch) {
        flushParagraph();
        if (currentListType !== 'ul') {
          flushList();
          currentListType = 'ul';
        }
        listItems.push(`<li>${this.formatInlineMarkdown(bulletMatch[1])}</li>`);
        continue;
      }

      flushList();
      paragraphLines.push(this.formatInlineMarkdown(line));
    }

    flushList();
    flushParagraph();

    return blocks.join('');
  }

  private formatInlineMarkdown(value: string): string {
    const escaped = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return escaped
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/~([^~]+)~/g, '<s>$1</s>');
  }

  private htmlToWhatsAppMarkdown(value: string): string {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return '';
    }

    if (!/<\/?[a-z][\s\S]*>/i.test(trimmedValue)) {
      return trimmedValue;
    }

    const document = new DOMParser().parseFromString(trimmedValue, 'text/html');
    const markdown = this.nodeToMarkdown(document.body)
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      .trim();

    return markdown;
  }

  private nodeToMarkdown(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const element = node as HTMLElement;
    const content = Array.from(element.childNodes)
      .map((child) => this.nodeToMarkdown(child))
      .join('');

    switch (element.tagName.toLowerCase()) {
      case 'strong':
      case 'b':
        return content.trim() ? `*${content}*` : content;
      case 'em':
      case 'i':
        return content.trim() ? `_${content}_` : content;
      case 's':
      case 'strike':
        return content.trim() ? `~${content}~` : content;
      case 'u':
        return content;
      case 'code':
        return content.trim() ? `\`${content}\`` : content;
      case 'a': {
        const href = element.getAttribute('href')?.trim();
        const text = content.trim();

        if (!href) {
          return text;
        }

        if (!text || text === href) {
          return href;
        }

        return `${text} (${href})`;
      }
      case 'br':
        return '\n';
      case 'li':
        return content.trim();
      case 'ul':
        return Array.from(element.children)
          .map((child) => `* ${this.nodeToMarkdown(child).trim()}`)
          .join('\n');
      case 'ol':
        return Array.from(element.children)
          .map((child, index) => `${index + 1}. ${this.nodeToMarkdown(child).trim()}`)
          .join('\n');
      case 'p':
      case 'div':
      case 'blockquote':
        return `${content}\n`;
      default:
        return content;
    }
  }
}
