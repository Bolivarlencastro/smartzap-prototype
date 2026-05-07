import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Workspace } from '@keeps-platform-frontend-workspace/kp-keeps';
import { fuseAnimations } from '@keeps-platform-frontend-workspace/layout';
import { TranslocoPipe } from '@jsverse/transloco';

const DEFAULT_WORKSPACE_PLACEHOLDER = 'https://assets.keepsdev.com/images/placeholders/company-placeholder.png';

@Component({
  selector: 'app-workspace-page-wrapper',
  templateUrl: './workspace-page-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  imports: [TranslocoPipe],
})
export class WorkspacePageWrapperComponent {
  placeholder = DEFAULT_WORKSPACE_PLACEHOLDER;
  @Input() workspace: Workspace;
}
