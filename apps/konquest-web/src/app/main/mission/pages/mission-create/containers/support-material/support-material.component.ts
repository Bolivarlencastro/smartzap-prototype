import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { MissionFormHeaderComponent } from '../../components/mission-form-header/mission-form-header.component';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  MissionActions,
  SupportMaterialActions,
  supportMaterialsFeature,
} from 'app/main/mission/pages/mission-create/store';
import { Store } from '@ngrx/store';
import { SupportMaterialFormComponent } from '../../components/forms/support-material-form/support-material-form.component';
import { SupportMaterialListItemComponent } from '../../components/support-material-list-item.component';
import { SupportMaterial } from '@keeps-platform-frontend-workspace/kp-keeps';
import { SupportMaterialsCreateService } from '../../../../services/support-materials-create.service';
import { KpUploadDialogComponent, KpUploadDialogItem } from '@keeps-platform-frontend-workspace/ui/kp-upload-dialog';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-support-material',
  imports: [
    MissionFormHeaderComponent,
    TranslocoPipe,
    SupportMaterialFormComponent,
    SupportMaterialListItemComponent,
    KpUploadDialogComponent,
  ],
  template: `
    <app-mission-mission-form-header
      class="w-full mb-4"
      [title]="'MISSION.CREATE.NAVIGATION.TITLE.SUPPORT_MATERIAL' | transloco"
      [label]="'MISSION.CREATE.NAVIGATION.SUBTITLE.SUPPORT_MATERIAL' | transloco"
      (next)="next()"
      (previous)="previous()"
    ></app-mission-mission-form-header>

    <app-support-material-form (filesSelected)="uploadFiles($event)"></app-support-material-form>

    @let vm = viewModel();
    @for (supportMaterial of vm.items; track supportMaterial.id) {
      <app-support-material-list-item
        [supportMaterial]="supportMaterial"
        (delete)="deleteSupportMaterial(supportMaterial.id)"
      ></app-support-material-list-item>
    }

    @let uploads = currentUploads();
    @if (uploads) {
      <kp-upload-dialog
        [hidden]="!uploads.length"
        [files]="uploads"
        (remove)="onUploadRemove($event)"
      ></kp-upload-dialog>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportMaterialComponent {
  protected readonly currentUploads: Signal<KpUploadDialogItem[]>;
  protected readonly viewModel: Signal<{ items: SupportMaterial[]; loading: boolean }>;

  constructor(
    private readonly store: Store,
    private readonly supportMaterialsCreateService: SupportMaterialsCreateService,
  ) {
    this.currentUploads = this.supportMaterialsCreateService.uploads;
    this.viewModel = toSignal(this.store.select(supportMaterialsFeature.selectViewModel));
  }

  next() {
    this.store.dispatch(MissionActions.nextStep());
  }

  previous() {
    this.store.dispatch(MissionActions.previousStep());
  }

  uploadFiles(files: File[]) {
    this.store.dispatch(SupportMaterialActions.uploadSupportMaterial({ files }));
  }

  onUploadRemove(upload: KpUploadDialogItem) {
    this.supportMaterialsCreateService.cancelUpload(upload.id);
  }

  deleteSupportMaterial(id: string) {
    this.store.dispatch(SupportMaterialActions.deleteSupportMaterial({ id }));
  }
}
