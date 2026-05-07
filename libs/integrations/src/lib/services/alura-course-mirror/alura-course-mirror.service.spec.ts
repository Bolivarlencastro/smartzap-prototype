import { AluraCourseMirrorService } from './alura-course-mirror.service';
import { MatDialog } from '@angular/material/dialog';
import { AluraIntegrationsApi, CoursesListFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { EMPTY, of, throwError } from 'rxjs';
import { AluraMirrorCourseComponent } from '../../containers/alura-mirror-course/alura-mirror-course.component';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';

describe('AluraCourseMirrorService', () => {
  let service: AluraCourseMirrorService;
  let dialogMock: jest.Mocked<MatDialog>;
  let aluraApiMock: jest.Mocked<AluraIntegrationsApi>;
  let messageServiceMock: jest.Mocked<KpMessageService>;

  beforeEach(async () => {
    dialogMock = {
      open: jest.fn().mockReturnValue({ afterClosed: jest.fn().mockReturnValue(of(EMPTY)) }),
    } as unknown as jest.Mocked<MatDialog>;
    aluraApiMock = {
      getCourses: jest.fn().mockReturnValue(of(EMPTY)),
      batchMirrorCourses: jest.fn().mockReturnValue(of(EMPTY)),
    } as unknown as jest.Mocked<AluraIntegrationsApi>;
    messageServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<KpMessageService>;

    service = new AluraCourseMirrorService(dialogMock, aluraApiMock, messageServiceMock);
  });

  it('should open the mirror courses dialog', () => {
    service.openDialog();

    expect(dialogMock.open).toHaveBeenCalledWith(AluraMirrorCourseComponent, {
      width: '70vw',
      autoFocus: false,
      disableClose: false,
    });
  });

  it('should fetch the courses list', (done) => {
    const mockFilter: CoursesListFilter = { name: 'mock_name' };

    service.fetchCoursesList(mockFilter).subscribe({
      next: () => {
        expect(aluraApiMock.getCourses).toHaveBeenCalledWith(mockFilter);
        done();
      },
    });
  });

  describe('mirrorCourses', () => {
    it('should mirror courses in batch', (done) => {
      const mockIds = ['mock_id_1', 'mock_id_2'];

      service.mirrorCourses(mockIds).subscribe({
        next: () => {
          expect(aluraApiMock.batchMirrorCourses).toHaveBeenCalledWith(mockIds);
          expect(messageServiceMock.success).toHaveBeenCalledWith('INTEGRATIONS.MIRROR_DIALOG.MIRROR_COURSES_SUCCESS');
          done();
        },
      });
    });

    it('should display an erro message on failure', (done) => {
      aluraApiMock.batchMirrorCourses.mockReturnValue(throwError(() => ''));

      service.mirrorCourses([]).subscribe({
        error: () => {
          expect(messageServiceMock.error).toHaveBeenCalledWith('INTEGRATIONS.MIRROR_DIALOG.MIRROR_COURSES_FAILURE');
          done();
        },
      });
    });
  });
});
