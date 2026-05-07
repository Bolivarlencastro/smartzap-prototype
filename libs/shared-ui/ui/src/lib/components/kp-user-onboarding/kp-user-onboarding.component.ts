import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpMediaPlayerComponent } from '../kp-media-player';
import { KpUserOnboardingService } from '../../services/kp-user-onboarding/kp-user-onboarding.service';

@Component({
  selector: 'kp-user-onboarding',
  imports: [MatDialogModule, MatDialogActions, MatButton, KpMediaPlayerComponent, MatSlideToggleModule, TranslocoPipe],
  templateUrl: './kp-user-onboarding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpUserOnboardingComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public url: string,
    private userOnboardingService: KpUserOnboardingService,
  ) {}

  onSlideToggleChange() {
    const currentState = localStorage.getItem('hideOnboardingTutorial');

    if (currentState === 'true') {
      localStorage.removeItem('hideOnboardingTutorial');
      return;
    }

    localStorage.setItem('hideOnboardingTutorial', 'true');
  }

  close() {
    this.userOnboardingService.closeDialog();
  }
}
