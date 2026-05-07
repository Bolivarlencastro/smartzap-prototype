import { CourseFinishDialogStrategy } from './course-finish-dialog.strategy';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, of } from 'rxjs';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';

describe('CourseFinishDialogStrategy', () => {
  let dialogMock: jest.Mocked<MatDialog>;
  let confirmationDialogMock: jest.Mocked<KpConfirmDialogComponent>;
  let strategy: CourseFinishDialogStrategy;

  beforeEach(() => {
    confirmationDialogMock = {} as unknown as jest.Mocked<KpConfirmDialogComponent>;
    dialogMock = {
      open: jest.fn().mockReturnValue({
        componentInstance: confirmationDialogMock,
        afterClosed: jest.fn().mockReturnValue(of(EMPTY)),
      }),
    } as unknown as jest.Mocked<MatDialog>;
    strategy = new CourseFinishDialogStrategy(dialogMock);
  });

  it('should open course finish confirmation dialog', () => {
    strategy.showDialog();
    expect(confirmationDialogMock.confirmTitle).toBe('CLASSROOM.COURSE_FINISH_DIALOG.TITLE');
    expect(confirmationDialogMock.confirmMessage).toBe('CLASSROOM.COURSE_FINISH_DIALOG.MESSAGE');
    expect(confirmationDialogMock.positiveButtonLabel).toBe('CLASSROOM.COURSE_FINISH_DIALOG.POSITIVE_BUTTON');
    expect(confirmationDialogMock.negativeButtonLabel).toBe('CLASSROOM.COURSE_FINISH_DIALOG.NEGATIVE_BUTTON');
  });
});
