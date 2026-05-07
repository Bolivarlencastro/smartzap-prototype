import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { KpPluralizeTranslatePipe } from '@keeps-platform-frontend-workspace/ui/kp-pluralize-translate';
import { Store } from '@ngrx/store';
import { formatDistanceToNow } from 'date-fns';
import { filter } from 'rxjs';
import { CommentEditInlineComponent } from '../comment-edit-inline/comment-edit-inline.component';
import { Pulse, PulseComment } from '../../models/pulse';
import { PulsesListActions } from '../../store';
import { initEmojiPicker } from '../../utils/emoji-picker.util';

@Component({
  selector: 'app-pulse-comments',
  imports: [
    CommentEditInlineComponent,
    FormsModule,
    MatButton,
    MatIconButton,
    MatIconModule,
    MatMenu,
    MatMenuContent,
    MatMenuItem,
    MatMenuTrigger,
    TranslocoPipe,
    KpPluralizeTranslatePipe,
  ],
  templateUrl: './pulse-comments.component.html',
  styleUrl: './pulse-comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseCommentsComponent {
  pulse = input.required<Pulse>();

  showAllComments = signal(false);
  commentText = signal('');
  editingCommentId = signal<string | null>(null);
  editingText = signal('');

  readonly maxChars = 500;
  readonly charCount = computed(() => this.commentText().length);
  readonly isOverLimit = computed(() => this.charCount() > this.maxChars);
  canPublish = computed(() => this.commentText().trim().length > 0 && !this.isOverLimit());

  commentsWithTime = computed(() =>
    (this.pulse().comments ?? []).map((c) => ({
      ...c,
      relativeTime: formatDistanceToNow(new Date(c.created_at), { addSuffix: true }),
    })),
  );

  protected readonly defaultUserAvatar = constants.defaultUserAvatar;

  private readonly store = inject(Store);
  private readonly userProfileService = inject(UserProfileService);
  private readonly dialog = inject(MatDialog);
  private readonly emojiPickerContainer = viewChild<ElementRef<HTMLDivElement>>('emojiPickerContainer');

  readonly isCurator = this.userProfileService.isCurator();
  currentUser = toSignal(this.userProfileService.profile$);

  constructor() {
    initEmojiPicker(this.emojiPickerContainer, (emoji) => {
      if (this.charCount() < this.maxChars) {
        this.commentText.update((t) => t + emoji);
      }
    });
  }

  showComments(): void {
    this.showAllComments.set(true);
    if (!this.pulse().comments?.length) {
      this.store.dispatch(PulsesListActions.loadPulseComments({ pulseId: this.pulse().id }));
    }
  }

  publish(): void {
    const text = this.commentText().trim();
    if (!text) return;

    const user = this.currentUser();
    const displayComment: PulseComment = {
      id: `c-${Date.now()}`,
      avatar: user?.avatar ?? '',
      name: user?.name ?? '',
      user_id: user?.id ?? '',
      comment: text,
      created_at: new Date().toISOString(),
    };

    this.store.dispatch(PulsesListActions.submitComment({ pulseId: this.pulse().id, text, displayComment }));
    this.commentText.set('');
    this.showAllComments.set(true);
  }

  canEditComment(comment: PulseComment): boolean {
    return comment.user_id === this.currentUser()?.id;
  }

  canDeleteComment(comment: PulseComment): boolean {
    return this.isCurator || comment.user_id === this.currentUser()?.id;
  }

  hasCommentMenu(comment: PulseComment): boolean {
    return this.canEditComment(comment) || this.canDeleteComment(comment);
  }

  startEdit(comment: PulseComment): void {
    this.editingCommentId.set(comment.id);
    this.editingText.set(comment.comment);
  }

  cancelEdit(): void {
    this.editingCommentId.set(null);
    this.editingText.set('');
  }

  confirmEdit(comment: PulseComment): void {
    const text = this.editingText().trim();
    if (!text) return;
    this.store.dispatch(PulsesListActions.editComment({ pulseId: this.pulse().id, commentId: comment.id, text }));
    this.cancelEdit();
  }

  openDeleteDialog(comment: PulseComment): void {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRef.componentInstance.confirmTitle = 'PULSES_FEED.PULSE_CARD.COMMENT_MENU.DELETE_TITLE';
    dialogRef.componentInstance.confirmMessage = 'PULSES_FEED.PULSE_CARD.COMMENT_MENU.DELETE_MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel = 'PULSES_FEED.PULSE_CARD.COMMENT_MENU.DELETE_CONFIRM';

    dialogRef
      .afterClosed()
      .pipe(filter((value) => value === true))
      .subscribe(() => {
        this.store.dispatch(PulsesListActions.deleteComment({ pulseId: this.pulse().id, commentId: comment.id }));
      });
  }
}
