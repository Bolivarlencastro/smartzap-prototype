import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Integration, IntegrationGroup, IntegrationToggleEvent } from '../../models/integrations-model';

import { TranslocoModule } from '@jsverse/transloco';
import { getTranslocoScope } from '../../utils';
import { IntegrationCardComponent } from '../integration-card/integration-card.component';

@Component({
  selector: 'kp-integrations-list',
  imports: [TranslocoModule, IntegrationCardComponent],
  providers: [getTranslocoScope()],
  template: `
    @for (integrationGroup of integrationGroups; track integrationGroup) {
      <div class="mb-4">
        <h2 class="mb-4 text-lg leading-5">{{ integrationGroup.label | transloco }}</h2>
        <div class="integrations-container">
          @for (integration of integrationGroup.items; track integration) {
            <kp-integration-card
              [integration]="integration"
              (activeChange)="toggleIntegration(integration, $event)"
              (configureToken)="openTokenConfigureDialog()"
              (openInstructions)="openInstallInstructions(integration)"
            ></kp-integration-card>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .integrations-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 400px));
        gap: 16px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationsListComponent {
  @Input({ required: true }) integrationGroups: IntegrationGroup[];
  @Output() integrationToggle = new EventEmitter<IntegrationToggleEvent>();
  @Output() configureToken = new EventEmitter<void>();
  @Output() openInstructions = new EventEmitter<Integration>();

  toggleIntegration(integration: Integration, enabled: boolean) {
    this.integrationToggle.emit({ integration, enabled });
  }

  openTokenConfigureDialog(): void {
    this.configureToken.emit();
  }

  openInstallInstructions(integration: Integration) {
    this.openInstructions.emit(integration);
  }
}
