import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Mission, MissionStage } from 'app/main/mission/mission.model';
import { Observable } from 'rxjs';
import { ContentUploadService } from '../../services/content-upload.service';
import { MissionActions, MissionSelectors, MissionStageActions, StagesSelectors } from '../../store';
import { KpUploadDialogComponent, KpUploadDialogItem } from '@keeps-platform-frontend-workspace/ui/kp-upload-dialog';
import { MissionFormHeaderComponent } from '../../components/mission-form-header/mission-form-header.component';
import { MissionContentFormComponent } from '../../components/forms/mission-content-form/mission-content-form.component';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-mission-content',
  templateUrl: './mission-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MissionFormHeaderComponent, MissionContentFormComponent, KpUploadDialogComponent, AsyncPipe, TranslocoPipe],
})
export class MissionContentComponent {
  protected readonly mission$: Observable<Mission>;
  protected readonly stages$: Observable<MissionStage[]>;
  protected readonly currentUploads: Signal<KpUploadDialogItem[]>;

  constructor(
    private store: Store,
    private _contentUploadService: ContentUploadService,
  ) {
    this.mission$ = this.store.select(MissionSelectors.selectMission);
    this.stages$ = this.store.select(StagesSelectors.selectStages);
    this.currentUploads = this._contentUploadService.uploads;
  }

  onUploadRemove(file: KpUploadDialogItem) {
    this._contentUploadService.cancelUpload(file.id);
  }

  next() {
    this.store.dispatch(MissionActions.nextStep());
  }

  previous() {
    this.store.dispatch(MissionActions.previousStep());
  }

  onStagesReorder(stages: MissionStage[]) {
    this.store.dispatch(MissionStageActions.reorderStages({ stages }));
  }
}
