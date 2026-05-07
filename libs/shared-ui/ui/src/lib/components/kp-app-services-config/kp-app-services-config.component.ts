import { Component, computed, input, output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppServicesConfig, AppServicesConfigStatus } from '@keeps-platform-frontend-workspace/kp-keeps';

@Component({
  selector: 'kp-app-services-config',
  templateUrl: './kp-app-services-config.component.html',
  imports: [MatSlideToggle, TranslocoPipe, MatDividerModule],
})
export class KpAppServicesConfigComponent {
  appServicesConfig = input<AppServicesConfig>();

  appStatusChanged = output<Omit<AppServicesConfigStatus, 'workspaceId'>>();

  readonly dataSource = computed(() => Object.keys(this.appServicesConfig() || {}));

  onChangeAppStatus({ checked }: MatSlideToggleChange, service: string) {
    this.appStatusChanged.emit({ checked, service });
  }
}
