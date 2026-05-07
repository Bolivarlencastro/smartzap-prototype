jest.mock('emoji-picker-element', () => ({}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { PulseCommentsComponent } from './pulse-comments.component';
import { Pulse, PulseComment } from '../../models/pulse';
import { PulsesListActions } from '../../store';

const mockComment: PulseComment = {
  id: 'c-1',
  avatar: 'https://example.com/avatar.png',
  name: 'Alice Johnson',
  user_id: 'user-alice',
  comment: 'Great pulse!',
  created_at: new Date('2026-01-01T10:00:00.000Z').toISOString(),
};

const mockPulse: Pulse = {
  id: 'pulse-1',
  name: 'Test Pulse',
  description: 'Test description',
  cover_image: 'https://assets.keepsdev.com/images/placeholders/v2/pulse.png',
  channel_id: 'ch-1',
  channel_name: 'Test Channel',
  channel_subscription_id: 'sub-123',
  created_date: new Date('2026-01-01T10:00:00.000Z').toISOString(),
  creator_name: 'Bob Smith',
  pulse_type: { id: 'video', name: 'Video' },
  bookmark_id: '',
  is_active: true,
  duration: 300,
  comments_count: 0,
  comments: [],
  is_channel_manager: false,
};

const mockUserProfile = {
  id: 'user-current',
  name: 'Current User',
  avatar: 'https://example.com/current-avatar.png',
};

describe('PulseCommentsComponent', () => {
  let component: PulseCommentsComponent;
  let fixture: ComponentFixture<PulseCommentsComponent>;
  let store: MockStore;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PulseCommentsComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore(),
        {
          provide: UserProfileService,
          useValue: { profile$: of(mockUserProfile), isCurator: () => false },
        },
        {
          provide: MatDialog,
          useValue: { open: jest.fn() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog);
    jest.spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PulseCommentsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pulse', mockPulse);
    fixture.detectChanges();
  });

  describe('canPublish', () => {
    it('should be false when commentText is empty', () => {
      component.commentText.set('');
      expect(component.canPublish()).toBe(false);
    });

    it('should be false when commentText contains only whitespace', () => {
      component.commentText.set('   ');
      expect(component.canPublish()).toBe(false);
    });

    it('should be true when commentText has content', () => {
      component.commentText.set('Hello!');
      expect(component.canPublish()).toBe(true);
    });

    it('should be false when commentText exceeds 500 characters', () => {
      component.commentText.set('a'.repeat(501));
      expect(component.canPublish()).toBe(false);
    });
  });

  describe('charCount', () => {
    it('should return 0 when commentText is empty', () => {
      component.commentText.set('');
      expect(component.charCount()).toBe(0);
    });

    it('should return the length of commentText', () => {
      component.commentText.set('hello');
      expect(component.charCount()).toBe(5);
    });
  });

  describe('isOverLimit', () => {
    it('should be false when text is within the 500-character limit', () => {
      component.commentText.set('hello');
      expect(component.isOverLimit()).toBe(false);
    });

    it('should be false when text is exactly 500 characters', () => {
      component.commentText.set('a'.repeat(500));
      expect(component.isOverLimit()).toBe(false);
    });

    it('should be true when text exceeds 500 characters', () => {
      component.commentText.set('a'.repeat(501));
      expect(component.isOverLimit()).toBe(true);
    });
  });

  describe('commentsWithTime', () => {
    it('should return empty array when pulse has no comments', () => {
      expect(component.commentsWithTime()).toEqual([]);
    });

    it('should map comments and add relativeTime', () => {
      fixture.componentRef.setInput('pulse', { ...mockPulse, comments: [mockComment] });

      const result = component.commentsWithTime();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockComment.id);
      expect(result[0].comment).toBe(mockComment.comment);
      expect(result[0].relativeTime).toBeDefined();
      expect(typeof result[0].relativeTime).toBe('string');
    });
  });

  describe('showAllComments', () => {
    it('should default to false', () => {
      expect(component.showAllComments()).toBe(false);
    });

    it('should be set to true when clicked', () => {
      component.showAllComments.set(true);
      expect(component.showAllComments()).toBe(true);
    });
  });

  describe('showComments', () => {
    it('should set showAllComments to true', () => {
      component.showComments();
      expect(component.showAllComments()).toBe(true);
    });

    it('should dispatch loadPulseComments when pulse has no comments', () => {
      component.showComments();
      expect(store.dispatch).toHaveBeenCalledWith(PulsesListActions.loadPulseComments({ pulseId: mockPulse.id }));
    });

    it('should not dispatch loadPulseComments when pulse already has comments', () => {
      fixture.componentRef.setInput('pulse', { ...mockPulse, comments: [mockComment] });
      component.showComments();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('publish', () => {
    it('should not dispatch when commentText is empty', () => {
      component.commentText.set('');
      component.publish();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when commentText is only whitespace', () => {
      component.commentText.set('   ');
      component.publish();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch submitComment with trimmed text and current user info', () => {
      component.commentText.set('  My comment  ');
      component.publish();

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: PulsesListActions.submitComment.type,
          pulseId: mockPulse.id,
          text: 'My comment',
          displayComment: expect.objectContaining({
            comment: 'My comment',
            name: mockUserProfile.name,
            avatar: mockUserProfile.avatar,
            user_id: mockUserProfile.id,
          }),
        }),
      );
    });

    it('should clear commentText after publishing', () => {
      component.commentText.set('Hello!');
      component.publish();
      expect(component.commentText()).toBe('');
    });

    it('should set showAllComments to true after publishing', () => {
      component.commentText.set('Hello!');
      component.publish();
      expect(component.showAllComments()).toBe(true);
    });
  });

  describe('canEditComment', () => {
    it('should return true when comment belongs to current user', () => {
      const comment: PulseComment = { ...mockComment, user_id: mockUserProfile.id };
      expect(component.canEditComment(comment)).toBe(true);
    });

    it('should return false when comment belongs to another user', () => {
      const comment: PulseComment = { ...mockComment, user_id: 'other-user' };
      expect(component.canEditComment(comment)).toBe(false);
    });
  });

  describe('canDeleteComment', () => {
    it('should return true when comment belongs to current user', () => {
      const comment: PulseComment = { ...mockComment, user_id: mockUserProfile.id };
      expect(component.canDeleteComment(comment)).toBe(true);
    });

    it('should return false when comment belongs to another user and user is not curator', () => {
      const comment: PulseComment = { ...mockComment, user_id: 'other-user' };
      expect(component.canDeleteComment(comment)).toBe(false);
    });
  });

  describe('hasCommentMenu', () => {
    it('should return true when user can edit the comment', () => {
      const comment: PulseComment = { ...mockComment, user_id: mockUserProfile.id };
      expect(component.hasCommentMenu(comment)).toBe(true);
    });

    it('should return false when user cannot edit or delete the comment', () => {
      const comment: PulseComment = { ...mockComment, user_id: 'other-user' };
      expect(component.hasCommentMenu(comment)).toBe(false);
    });
  });

  describe('startEdit', () => {
    it('should set editingCommentId and editingText', () => {
      component.startEdit(mockComment);
      expect(component.editingCommentId()).toBe(mockComment.id);
      expect(component.editingText()).toBe(mockComment.comment);
    });
  });

  describe('cancelEdit', () => {
    it('should clear editingCommentId and editingText', () => {
      component.startEdit(mockComment);
      component.cancelEdit();
      expect(component.editingCommentId()).toBeNull();
      expect(component.editingText()).toBe('');
    });
  });

  describe('confirmEdit', () => {
    it('should not dispatch when editingText is empty', () => {
      component.startEdit({ ...mockComment, comment: '' });
      component.confirmEdit(mockComment);
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch editComment with trimmed text', () => {
      component.editingText.set('  Updated comment  ');
      component.confirmEdit(mockComment);

      expect(store.dispatch).toHaveBeenCalledWith(
        PulsesListActions.editComment({
          pulseId: mockPulse.id,
          commentId: mockComment.id,
          text: 'Updated comment',
        }),
      );
    });

    it('should cancel edit after confirming', () => {
      component.editingText.set('Updated');
      component.confirmEdit(mockComment);
      expect(component.editingCommentId()).toBeNull();
      expect(component.editingText()).toBe('');
    });
  });

  describe('openDeleteDialog', () => {
    it('should open a dialog', () => {
      const mockDialogRef = { componentInstance: {}, afterClosed: () => of(false) };
      (dialog.open as jest.Mock).mockReturnValue(mockDialogRef);

      component.openDeleteDialog(mockComment);

      expect(dialog.open).toHaveBeenCalled();
    });

    it('should dispatch deleteComment when dialog confirms', () => {
      const mockDialogRef = { componentInstance: {}, afterClosed: () => of(true) };
      (dialog.open as jest.Mock).mockReturnValue(mockDialogRef);

      component.openDeleteDialog(mockComment);

      expect(store.dispatch).toHaveBeenCalledWith(
        PulsesListActions.deleteComment({ pulseId: mockPulse.id, commentId: mockComment.id }),
      );
    });

    it('should not dispatch deleteComment when dialog is dismissed', () => {
      const mockDialogRef = { componentInstance: {}, afterClosed: () => of(false) };
      (dialog.open as jest.Mock).mockReturnValue(mockDialogRef);

      component.openDeleteDialog(mockComment);

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
