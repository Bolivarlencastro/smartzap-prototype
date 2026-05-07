import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { KpCountdownDirective } from '@keeps-platform-frontend-workspace/ui/kp-countdown';
import { KpCountdownContainerComponent } from '@keeps-platform-frontend-workspace/ui/kp-countdown-container';
import { TranslocoModule } from '@jsverse/transloco';
import { getTranslocoScope } from '../../transloco-scope.factory';
import { HELP_PANEL_SECTIONS, HelpPanelSection } from '../../models';

@Component({
  selector: 'kp-help-panel',
  imports: [
    MatDialogClose,
    MatIconButton,
    MatIcon,
    TranslocoModule,
    KpCountdownContainerComponent,
    KpCountdownDirective,
  ],
  providers: [getTranslocoScope()],
  templateUrl: './help-panel.component.html',
  styles: [
    `
      .section {
        max-width: 16rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpPanelComponent {
  protected sections: HelpPanelSection[] = HELP_PANEL_SECTIONS;
}
