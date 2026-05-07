import { ChangeDetectionStrategy, Component, Signal, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { globalSettingsFeature } from '@app/shared/store/features';
import { Workspace, WorkspaceService } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import * as GlobalSettingsActions from '../../../shared/store/actions';
import { ImageUploadV2Component } from '@keeps-platform-frontend-workspace/ui/kp-image-upload-v2';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-workspace-image-upload',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex gap-5 h-60">
      <kp-image-upload-v2
        class="aspect-[1]"
        [matTooltip]="'WORKSPACES.LOGO_LABEL' | transloco"
        [imageSrc]="logo"
        [aspectRatio]="1"
        [resizeToWidth]="200"
        [resizeToHeight]="200"
        (uploadImage)="uploadLogo($event)"
      ></kp-image-upload-v2>

      <kp-image-upload-v2
        class="aspect-[1]"
        [matTooltip]="'WORKSPACES.ICON_LABEL' | transloco"
        [imageSrc]="icon"
        [aspectRatio]="1"
        [resizeToWidth]="200"
        [resizeToHeight]="200"
        (uploadImage)="uploadIcon($event)"
      ></kp-image-upload-v2>
    </div>
  `,
  imports: [ImageUploadV2Component, MatTooltip, TranslocoPipe],
})
export class WorkspaceImageUploadComponent {
  workspace: Signal<Workspace>;
  private _id: string;

  get logo(): string {
    return this.workspace()?.logo_url || '';
  }

  get icon(): string {
    return this.workspace()?.icon_url || '';
  }

  constructor(
    private store: Store,
    private workspaceService: WorkspaceService,
  ) {
    this._id = this.workspaceService.getCurrentWorkspace().id;
    this.workspace = toSignal(store.select(globalSettingsFeature.selectBuildedWorkspace));
  }

  uploadLogo(file: File) {
    this.upload(file, 'logo');
  }

  uploadIcon(file: File) {
    this.upload(file, 'icon');
  }

  private upload(file: File, type: 'icon' | 'logo') {
    this.store.dispatch(GlobalSettingsActions.updateWorkspaceImage({ payload: { workspaceId: this._id, file, type } }));
  }
}
