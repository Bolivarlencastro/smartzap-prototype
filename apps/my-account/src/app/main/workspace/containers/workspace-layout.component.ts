import { ChangeDetectionStrategy, Component, Signal, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { globalSettingsFeature } from '@app/shared/store/features';
import { Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { Store } from '@ngrx/store';
import * as GlobalSettingsActions from '../../../shared/store/actions';
import { WorkspaceImageUploadComponent } from './workspace-image-upload.component';
import { KpColorPaletteComponent } from '@keeps-platform-frontend-workspace/ui/kp-color-palette';
import { ColorPickerComponent } from '@keeps-platform-frontend-workspace/ui/kp-color-picker';
import { WorkspaceDarkSwitchComponent } from 'app/main/workspace/components';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-workspace-layout',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full">
      <app-workspace-image-upload></app-workspace-image-upload>
      <kp-color-palette [selectedTheme]="themeColor" (colorChanged)="colorChanged($event)"></kp-color-palette>
      <h3 class="font-weight-900 mt-6 mb-2">
        {{ 'WORKSPACES.DETAIL.COLOR-PICKER' | transloco }}
      </h3>
      <kp-color-picker [color]="themeColor" (colorChange)="colorChanged($event)"></kp-color-picker>

      <h3 class="font-weight-900 mt-6 mb-2">
        {{ 'WORKSPACES.DETAIL.DARK-THEME' | transloco }}
      </h3>
      <app-workspace-dark-switch
        [isDarkTheme]="workspace()?.theme_dark"
        (toggled)="toggleDarkTheme($event)"
      ></app-workspace-dark-switch>
    </div>
  `,
  imports: [
    WorkspaceImageUploadComponent,
    KpColorPaletteComponent,
    ColorPickerComponent,
    WorkspaceDarkSwitchComponent,
    TranslocoPipe,
  ],
})
export class WorkspaceLayoutComponent {
  workspace: Signal<Workspace>;

  get themeColor(): string {
    return this.workspace()?.custom_color || '';
  }

  constructor(private store: Store) {
    this.workspace = toSignal(store.select(globalSettingsFeature.selectBuildedWorkspace));
  }

  colorChanged(custom_color: string) {
    this.store.dispatch(GlobalSettingsActions.updateWorkspaceCustomColor({ custom_color }));
  }

  toggleDarkTheme(theme_dark: boolean): void {
    this.store.dispatch(GlobalSettingsActions.updateWorkspaceDarkTheme({ theme_dark }));
  }
}
