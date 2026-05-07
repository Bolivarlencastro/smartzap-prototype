import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Params, Router } from '@angular/router';
import { CaixaApi, CaixaCourse, CourseListFilter } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpMessageService } from '@keeps-platform-frontend-workspace/ui/kp-message-service';
import { Observable } from 'rxjs';
import { CourseEnrollmentActions, CourseListActions } from '../store';
import { LearnContentCardActionId } from '@keeps-platform-frontend-workspace/ui/models';
import { CardAction } from '../models';
import { CourseDetailsComponent } from '../containers/course-details/course-details.component';

@Injectable({ providedIn: 'root' })
export class CourseListService {
  constructor(
    private readonly http: CaixaApi,
    private readonly messageService: KpMessageService,
    private readonly clipBoard: Clipboard,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {}

  getCourses(filter: CourseListFilter): Observable<CaixaCourse[]> {
    return this.http.getCourses(filter);
  }

  getCategories() {
    return this.http.getCategories();
  }

  dispatchAction(action: CardAction): any {
    const { actionId, courseId } = action;
    const data = new Map<LearnContentCardActionId, unknown>([
      ['enroll', CourseEnrollmentActions.openDialog({ courseId })],
      ['details', CourseListActions.manageQueryParamsToOpenCourse({ courseId })],
      ['share', CourseListActions.shareCourse({ courseId })],
    ]);

    return data.get(actionId);
  }

  shareCourse(courseId: string) {
    const url = `${window.location.href}?id=${courseId}`;
    this.clipBoard.copy(url);
    this.messageService.success('Copiado para área de transferência');
  }

  openCourseDetails() {
    return this.dialog
      .open(CourseDetailsComponent, {
        autoFocus: 'dialog',
        panelClass: 'route-dialog-container',
        backdropClass: 'cx-dialog-overlay',
      })
      .afterClosed()
      .subscribe(() => this.manageQueryParams());
  }

  manageQueryParams(queryParams: Params = {}) {
    this.router.navigate([], { queryParams });
  }
}
