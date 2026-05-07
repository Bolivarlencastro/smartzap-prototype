import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KpUserOnboardingComponent } from '../../components/kp-user-onboarding/kp-user-onboarding.component';
import { constants } from '../../constants';

export type VideoType =
  | 'events'
  | 'missions'
  | 'learning-trails'
  | 'pulse'
  | 'channel'
  | 'dashboard'
  | 'enrollments'
  | 'classroom';

const VIDEO_TYPE_MAP = new Map<VideoType, string>([
  ['events', 'https://assets.keepsdev.com/onboarding/Onboarding_Eventos/output.mpd'],
  ['missions', 'https://assets.keepsdev.com/onboarding/Onboarding_Missões/output.mpd'],
  ['learning-trails', 'https://assets.keepsdev.com/onboarding/Onboarding_Trilhas/output.mpd'],
  ['pulse', 'https://assets.keepsdev.com/onboarding/Onboarding_Pulses/output.mpd'],
  ['channel', 'https://assets.keepsdev.com/onboarding/Onboarding_Canal/output.mpd'],
  ['dashboard', 'https://assets.keepsdev.com/onboarding/Onboarding_Dashboard/output.mpd'],
  ['enrollments', 'https://assets.keepsdev.com/onboarding/Onboarding_Painel/output.mpd'],
  ['classroom', 'https://assets.keepsdev.com/onboarding/Onboarding_Classroom/output.mpd'],
]);

@Injectable({
  providedIn: 'root',
})
export class KpUserOnboardingService {
  private isMobile = false;
  private dialogRef: MatDialogRef<KpUserOnboardingComponent> | null;

  constructor(
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.breakpointObserver.observe([`(max-width: ${constants.defaultMobileWidth})`]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  openDialog(videoType: VideoType) {
    if (this.dialogRef || this.isMobile) {
      return;
    }

    const videoURL = VIDEO_TYPE_MAP.get(videoType);
    const hideOnboarding = localStorage.getItem('hideOnboardingTutorial');

    if (hideOnboarding || !videoURL) {
      return;
    }

    this.dialogRef = this.dialog.open(KpUserOnboardingComponent, {
      data: videoURL,
      width: '600px',
    });
  }

  closeDialog() {
    this.dialogRef.close();
    this.dialogRef = null;
  }
}
