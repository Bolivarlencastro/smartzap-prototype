import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslocoPipe } from '@jsverse/transloco';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { constants } from '@keeps-platform-frontend-workspace/ui/constants';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { Store } from '@ngrx/store';
import { formatDistanceToNow } from 'date-fns';
import { filter } from 'rxjs';
import { CommentEditInlineComponent } from '../comment-edit-inline/comment-edit-inline.component';
import { PulseDetailsApiComment } from '../../models/pulse-details';
import { PulseDetailsActions } from '../../store';

@Component({
  selector: 'app-pulse-details-comments',
  imports: [CommentEditInlineComponent, MatIconModule, MatMenu, MatMenuItem, MatMenuTrigger, TranslocoPipe],
  templateUrl: './pulse-details-comments.component.html',
  styleUrl: './pulse-details-comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseDetailsCommentsComponent {
  readonly comments = input.required<PulseDetailsApiComment[]>();

  readonly editingCommentId = signal<string | null>(null);
  readonly editingText = signal('');

  readonly commentsWithTime = computed(() =>
    this.comments().map((c) => ({
      ...c,
      relativeTime: formatDistanceToNow(new Date(c.created_date), { addSuffix: true }),
    })),
  );

  readonly defaultUserAvatar = constants.defaultUserAvatar;

  private readonly store = inject(Store);
  private readonly userProfileService = inject(UserProfileService);
  private readonly dialog = inject(MatDialog);

  readonly isCurator = this.userProfileService.isCurator();
  readonly currentUser = toSignal(this.userProfileService.profile$);

  canEditComment(comment: PulseDetailsApiComment): boolean {
    return comment.user?.id === this.currentUser()?.id;
  }

  canDeleteComment(comment: PulseDetailsApiComment): boolean {
    return this.isCurator || comment.user?.id === this.currentUser()?.id;
  }

  hasCommentMenu(comment: PulseDetailsApiComment): boolean {
    return this.canEditComment(comment) || this.canDeleteComment(comment);
  }

  startEdit(comment: PulseDetailsApiComment): void {
    this.editingCommentId.set(comment.id);
    this.editingText.set(comment.comment);
  }

  cancelEdit(): void {
    this.editingCommentId.set(null);
    this.editingText.set('');
  }

  confirmEdit(comment: PulseDetailsApiComment): void {
    const text = this.editingText().trim();
    if (!text) return;
    this.store.dispatch(PulseDetailsActions.editComment({ commentId: comment.id, text }));
    this.cancelEdit();
  }

  openDeleteDialog(comment: PulseDetailsApiComment): void {
    const dialogRef = this.dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRef.componentInstance.confirmTitle = 'PULSES_FEED.PULSE_CARD.COMMENT_MENU.DELETE_TITLE';
    dialogRef.componentInstance.confirmMessage = 'PULSES_FEED.PULSE_CARD.COMMENT_MENU.DELETE_MESSAGE';
    dialogRef.componentInstance.positiveButtonLabel = 'PULSES_FEED.PULSE_CARD.COMMENT_MENU.DELETE_CONFIRM';

    dialogRef
      .afterClosed()
      .pipe(filter((value) => value === true))
      .subscribe(() => {
        this.store.dispatch(PulseDetailsActions.deleteComment({ commentId: comment.id }));
      });
  }
}
