import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { constants } from '../../constants';
import { KpWorkspaceCardData } from './kp-workspace-card-data';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCard, MatCardImage, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'kp-workspace-card',
  templateUrl: './kp-workspace-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCard, MatCardImage, MatCardContent, MatTooltip],
})
export class KpWorkspaceCardComponent {
  @Input() workspace!: KpWorkspaceCardData;
  @Input() currentWorkspace!: boolean;
  @Output() workspaceSelected = new EventEmitter<void>();

  private readonly defaultWorkspaceLogo = constants.defaultWorkspaceLogo;

  cardClicked(): void {
    this.workspaceSelected.emit();
  }

  get workspaceLogoUrl(): string {
    return `url('${this.workspace?.logo_url || this.defaultWorkspaceLogo}')`;
  }
}
