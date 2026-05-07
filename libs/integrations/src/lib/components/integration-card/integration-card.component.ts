import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterModule } from '@angular/router';
import { Integration } from '../../models/integrations-model';
import { getTranslocoScope } from '../../utils';

import { TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'kp-integration-card',
  imports: [TranslocoModule, MatIconModule, MatButtonModule, MatSlideToggleModule, RouterModule],
  providers: [getTranslocoScope()],
  templateUrl: './integration-card.component.html',
  styleUrls: ['./integration-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationCardComponent {
  @Input() integration: Integration;
  @Output() activeChange = new EventEmitter<boolean>();
  @Output() configureToken = new EventEmitter<void>();
  @Output() openInstructions = new EventEmitter<void>();
  protected readonly REQUEST_INTEGRATION_LINK = 'https://share.hsforms.com/1IHvBjK3BS7-2JArh8NXb2Qe070e';

  get displayToggle() {
    return !this.integration?.disabled && this.integration?.type === 'toggle';
  }

  get displayRequestButton() {
    return !this.integration?.disabled && this.integration?.type === 'request-form';
  }

  constructor(private router: Router) {}

  toggleChanged(event: MatSlideToggleChange) {
    let checked = event.checked;
    if (this.integration.id === 'alura' && !checked) {
      event.source.writeValue(true);
      checked = false;
    }

    this.activeChange.emit(checked);
  }

  navigateToIntegrationManagement(): void {
    this.router.navigate(['/integrations/alura']);
  }

  openTokenConfigureDialog(): void {
    this.configureToken.emit();
  }

  instructionsClick() {
    this.openInstructions.emit();
  }
}
