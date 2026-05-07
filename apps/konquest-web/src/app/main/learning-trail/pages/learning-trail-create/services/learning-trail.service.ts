import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LearningTrail } from '@app/main/learning-trail/model/learning-trail';
import { navigateToTrail } from '@app/shared/services';
import { LearningTrailAPI } from '@core/api/learning-trail.api';
import { ImageGeneratorComponent } from '@keeps-platform-frontend-workspace/image-generator';
import { KpConfirmDialogComponent } from '@keeps-platform-frontend-workspace/ui/kp-confirm-dialog';
import { Observable } from 'rxjs';
import { getLearningTrailNavItems } from '../components/learning-trail-nav-menu/learning-trail-nav-item';
import { LearningTrailImageType } from '../containers/learning-trail-images/learning-trail-images.component';
import { LearningTrailCreateActions } from '../store';

@Injectable({
  providedIn: 'root',
})
export class LearningTrailService {
  static checkLearningTrailId(learningTrailId: string) {
    return LearningTrailCreateActions.loadLearningTrail({ id: learningTrailId });
  }

  static filterNavigationEvents(
    learningTrailId: string | undefined,
    currentLearningTrailId: string | undefined,
  ): boolean {
    return learningTrailId !== currentLearningTrailId;
  }

  constructor(
    private readonly learningTrailAPI: LearningTrailAPI,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {}

  saveLearningTrail(learningTrail: Partial<LearningTrail>) {
    const patchedTrail = this.patchLearningTrail(learningTrail);
    if (learningTrail.id) {
      return this.updateLearningTrail(patchedTrail);
    }
    return this.createLearningTrail(patchedTrail);
  }

  uploadLearningTrailImage(file: File, imageType: LearningTrailImageType): Observable<{ url: string }> {
    return this.learningTrailAPI.postLearningTrailImage({ file, imageType });
  }

  navigateNextStep(learningTrailId: string): void {
    const currentRoute = this.router.url;
    const nextStep = this.getNextStep(currentRoute);
    this.router.navigate([`/learning-trails/create`, learningTrailId, nextStep]);
  }

  navigatePreviousStep(learningTrailId: string): void {
    const previousStepRoute = this.getPreviousStep(this.router.url);
    this.router.navigate([`/learning-trails/create`, learningTrailId, previousStepRoute]);
  }

  openImageGenDialog(uploadImageType: 'banner' | 'card', rootImage: File | string): Observable<any> {
    const uploadType = uploadImageType === 'banner' ? 'TRAIL_BANNER' : 'TRAIL_CARD';

    return this.dialog
      .open<ImageGeneratorComponent>(ImageGeneratorComponent, {
        width: '80vw',
        height: '80vh',
        autoFocus: 'dialog',
        data: {
          uploadType,
          rootImage,
        },
        disableClose: true,
      })
      .afterClosed();
  }

  openReuseGeneratedImageDialog(uploadImageType: 'banner' | 'card') {
    const confirmMessage =
      uploadImageType === 'banner'
        ? 'LEARNING_TRAIL.CREATE.REUSE_GENERATED_IMAGE.BANNER_MESSAGE'
        : 'LEARNING_TRAIL.CREATE.REUSE_GENERATED_IMAGE.CARD_MESSAGE';

    const dialogRefConfirm = this.dialog.open(KpConfirmDialogComponent, { autoFocus: 'dialog', width: '360px' });
    dialogRefConfirm.componentInstance.confirmTitle = 'LEARNING_TRAIL.CREATE.REUSE_GENERATED_IMAGE.TITLE';
    dialogRefConfirm.componentInstance.confirmMessage = confirmMessage;
    dialogRefConfirm.componentInstance.positiveButtonLabel =
      'LEARNING_TRAIL.CREATE.REUSE_GENERATED_IMAGE.POSITIVE_BUTTON_LABEL';
    dialogRefConfirm.componentInstance.negativeButtonLabel =
      'LEARNING_TRAIL.CREATE.REUSE_GENERATED_IMAGE.NEGATIVE_BUTTON_LABEL';

    return dialogRefConfirm.afterClosed();
  }

  private createLearningTrail(learningTrail: Partial<LearningTrail>): Observable<LearningTrail> {
    const patchedTrail = this.patchLearningTrail(learningTrail);
    return this.learningTrailAPI.postLearningTrail(patchedTrail);
  }

  private updateLearningTrail(learningTrail: Partial<LearningTrail>): Observable<LearningTrail> {
    const patchedTrail = this.patchLearningTrail(learningTrail);
    return this.learningTrailAPI.updateLearningTrail(patchedTrail);
  }

  private getNextStep(currentRoute: string): string {
    const currentStepRoute = currentRoute.split('/').pop();
    const navItems = getLearningTrailNavItems();
    const currentStepIndex = navItems.findIndex((item) => item.route === currentStepRoute);
    const nextStep = navItems?.at(currentStepIndex + 1);
    return nextStep?.route || 'info';
  }

  private getPreviousStep(currentRoute: string): string {
    const currentStepRoute = currentRoute.split('/').pop();
    const navItems = getLearningTrailNavItems();
    const currentStepIndex = navItems.findIndex((item) => item.route === currentStepRoute);
    const previousStep = navItems?.at(currentStepIndex - 1);
    return previousStep?.route || 'info';
  }

  getLearningTrailById(id: string): Observable<LearningTrail> {
    return this.learningTrailAPI.getById(id);
  }

  getLearningTrailContents(learningTrailId: string, search: string): Observable<{ Mission: any[]; Pulse: any[] }> {
    return this.learningTrailAPI.getLearningTrailContents(learningTrailId, { search });
  }

  postLearningTrailContent({
    learning_trail,
    mission,
    pulse,
    order,
  }: {
    learning_trail: string;
    mission?: string;
    pulse?: string;
    order: number;
  }): Observable<any> {
    return this.learningTrailAPI.postLearningTrailContent({ learning_trail, mission, pulse, order });
  }

  reorderLearningTrailContent(learningTrailId: string, steps: { step_id: string; order: number }[]): Observable<any> {
    return this.learningTrailAPI.reorderLearningTrailContent(learningTrailId, steps);
  }

  deleteLearningTrailContent(id: string) {
    return this.learningTrailAPI.deleteLearningTrailContent(id);
  }

  private patchLearningTrail(learningTrail: Partial<LearningTrail>): Partial<LearningTrail> {
    const trailClone = structuredClone(learningTrail);
    if (typeof learningTrail.learning_trail_type === 'object') {
      trailClone.learning_trail_type = learningTrail.learning_trail_type.id;
    }
    return trailClone;
  }

  navigateToTrail(id: string): void {
    navigateToTrail(this.router, id, false, true);
  }
}
