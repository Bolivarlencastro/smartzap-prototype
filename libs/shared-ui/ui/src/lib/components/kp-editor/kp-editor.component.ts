import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, OnInit, Optional, output, ViewChild } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageTypes } from '@keeps-platform-frontend-workspace/kp-keeps';
import { ContentChange, CustomModule, QuillEditorComponent, QuillModule, QuillModules } from 'ngx-quill';
import Quill from 'quill';
import { Delta } from 'quill/core';
import KpImageBlocker from './kp-image-blocker';

@Component({
  selector: 'kp-editor',
  imports: [CommonModule, QuillModule, FormsModule, ReactiveFormsModule],
  templateUrl: './kp-editor.component.html',
  styleUrl: './kp-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      deps: [[Optional, FormGroupDirective]],
      useFactory: (directive: FormGroupDirective) => directive,
    },
  ],
})
export class KpEditorComponent implements OnInit {
  private static id = 0;

  placeholder = input<string>('');
  value = input<string>();
  valueChange = output<string>();

  @ViewChild('quillEditor') editor: QuillEditorComponent;
  customModules: CustomModule[] = [{ implementation: KpImageBlocker, path: 'modules/clipboard' }];
  editorValue: string;

  private currentLang: LanguageTypes = 'pt-BR';
  protected quillEditorID: number;
  protected readonly quillModules: QuillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ],
    },
  };
  protected readonly quillFormats = [
    'bold',
    'italic',
    'link',
    'strike',
    'underline',
    'header',
    'indent',
    'list',
    'align',
    'image',
  ];

  get languageClass() {
    return this.currentLang?.toLowerCase();
  }

  constructor(private translocoService: TranslocoService) {
    this.quillEditorID = ++KpEditorComponent.id;
    this.initialConfig();
  }

  ngOnInit() {
    this.currentLang = this.translocoService.getActiveLang() as LanguageTypes;
    this.editorValue = this.value();
  }

  focus(scrollIntoView?: boolean) {
    this.editor?.quillEditor?.focus();

    if (scrollIntoView) {
      this.editor.editorElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onEditorCreated(quill: Quill) {
    quill.clipboard.addMatcher('img', () => {
      return new Delta();
    });
  }

  onContentChanged(event: ContentChange) {
    const formattedContent = this.removeNbsp(event?.html);
    this.valueChange.emit(formattedContent);
  }

  private initialConfig() {
    effect(() => {
      if (!this.value()) {
        this.editorValue = '';
      }
    });
  }

  private removeNbsp(html: string | null): string {
    if (!html) {
      return '';
    }

    return html.replace(/&nbsp;/g, ' ');
  }
}
