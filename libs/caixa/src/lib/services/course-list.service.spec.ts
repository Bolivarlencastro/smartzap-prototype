import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CaixaApi } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { of } from 'rxjs';
import { CardAction } from '../models';
import { CourseEnrollmentActions, CourseListActions } from '../store';
import { CourseListService } from './course-list.service';

describe('CourseListService', () => {
  let service: CourseListService;
  let caixaApi: jest.Mocked<CaixaApi>;
  let messageService: jest.Mocked<KpMessageService>;
  let clipboard: jest.Mocked<Clipboard>;
  let router: jest.Mocked<Router>;
  let dialog: jest.Mocked<MatDialog>;

  beforeEach(() => {
    caixaApi = {
      getCourses: jest.fn().mockReturnValue(of([])),
      getCategories: jest.fn().mockReturnValue(of([])),
    } as any;

    messageService = {
      success: jest.fn(),
    } as any;

    clipboard = {
      copy: jest.fn(),
    } as any;

    router = {
      navigate: jest.fn(),
    } as any;

    dialog = {
      open: jest.fn(),
    } as any;

    service = new CourseListService(caixaApi, messageService, clipboard, router, dialog);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('getCourses', () => {
    it('should delegate to caixaApi.getCourses with the given filter', (done) => {
      const filter = { name: 'Angular' } as any;

      service.getCourses(filter).subscribe(() => {
        expect(caixaApi.getCourses).toHaveBeenCalledWith(filter);
        done();
      });
    });
  });

  describe('getCategories', () => {
    it('should delegate to caixaApi.getCategories', (done) => {
      service.getCategories().subscribe(() => {
        expect(caixaApi.getCategories).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('dispatchAction', () => {
    const courseId = 'course-123';

    it('should return CourseEnrollmentActions.openDialog for "enroll" actionId', () => {
      const action: CardAction = { actionId: 'enroll', courseId };

      const result = service.dispatchAction(action);

      expect(result).toEqual(CourseEnrollmentActions.openDialog({ courseId }));
    });

    it('should return CourseListActions.manageQueryParamsToOpenCourse for "details" actionId', () => {
      const action: CardAction = { actionId: 'details', courseId };

      const result = service.dispatchAction(action);

      expect(result).toEqual(CourseListActions.manageQueryParamsToOpenCourse({ courseId }));
    });

    it('should return CourseListActions.shareCourse for "share" actionId', () => {
      const action: CardAction = { actionId: 'share', courseId };

      const result = service.dispatchAction(action);

      expect(result).toEqual(CourseListActions.shareCourse({ courseId }));
    });

    it('should return undefined for an unknown actionId', () => {
      const action = { actionId: 'unknown' as any, courseId };

      const result = service.dispatchAction(action);

      expect(result).toBeUndefined();
    });
  });

  describe('shareCourse', () => {
    it('should copy the course URL to clipboard', () => {
      const courseId = 'course-456';
      const originalHref = window.location.href;

      service.shareCourse(courseId);

      expect(clipboard.copy).toHaveBeenCalledWith(`${originalHref}?id=${courseId}`);
    });

    it('should show a success message after copying', () => {
      service.shareCourse('course-456');

      expect(messageService.success).toHaveBeenCalledWith('Copiado para área de transferência');
    });
  });

  describe('openCourseDetails', () => {
    it('should open the CourseDetailsComponent dialog with the correct config', () => {
      const afterClosedSubject = of(undefined);
      const dialogRefMock = {
        afterClosed: jest.fn().mockReturnValue(afterClosedSubject),
      } as unknown as MatDialogRef<any>;
      dialog.open.mockReturnValue(dialogRefMock);

      service.openCourseDetails();

      expect(dialog.open).toHaveBeenCalledWith(expect.any(Function), {
        autoFocus: 'dialog',
        panelClass: 'route-dialog-container',
        backdropClass: 'cx-dialog-overlay',
      });
    });

    it('should call manageQueryParams after the dialog closes', () => {
      const afterClosedSubject = of(undefined);
      const dialogRefMock = {
        afterClosed: jest.fn().mockReturnValue(afterClosedSubject),
      } as unknown as MatDialogRef<any>;
      dialog.open.mockReturnValue(dialogRefMock);

      const manageQueryParamsSpy = jest.spyOn(service, 'manageQueryParams');

      service.openCourseDetails();

      expect(manageQueryParamsSpy).toHaveBeenCalledWith();
    });
  });

  describe('manageQueryParams', () => {
    it('should navigate with empty queryParams by default', () => {
      service.manageQueryParams();

      expect(router.navigate).toHaveBeenCalledWith([], { queryParams: {} });
    });

    it('should navigate with the provided queryParams', () => {
      const queryParams = { id: 'course-789' };

      service.manageQueryParams(queryParams);

      expect(router.navigate).toHaveBeenCalledWith([], { queryParams });
    });
  });
});
