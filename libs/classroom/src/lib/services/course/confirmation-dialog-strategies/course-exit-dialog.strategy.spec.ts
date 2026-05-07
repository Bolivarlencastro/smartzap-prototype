import { CourseExitDialogStrategy } from './course-exit-dialog.strategy';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, of } from 'rxjs';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { TranslocoService } from '@jsverse/transloco';
import { Course } from '@keeps-platform-frontend-workspace/kp-keeps';

describe('CourseFinishDialogStrategy', () => {
  let dialogMock: jest.Mocked<MatDialog>;
  let confirmationDialogMock: jest.Mocked<KpConfirmDialogComponent>;
  let translocoServiceMock: jest.Mocked<TranslocoService>;

  beforeEach(() => {
    confirmationDialogMock = {} as unknown as jest.Mocked<KpConfirmDialogComponent>;
    dialogMock = {
      open: jest.fn().mockReturnValue({
        componentInstance: confirmationDialogMock,
        afterClosed: jest.fn().mockReturnValue(of(EMPTY)),
      }),
    } as unknown as jest.Mocked<MatDialog>;
    translocoServiceMock = {
      translate: jest.fn().mockImplementation((translateLabel: string, _value: unknown) => translateLabel),
    } as unknown as jest.Mocked<TranslocoService>;
  });

  it('should open course exit confirmation dialog when there is no goal date', () => {
    const course = {} as Course;
    new CourseExitDialogStrategy(course, dialogMock, translocoServiceMock).showDialog();

    expect(confirmationDialogMock.confirmTitle).toBe('CLASSROOM.GET_OUT_DIALOG.TITLE');
    expect(confirmationDialogMock.confirmMessage).toBe('CLASSROOM.GET_OUT_DIALOG.DESCRIPTION');
    expect(confirmationDialogMock.positiveButtonLabel).toBe('CLASSROOM.GET_OUT_DIALOG.POSITIVE_BUTTON_LABEL');
    expect(confirmationDialogMock.negativeButtonLabel).toBe('CLASSROOM.GET_OUT_DIALOG.CANCEL_BUTTON_LABEL');
  });

  it('should open course exit confirmation dialog when there is a goal date', () => {
    const course = { enrollment: { goal_date: '2024-08-10' } } as Course;
    new CourseExitDialogStrategy(course, dialogMock, translocoServiceMock).showDialog();

    expect(confirmationDialogMock.confirmTitle).toBe('CLASSROOM.GET_OUT_DIALOG.TITLE');
    expect(confirmationDialogMock.confirmMessage).toBe('CLASSROOM.GET_OUT_DIALOG.DESCRIPTION_WITH_GOAL_DATE');
    expect(confirmationDialogMock.positiveButtonLabel).toBe('CLASSROOM.GET_OUT_DIALOG.POSITIVE_BUTTON_LABEL');
    expect(confirmationDialogMock.negativeButtonLabel).toBe('CLASSROOM.GET_OUT_DIALOG.CANCEL_BUTTON_LABEL');
    expect(translocoServiceMock.translate).toHaveBeenCalledWith('CLASSROOM.GET_OUT_DIALOG.DESCRIPTION_WITH_GOAL_DATE', {
      value: '08/10/2024',
    });
  });
});
