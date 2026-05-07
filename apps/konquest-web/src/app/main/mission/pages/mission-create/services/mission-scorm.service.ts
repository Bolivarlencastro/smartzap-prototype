import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KontentLearnContentAPI } from '@core/api';
import { KeepsError } from '@core/model/error.model';
import { Store } from '@ngrx/store';
import { ScormContent } from 'app/main/mission/models';
import { BehaviorSubject, combineLatest, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { ScormUploadComponent } from '../components/scorm-upload/scorm-upload.component';
import { MissionScormContentsActions } from '../store';

const SCORM_UPLOAD_ID = 'scorm-upload';

@Injectable({ providedIn: 'root' })
export class MissionScormService {
  private _file = new BehaviorSubject<File | null>(null);
  readonly file$ = this._file.asObservable();

  private _processingUpload = new BehaviorSubject<boolean>(false);
  readonly processingUpload$ = this._processingUpload.asObservable();

  private _errorMessage = new BehaviorSubject<string | null>(null);
  readonly errorMessage$ = this._errorMessage.asObservable();

  private _progress = new BehaviorSubject<number>(0);
  readonly progress$ = this._progress.asObservable();

  get selectedFileName$() {
    return this.file$.pipe(
      filter((file) => !!file),
      map((file: any) => file.name ?? null),
    );
  }

  get uploadDisabled$() {
    const selected$ = this.file$.pipe(map((file) => !file));
    const processing$ = this.processingUpload$;
    return combineLatest([selected$, processing$]).pipe(
      map(([selected, processing]) => {
        return selected || processing;
      }),
    );
  }

  constructor(
    private _dialog: MatDialog,
    private _kontentApi: KontentLearnContentAPI,
    private store: Store,
    private _router: Router,
  ) {}

  openScormUploadDialog(): void {
    this._dialog.open(ScormUploadComponent, {
      disableClose: true,
      height: 'auto',
      id: SCORM_UPLOAD_ID,
    });
  }

  import(duration: string): void {
    const durationInMinutes = this.durationToTimeConverter(duration);
    this._processingUpload.next(true);
    const file = this._file.getValue();
    this._kontentApi
      .scormUpload(file, durationInMinutes.toString())
      .pipe(
        catchError((error) => this.handleUploadError(error)),
        tap((event) => this.handleUploadProgress(event)),
        switchMap((event) => {
          if (event.type === HttpEventType.Response) {
            this._progress.next(0);
            this._processingUpload.next(false);
            this._dialog.getDialogById(SCORM_UPLOAD_ID)?.close();
            this.uploadSuccess(event.body);
          }
          return of(event);
        }),
      )
      .subscribe();
  }

  onChangeFileInput(target: HTMLInputElement) {
    const files: FileList | null = target.files;

    if (!files?.length) {
      return;
    }

    this._errorMessage.next('');

    const file: File | null = files.item(0);

    this._file.next(file);
  }

  resetUploadState(): void {
    this._file.next(null);
    this._errorMessage.next(null);
    this._processingUpload.next(false);
  }

  private uploadSuccess(content: ScormContent): void {
    this._router
      .navigate(['missions/create/scorm/info'])
      .then(() => this.store.dispatch(MissionScormContentsActions.setScormContent({ content })));
  }

  /**
   * Convert durationString in to seconds number
   *
   * @param durationTime string ex: 01:30
   *
   * @returns duration number
   */
  private durationToTimeConverter(durationTime: string): number {
    if (!durationTime) {
      return 0;
    }

    const splitedTime = durationTime.split(':');

    const hours = parseInt(splitedTime[0]);
    const minutes = parseInt(splitedTime[1]);

    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error(`Invalid duration time: ${durationTime}`);
    }

    const hoursInSeconds = hours * 60 * 60;
    const minutesInSeconds = minutes * 60;

    return hoursInSeconds + minutesInSeconds;
  }

  private handleUploadError(error: KeepsError) {
    this._errorMessage.next(error.customMessage);
    this._progress.next(0);
    this._processingUpload.next(false);
    return throwError(() => error);
  }

  private handleUploadProgress(event: HttpEvent<any>) {
    if (event.type === HttpEventType.UploadProgress) {
      if (event.total) {
        const progress = Math.round((event.loaded / event.total) * 100);
        this._progress.next(progress);
      }
    }
  }
}
