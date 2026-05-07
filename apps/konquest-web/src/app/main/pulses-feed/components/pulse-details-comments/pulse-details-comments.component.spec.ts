jest.mock('emoji-picker-element', () => ({}));

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { UserProfileService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { PulseDetailsApiComment } from '../../models/pulse-details';
import { PulseDetailsActions } from '../../store';
import { PulseDetailsCommentsComponent } from './pulse-details-comments.component';

const mockUser = { id: 'user-1', name: 'Alice', avatar: '' };

const makeComment = (overrides: Partial<PulseDetailsApiComment> = {}): PulseDetailsApiComment => ({
  id: 'c-1',
  comment: 'Hello world',
  pulse: null,
  user: { id: 'user-1', name: 'Alice', avatar: '' } as any,
  created_date: new Date('2025-01-01T10:00:00Z').toISOString(),
  ...overrides,
});

const mockUserProfileService = {
  isCurator: jest.fn().mockReturnValue(false),
  profile$: of(mockUser),
};

const mockDialogRef = {
  afterClosed: jest.fn(),
  componentInstance: {} as any,
};

const mockDialog = {
  open: jest.fn().mockReturnValue(mockDialogRef),
};

describe('PulseDetailsCommentsComponent', () => {
  let component: PulseDetailsCommentsComponent;
  let fixture: ComponentFixture<PulseDetailsCommentsComponent>;
  let store: MockStore;

  const setupComponent = (comments: PulseDetailsApiComment[] = []) => {
    fixture = TestBed.createComponent(PulseDetailsCommentsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('comments', comments);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    mockUserProfileService.isCurator.mockReturnValue(false);
    mockDialogRef.afterClosed.mockReturnValue(of(false));
    mockDialogRef.componentInstance = {};

    await TestBed.configureTestingModule({
      imports: [PulseDetailsCommentsComponent, getTranslocoTestingModule()],
      providers: [
        provideMockStore(),
        { provide: UserProfileService, useValue: mockUserProfileService },
        { provide: MatDialog, useValue: mockDialog },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    setupComponent();
    expect(component).toBeTruthy();
  });

  describe('commentsWithTime', () => {
    it('should map comments with a relativeTime string', () => {
      const comment = makeComment();
      setupComponent([comment]);

      const result = component.commentsWithTime();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(comment.id);
      expect(typeof result[0].relativeTime).toBe('string');
      expect(result[0].relativeTime.length).toBeGreaterThan(0);
    });

    it('should return an empty array when there are no comments', () => {
      setupComponent([]);
      expect(component.commentsWithTime()).toEqual([]);
    });
  });

  describe('canEditComment', () => {
    beforeEach(() => setupComponent());

    it('should return true when the comment belongs to the current user', () => {
      const comment = makeComment({ user: { id: 'user-1' } as any });
      expect(component.canEditComment(comment)).toBe(true);
    });

    it('should return false when the comment belongs to a different user', () => {
      const comment = makeComment({ user: { id: 'user-99' } as any });
      expect(component.canEditComment(comment)).toBe(false);
    });
  });

  describe('canDeleteComment', () => {
    it('should return true when the comment belongs to the current user', () => {
      setupComponent();
      const comment = makeComment({ user: { id: 'user-1' } as any });
      expect(component.canDeleteComment(comment)).toBe(true);
    });

    it('should return false when comment belongs to another user and user is not curator', () => {
      setupComponent();
      const comment = makeComment({ user: { id: 'user-99' } as any });
      expect(component.canDeleteComment(comment)).toBe(false);
    });

    it('should return true when user is a curator regardless of comment ownership', () => {
      mockUserProfileService.isCurator.mockReturnValue(true);
      setupComponent();
      const comment = makeComment({ user: { id: 'user-99' } as any });
      expect(component.canDeleteComment(comment)).toBe(true);
    });
  });

  describe('hasCommentMenu', () => {
    beforeEach(() => setupComponent());

    it('should return true when user can edit the comment', () => {
      const comment = makeComment({ user: { id: 'user-1' } as any });
      expect(component.hasCommentMenu(comment)).toBe(true);
    });

    it('should return false when user can neither edit nor delete', () => {
      const comment = makeComment({ user: { id: 'user-99' } as any });
      expect(component.hasCommentMenu(comment)).toBe(false);
    });
  });

  describe('startEdit', () => {
    beforeEach(() => setupComponent());

    it('should set editingCommentId to the comment id', () => {
      const comment = makeComment({ id: 'c-42' });
      component.startEdit(comment);
      expect(component.editingCommentId()).toBe('c-42');
    });

    it('should set editingText to the comment text', () => {
      const comment = makeComment({ comment: 'Original text' });
      component.startEdit(comment);
      expect(component.editingText()).toBe('Original text');
    });
  });

  describe('cancelEdit', () => {
    beforeEach(() => setupComponent());

    it('should reset editingCommentId to null', () => {
      component.editingCommentId.set('c-1');
      component.cancelEdit();
      expect(component.editingCommentId()).toBeNull();
    });

    it('should reset editingText to empty string', () => {
      component.editingText.set('some text');
      component.cancelEdit();
      expect(component.editingText()).toBe('');
    });
  });

  describe('confirmEdit', () => {
    beforeEach(() => setupComponent());

    it('should dispatch editComment with the trimmed text', () => {
      component.editingText.set('  Updated text  ');
      const comment = makeComment({ id: 'c-1' });

      component.confirmEdit(comment);

      expect(store.dispatch).toHaveBeenCalledWith(
        PulseDetailsActions.editComment({ commentId: 'c-1', text: 'Updated text' }),
      );
    });

    it('should reset editing state after dispatching', () => {
      component.editingCommentId.set('c-1');
      component.editingText.set('Updated text');

      component.confirmEdit(makeComment());

      expect(component.editingCommentId()).toBeNull();
      expect(component.editingText()).toBe('');
    });

    it('should not dispatch when editingText is empty', () => {
      component.editingText.set('');
      component.confirmEdit(makeComment());
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch when editingText is only whitespace', () => {
      component.editingText.set('   ');
      component.confirmEdit(makeComment());
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('openDeleteDialog', () => {
    beforeEach(() => setupComponent());

    it('should open a dialog', () => {
      const comment = makeComment();
      component.openDeleteDialog(comment);
      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should dispatch deleteComment when dialog closes with true', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(true));
      const comment = makeComment({ id: 'c-delete' });

      component.openDeleteDialog(comment);

      expect(store.dispatch).toHaveBeenCalledWith(PulseDetailsActions.deleteComment({ commentId: 'c-delete' }));
    });

    it('should not dispatch deleteComment when dialog closes with false', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(false));
      const comment = makeComment();

      component.openDeleteDialog(comment);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch deleteComment when dialog is dismissed', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(undefined));
      const comment = makeComment();

      component.openDeleteDialog(comment);

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
