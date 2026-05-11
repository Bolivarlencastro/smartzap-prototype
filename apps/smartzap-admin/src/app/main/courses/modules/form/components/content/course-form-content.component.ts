import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Content, Course, EVALUATIVE_TYPE_ID, Question } from 'app/main/courses/model';
import {
  EvaluateQuizQuestionDialogComponent,
  SurveyQuizQuestionDialogComponent,
} from 'app/main/courses/modules/form/components';
import { filter, switchMap } from 'rxjs/operators';
import { ExamStateService } from '../../services';
import { EditDialogFormData } from '../edit-dialog/edit-dialog.component';
import { ContentFormData } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpSafeUrlPipe } from '@keeps-platform-frontend-workspace/ui/kp-safe-url';
import { LearnContent } from '@core/model';
import { LearnContentService } from '@core/services';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { QuizQuestionsListComponent } from '../quiz/quiz-questions-list/quiz-questions-list.component';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ContentBlock = {
  id: string;
  category: 'Arquivo' | 'Interação';
  label: string;
  subtitle: string;
  icon: string;
  createType: ContentFormData['type'];
  learnContentType?: string;
  accept?: string;
  defaultName: string;
  emptyTitle: string;
  emptyDescription: string;
};

@Component({
  selector: 'app-course-form-content',
  templateUrl: './course-form-content.component.html',
  styleUrls: ['./course-form-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  imports: [
    MatButton,
    MatFormField,
    MatLabel,
    MatSuffix,
    MatInput,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    QuizQuestionsListComponent,
    MatIcon,
    MatIconButton,
    MatAnchor,
    RouterLink,
    TranslocoPipe,
    CdkDropList,
    CdkDrag,
    KpSafeUrlPipe,
  ],
})
export class CourseFormContentComponent implements OnDestroy {
  @Input() course!: Course;
  @Input() previewUserFirstName = '';
  @Input() previewWorkspaceName = '';
  @Input() set contents(value: Content[]) {
    const previousContents = this.localContents;
    this.localContents = [...value];
    this.applyPendingInsertion(previousContents);
    this.syncSelection();
    this.loadLearnContentPreviews();
  }
  @Input() isDisabled = false;
  @Input() messagesContentEmbed = false;

  localContents: Content[] = [];
  selectedContentId: string | null = null;
  draftName = '';
  draftDescription = '';
  addMenuIndex: number | null = null;
  pendingInsertIndex: number | null = null;
  private readonly autosave$ = new Subject<void>();
  private readonly learnContentPreviewById: Record<string, LearnContent> = {};
  private readonly learnContentRequesting = new Set<string>();
  private readonly localObjectUrls = new Map<string, string>();

  readonly contentBlocks: ContentBlock[] = [
    {
      id: 'video',
      category: 'Arquivo',
      label: 'Vídeo',
      subtitle: 'Envie um vídeo.',
      icon: 'play_circle',
      createType: 'FILE',
      learnContentType: 'VIDEO',
      accept: 'video/*',
      defaultName: 'Novo vídeo',
      emptyTitle: 'Vídeo aguardando upload',
      emptyDescription: 'Selecione um vídeo e ajuste a mensagem que vai conduzir o consumo.',
    },
    {
      id: 'image',
      category: 'Arquivo',
      label: 'Imagem',
      subtitle: 'Envie uma imagem.',
      icon: 'image',
      createType: 'FILE',
      learnContentType: 'IMAGE',
      accept: '',
      defaultName: 'Nova imagem',
      emptyTitle: 'Imagem aguardando upload',
      emptyDescription: 'Envie uma imagem e descreva o contexto que acompanha esse bloco.',
    },
    {
      id: 'podcast',
      category: 'Arquivo',
      label: 'Podcast',
      subtitle: 'Envie um áudio.',
      icon: 'mic',
      createType: 'FILE',
      learnContentType: 'PODCAST',
      accept: 'audio/*',
      defaultName: 'Novo podcast',
      emptyTitle: 'Podcast aguardando upload',
      emptyDescription: 'Envie um áudio e use a descrição para orientar a escuta.',
    },
    {
      id: 'pdf',
      category: 'Arquivo',
      label: 'PDF',
      subtitle: 'Envie um arquivo.',
      icon: 'picture_as_pdf',
      createType: 'FILE',
      learnContentType: 'PDF',
      accept: '.pdf,application/pdf',
      defaultName: 'Novo PDF',
      emptyTitle: 'PDF aguardando upload',
      emptyDescription: 'Envie o arquivo e mostre por que esse material importa na jornada.',
    },
    {
      id: 'evaluative-quiz',
      category: 'Interação',
      label: 'Quiz',
      subtitle: 'Adicione perguntas.',
      icon: 'quiz',
      createType: 'EVALUATIVE_QUIZ',
      defaultName: 'Novo quiz avaliativo',
      emptyTitle: 'Quiz pronto para perguntas',
      emptyDescription: 'Crie perguntas para medir entendimento logo após os conteúdos-chave.',
    },
    {
      id: 'survey-quiz',
      category: 'Interação',
      label: 'Pesquisa',
      subtitle: 'Colete feedback.',
      icon: 'bar_chart',
      createType: 'SURVEY_QUIZ',
      defaultName: 'Nova pesquisa de satisfação',
      emptyTitle: 'Pesquisa pronta para respostas',
      emptyDescription: 'Use perguntas simples para entender a experiência do aluno.',
    },
  ];

  @Output() createContent = new EventEmitter<{
    contentFormData: ContentFormData;
    messagesContentEmbed: boolean;
  }>();
  @Output() removeContent = new EventEmitter<{ id: string }>();
  @Output() editContent = new EventEmitter<{
    id: string;
    data: EditDialogFormData;
  }>();
  @Output() reorderContents = new EventEmitter<Content[]>();

  private readonly _dialog = inject(MatDialog);
  private readonly _examStateService = inject(ExamStateService);
  private readonly _elementRef = inject(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _learnContentService = inject(LearnContentService);
  private readonly _cdr = inject(ChangeDetectorRef);

  constructor() {
    this.autosave$
      .pipe(debounceTime(400), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this.persistSelectedContent());
  }

  ngOnDestroy(): void {
    this.localObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.localObjectUrls.clear();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.selectedContentId) return;

    const clickedInside = this._elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.onCloseDrawer();
      return;
    }

    const target = event.target as HTMLElement;
    const isAction =
      target.closest('.content-item') ||
      target.closest('.content-builder__drawer') ||
      target.closest('.content-builder__add-button') ||
      target.closest('.mat-mdc-menu-panel') ||
      target.closest('.cdk-overlay-pane');

    if (!isAction) {
      this.onCloseDrawer();
    }
  }

  get selectedContent(): Content | null {
    return this.localContents.find((content) => content.id === this.selectedContentId) ?? null;
  }

  get hasSelection(): boolean {
    return !!this.selectedContent;
  }

  get fileBlocks(): ContentBlock[] {
    return this.contentBlocks.filter((block) => block.category === 'Arquivo');
  }

  get interactionBlocks(): ContentBlock[] {
    return this.contentBlocks.filter((block) => block.category === 'Interação');
  }

  onAddBlock(block: ContentBlock, insertAt?: number): void {
    if (this.isDisabled) return;
    this.pendingInsertIndex = insertAt ?? this.localContents.length;

    this.createContent.emit({
      contentFormData: {
        type: block.createType,
        name: block.defaultName,
        value: '',
        description: block.emptyDescription,
        learnContentType: block.learnContentType,
      } as ContentFormData & { learnContentType?: string },
      messagesContentEmbed: this.messagesContentEmbed,
    });
  }

  setAddMenuIndex(insertAt?: number): void {
    this.addMenuIndex = insertAt ?? null;
  }

  onRemoveContent(content: Content): void {
    const { id } = content;
    const dialogRef = this._dialog.open(KpConfirmDialogComponent);

    dialogRef.componentInstance.confirmTitle = 'COURSE.FORM.DIALOG.REMOVE_CONTENT_TITLE';
    dialogRef.componentInstance.confirmMessage = 'COURSE.FORM.DIALOG.REMOVE_CONTENT_MESSAGE';

    if (id) {
      dialogRef
        .afterClosed()
        .pipe(filter((value) => value === true))
        .subscribe(() => this.removeContent.emit({ id }));
    }
  }

  onSelectContent(content: Content): void {
    if (this.selectedContentId === content.id) return;
    this.selectedContentId = content.id || null;
    this.resetDraft(content);
  }

  onCloseDrawer(): void {
    this.selectedContentId = null;
    this.draftName = '';
    this.draftDescription = '';
  }

  onDraftNameChange(value: string): void {
    this.draftName = value;
    this.autosave$.next();
  }

  onDraftDescriptionChange(value: string): void {
    this.draftDescription = value;
    this.autosave$.next();
  }

  onDrawerFileSelected(event: Event, content: Content): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !content.id) return;

    const previousUrl = this.localObjectUrls.get(content.learn_content);
    if (previousUrl) URL.revokeObjectURL(previousUrl);
    const objectUrl = URL.createObjectURL(file);
    this.localObjectUrls.set(content.learn_content, objectUrl);
    this.learnContentPreviewById[content.learn_content] = {
      ...(this.learnContentPreviewById[content.learn_content] || ({} as LearnContent)),
      id: content.learn_content,
      name: file.name,
      url: objectUrl,
    };
    this._cdr.markForCheck();

    this.editContent.emit({
      id: content.id,
      data: {
        name: this.draftName.trim() || content.name || file.name.replace(/\.[^/.]+$/, ''),
        description: this.draftDescription.trim(),
        value: file,
        learn_content: content.learn_content,
        messagesContentEmbed: this.messagesContentEmbed,
        learnContentType: this.getLearnContentType(content),
      },
    });

    input.value = '';
  }

  getContentAccept(content: Content): string | null {
    if (this.isImage(content)) {
      return null;
    }
    if (this.isVideo(content)) {
      return 'video/*,.mp4,.mov,.m4v,.avi,.webm,.mkv';
    }
    if (this.isAudio(content)) {
      return 'audio/*,.mp3,.wav,.m4a,.aac,.ogg';
    }
    if (this.isPdf(content)) {
      return '.pdf,application/pdf';
    }

    return this.contentBlocks.find((block) => block.label === this.getContentBadge(content))?.accept || '*/*';
  }

  getUploadFieldTitle(content: Content): string {
    if (this.isQuiz(content)) return 'Este formato não possui arquivo.';
    return 'Selecione o arquivo do conteúdo.';
  }

  getUploadFieldDescription(content: Content): string {
    if (this.isQuiz(content)) return 'Quiz e pesquisa usam apenas título e descrição.';
    return 'Você pode adicionar ou trocar a mídia depois de montar a timeline.';
  }

  getUploadFieldValue(content: Content): string {
    if (this.isQuiz(content)) return 'Não se aplica a este conteúdo';
    return content.name?.trim() || 'Selecionar arquivo';
  }

  getContentSource(content: Content): string | null {
    const preview = this.learnContentPreviewById[content.learn_content];
    return preview?.url || preview?.link || preview?.blog || null;
  }

  private persistSelectedContent(): void {
    const selectedContent = this.selectedContent;
    if (!selectedContent?.id) return;

    const name = this.draftName.trim();
    const description = this.draftDescription.trim();

    if (!name) return;

    if (name === selectedContent.name && description === (selectedContent.description || '')) {
      return;
    }

    this.editContent.emit({
      id: selectedContent.id,
      data: {
        name,
        description,
      },
    });
  }

  onCreateQuestion({ type_id, learn_content }: Content): void {
    const examId = learn_content;
    const width = window.innerWidth < 599 ? '100%' : '60vw';
    const options = {
      panelClass: 'question-form-dialog',
      data: { action: 'new' },
      width,
      autoFocus: 'dialog',
    };

    let dialogRef: MatDialogRef<EvaluateQuizQuestionDialogComponent | SurveyQuizQuestionDialogComponent>;

    if (type_id === EVALUATIVE_TYPE_ID) {
      dialogRef = this._dialog.open(EvaluateQuizQuestionDialogComponent, options);
    } else {
      dialogRef = this._dialog.open(SurveyQuizQuestionDialogComponent, options);
    }

    dialogRef
      .beforeClosed()
      .pipe(
        filter((question) => !!question),
        switchMap((question: Question) => this._examStateService.createQuestion({ examId, question })),
      )
      .subscribe();
  }

  onDrop(event: CdkDragDrop<Content[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const reordered = [...this.localContents];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);
    this.localContents = reordered;
    this.reorderContents.emit(reordered);
  }

  isQuiz(content: Content): boolean {
    return content.type?.name === 'Question' || content.type?.name === 'Survey Question';
  }

  isEvaluativeQuiz(content: Content): boolean {
    return content.type?.name === 'Question';
  }

  isVideo(content: Content): boolean {
    return content.type?.name === 'video';
  }

  isImage(content: Content): boolean {
    return content.type?.name === 'image';
  }

  isAudio(content: Content): boolean {
    return content.type?.name === 'podcast';
  }

  isPdf(content: Content): boolean {
    return content.type?.name === 'pdf';
  }

  getContentTypeIcon(content: Content): string {
    const typeName = content.type?.name;
    if (typeName === 'video') return 'play_circle';
    if (typeName === 'image') return 'image';
    if (typeName === 'podcast') return 'mic';
    if (typeName === 'pdf') return 'picture_as_pdf';
    if (typeName === 'Question') return 'quiz';
    if (typeName === 'Survey Question') return 'bar_chart';
    return 'description';
  }

  getContentBadge(content: Content): string {
    if (content.type?.name === 'Question') return 'Quiz';
    if (content.type?.name === 'Survey Question') return 'Pesquisa';
    return content.type?.description || content.type?.name || 'Conteúdo';
  }

  getLearnContentType(content: Content): string {
    const typeName = content.type?.name;
    if (typeName === 'video') return 'VIDEO';
    if (typeName === 'image') return 'IMAGE';
    if (typeName === 'podcast') return 'PODCAST';
    if (typeName === 'pdf') return 'PDF';
    if (typeName === 'Question') return 'EVALUATIVE_QUIZ';
    if (typeName === 'Survey Question') return 'SURVEY_QUIZ';
    return 'FILE';
  }

  getContentPreviewTitle(content: Content): string {
    if (content.name?.trim()) return content.name;
    const block = this.contentBlocks.find((item) => item.label === this.getContentBadge(content));
    return block?.emptyTitle || 'Novo conteúdo';
  }

  trackBlock(index: number, block: ContentBlock): string {
    return `${block.category}-${block.id}-${index}`;
  }

  private syncSelection(): void {
    if (!this.localContents.length) {
      this.selectedContentId = null;
      this.draftName = '';
      this.draftDescription = '';
      return;
    }

    const selectedStillExists = this.localContents.some((content) => content.id === this.selectedContentId);
    if (selectedStillExists) {
      const selectedContent = this.selectedContent;
      if (selectedContent) this.resetDraft(selectedContent);
      return;
    }
    this.selectedContentId = null;
    this.draftName = '';
    this.draftDescription = '';
  }

  private resetDraft(content: Content): void {
    this.draftName = content.name || '';
    this.draftDescription = content.description || '';
  }

  private loadLearnContentPreviews(): void {
    this.localContents
      .filter((content) => !this.isQuiz(content) && !!content.learn_content)
      .forEach((content) => {
        const learnContentId = content.learn_content;
        if (this.learnContentPreviewById[learnContentId] || this.learnContentRequesting.has(learnContentId)) return;

        this.learnContentRequesting.add(learnContentId);
        this._learnContentService
          .fetchLearnContent(learnContentId)
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe({
            next: (learnContent) => {
              this.learnContentPreviewById[learnContentId] = learnContent;
              this.learnContentRequesting.delete(learnContentId);
              this._cdr.markForCheck();
            },
            error: () => {
              this.learnContentRequesting.delete(learnContentId);
            },
          });
      });
  }

  private applyPendingInsertion(previousContents: Content[]): void {
    if (this.pendingInsertIndex === null || this.localContents.length <= previousContents.length) {
      return;
    }

    const previousIds = new Set(previousContents.map((content) => content.id));
    const insertedContent =
      this.localContents.find((content) => content.id && !previousIds.has(content.id)) ||
      this.localContents[this.localContents.length - 1];

    if (!insertedContent?.id) {
      this.pendingInsertIndex = null;
      return;
    }

    const currentIndex = this.localContents.findIndex((content) => content.id === insertedContent.id);
    const targetIndex = Math.min(this.pendingInsertIndex, this.localContents.length - 1);

    this.selectedContentId = null;
    this.draftName = '';
    this.draftDescription = '';
    this.pendingInsertIndex = null;

    if (currentIndex === -1 || currentIndex === targetIndex) {
      return;
    }

    const reordered = [...this.localContents];
    moveItemInArray(reordered, currentIndex, targetIndex);
    this.localContents = reordered;
    this.reorderContents.emit(reordered);
  }
}
