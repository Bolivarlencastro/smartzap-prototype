import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImportErrorDialogComponent } from '../components';
import { EnrollmentApiResponse } from 'app/main/courses/model';
import { SmartzapAPI } from '@core/api';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { KpSnackLoadingComponent } from '@keeps-platform-frontend-workspace/ui/kp-snack-loading';

@Injectable({ providedIn: 'root' })
export class EnrollmentsService {
  constructor(
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _http: SmartzapAPI,
  ) {}

  showImportEnrollmentsErrorDialog(data: EnrollmentApiResponse): void {
    const hasErros = data.enrollment_errors.length || data.user_errors.length;

    if (!hasErros) {
      return;
    }

    this._dialog.open(ImportErrorDialogComponent, { data });
  }

  loadTracking(enrollment_id: string): Observable<any> {
    return this._http.get<any>(`/enrollment/${enrollment_id}/tracking`).pipe(map((response) => response.result));
  }

  sendRenewAccess(enrollment_id: string, content_id: string): Observable<any> {
    this._snackBar.openFromComponent(KpSnackLoadingComponent);
    return this._http.post<any>(`/content/${content_id}/enrollment/${enrollment_id}/renew-access`, {});
  }

  getUserByNumber(userNumber: string): Observable<any> {
    return this._http.get(`/user?phone__eq=${userNumber}`);
  }
}
