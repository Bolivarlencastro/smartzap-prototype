import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { globalSettingsFeature } from '@app/shared/store/features';
import { AppServicesConfigStatus, Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { KpAppServicesConfigComponent } from '@keeps-platform-frontend-workspace/ui/kp-app-services-config';
import { Store } from '@ngrx/store';
import { AppServicesConfig, ServicesService } from 'app/shared/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-workspace-settings',
  template: `
    <kp-app-services-config
      [appServicesConfig]="appServicesConfig$ | async"
      (appStatusChanged)="onAppStatusChange($event)"
    ></kp-app-services-config>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KpAppServicesConfigComponent, AsyncPipe],
})
export class WorkspaceSettingsComponent implements OnInit {
  appServicesConfig$!: Observable<AppServicesConfig>;
  workspace: Signal<Workspace>;

  constructor(
    private readonly _servicesService: ServicesService,
    private readonly store: Store,
  ) {
    this.appServicesConfig$ = this._servicesService.appServicesConfigChanged$;
    this.workspace = toSignal(this.store.select(globalSettingsFeature.selectWorkspace));
  }

  ngOnInit() {
    this._servicesService.fetchAppConfig();
  }

  onAppStatusChange(event: Omit<AppServicesConfigStatus, 'workspaceId'>) {
    const workspaceId = this.workspace()?.id;
    this._servicesService.changeWorkspaceService({ ...event, workspaceId });
  }
}
