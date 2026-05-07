import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MissionScormService } from '../../services/mission-scorm.service';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { KpDurationMaskDirective } from '@keeps-platform-frontend-workspace/ui/kp-duration-mask';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-scorm-upload',
  templateUrl: './scorm-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    KpDurationMaskDirective,
    ReactiveFormsModule,
    MatHint,
    MatButton,
    MatProgressBar,
    MatDialogActions,
    MatDialogClose,
    AsyncPipe,
    TranslocoPipe,
  ],
})
export class ScormUploadComponent implements OnDestroy {
  fileName$: Observable<string>;
  uploadDisabled$: Observable<boolean>;
  processing$: Observable<boolean>;
  errorMessage$: Observable<string | null>;
  progress$: Observable<number>;
  durationFormControl = new UntypedFormControl('', [Validators.required]);

  constructor(private _scormService: MissionScormService) {
    this.fileName$ = _scormService.selectedFileName$;
    this.uploadDisabled$ = _scormService.uploadDisabled$;
    this.processing$ = _scormService.processingUpload$;
    this.errorMessage$ = _scormService.errorMessage$;
    this.progress$ = _scormService.progress$;
  }

  ngOnDestroy() {
    this._scormService.resetUploadState();
  }

  onImport(): void {
    this._scormService.import(this.durationFormControl.value);
  }

  onSelectFile({ target }: Event): void {
    this._scormService.onChangeFileInput(target as HTMLInputElement);
  }
}
