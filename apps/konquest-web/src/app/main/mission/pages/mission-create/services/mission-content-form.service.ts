import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@jsverse/transloco';
import { MissionStage, MissionStageContent } from 'app/main/mission/mission.model';
import { filter, tap } from 'rxjs/operators';
import { MissionContentActions, MissionStageActions } from '../store';
import { KpEditDialogKonquestComponent } from '@keeps-platform-frontend-workspace/ui/kp-edit-dialog-konquest';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { ContentFormData, KpContentFormDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-content-dialog';
import { QuizActions } from '@keeps-platform-frontend-workspace/quiz';

@Injectable()
export class MissionContentFormService {
  constructor(
    private store: Store,
    private _dialog: MatDialog,
    private _translateService: TranslocoService,
  ) {}

  createStage(stageName: string, order: number, missionId: string): void {
    this.store.dispatch(
      MissionStageActions.saveStage({
        stage: { name: stageName, order },
        missionId,
      }),
    );
  }

  editStage(stage: MissionStage): void {
    const { id, name, description } = stage;
    const title = marker('MISSION.CREATE.CONTENT.EDIT_STAGE');

    const dialogRef = this._dialog.open(KpEditDialogKonquestComponent, {
      data: {
        title,
        showDescription: true,
        model: { id, name, description },
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((result) => this.store.dispatch(MissionStageActions.editStage({ stage: result }))),
      )
      .subscribe();
  }

  removeStage(stage: MissionStage): void {
    const dialogRefConfirm = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRefConfirm.componentInstance.confirmMessage = marker('MISSION.CREATE.CONTENT.DELETE_STAGE_MESSAGE');
    dialogRefConfirm.componentInstance.confirmTitle = marker('MISSION.CREATE.CONTENT.DELETE_STAGE_TITLE');
    dialogRefConfirm.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    dialogRefConfirm
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => this.store.dispatch(MissionStageActions.removeStage({ id: stage.id }))),
      )
      .subscribe();
  }

  createStageContent(stage: MissionStage): void {
    const width = window.innerWidth < 599 ? '100%' : 'auto';

    const dialogRef = this._dialog.open(KpContentFormDialogComponent, {
      panelClass: 'content-form-dialog',
      data: { moduleName: 'mission', app: 'konquest' },
      width,
      maxWidth: '100%',
      autoFocus: 'dialog',
    });

    dialogRef.componentInstance.showImageHint = false;

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((result: ContentFormData) => this.onCreateContent(result, stage)),
      )
      .subscribe();
  }

  editStageContent(content: MissionStageContent): void {
    const { id, name, description } = content;

    const isQuiz = content.learn_content_type.name === 'Question';
    const title = marker('MISSION.CREATE.CONTENT.EDIT_CONTENT_TITLE');
    const label = isQuiz ? marker('MISSION.CREATE.CONTENT.QUIZ_LABEL') : marker('MISSION.CREATE.CONTENT.NAME_CONTENT');

    const dialogRef = this._dialog.open(KpEditDialogKonquestComponent, {
      data: {
        title: this._translateService.translate(title),
        label: this._translateService.translate(label),
        model: { id, name, description },
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((value) => value),
        tap((result) => this.store.dispatch(MissionContentActions.editStageContent({ content: result }))),
      )
      .subscribe();
  }

  removeStageContent(content: MissionStageContent): void {
    const dialogRefConfirm = this._dialog.open(KpConfirmDialogComponent, { maxWidth: '350px' });
    dialogRefConfirm.componentInstance.confirmMessage = marker('MISSION.CREATE.CONTENT.DELETE_CONTENT_MESSAGE');
    dialogRefConfirm.componentInstance.confirmTitle = marker('MISSION.CREATE.CONTENT.DELETE_CONTENT_TITLE');
    dialogRefConfirm.componentInstance.positiveButtonLabel = 'GENERAL.DELETE';

    dialogRefConfirm
      .afterClosed()
      .pipe(
        filter((value) => value === true),
        tap(() => this.store.dispatch(MissionContentActions.deleteStageContent({ id: content.id }))),
      )
      .subscribe();
  }

  reorderStageContents(contents: MissionStageContent[], stageId: string): void {
    this.store.dispatch(MissionContentActions.reorderStageContent({ contents, id: stageId }));
  }

  editQuiz(content: MissionStageContent): void {
    this.store.dispatch(QuizActions.openQuizEditDialog({ quizId: content.learn_content_id }));
  }

  private onCreateContent(content: ContentFormData, stage: MissionStage): void {
    const { type } = content;

    if (type === 'QUIZ') {
      this.store.dispatch(QuizActions.openQuizWizardDialog({ stageId: stage.id }));
    } else {
      this.store.dispatch(MissionContentActions.uploadFile({ content, stage }));
    }
  }
}
