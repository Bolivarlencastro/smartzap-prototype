import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TranslocoModule } from '@jsverse/transloco';
import { KpImagePreviewComponent } from '@keeps-platform-frontend-workspace/ui/kp-image-preview';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LearningTrailFormHeaderComponent } from '../../components/learning-trail-form-header/learning-trail-form-header.component';
import { LearningTrailCreateActions } from '../../store';
import { learningTrailCreateFeature } from '../../store/features/learning-trail-create.feature';

export type LearningTrailImageType = 'holder_image' | 'thumb_image';

export interface LearningTrailImageUpload {
  file: File;
  imageType: LearningTrailImageType;
}

@Component({
  selector: 'app-learning-trail-images',
  imports: [
    CommonModule,
    KpImagePreviewComponent,
    MatTabGroup,
    MatTab,
    TranslocoModule,
    LearningTrailFormHeaderComponent,
  ],
  template: `
    <app-learning-trail-form-header
      class="w-full mb-4"
      [title]="'LEARNING_TRAIL.STEP.IMAGES.TITLE' | transloco"
      [label]="'LEARNING_TRAIL.STEP.IMAGES.SUBTITLE' | transloco"
      [hidePrevious]="false"
      (next)="next()"
      (previous)="previous()"
    ></app-learning-trail-form-header>

    <mat-tab-group #tabGroup>
      <mat-tab [label]="'LEARNING_TRAIL.STEP.IMAGES.BANNER' | transloco">
        <div class="p-5">
          <kp-image-preview
            class="mx-auto aspect-3"
            [image]="bannerImage$ | async"
            aspectRatioStr="3:1"
            (remove)="onRemoveImage('banner')"
            (openDialog)="openImageGenDialog('banner')"
          ></kp-image-preview>
        </div>
      </mat-tab>
      <mat-tab [label]="'LEARNING_TRAIL.STEP.IMAGES.CARD' | transloco">
        <div class="p-5">
          <kp-image-preview
            class="max-h-96 mx-auto aspect-[16/9]"
            [image]="cardImage$ | async"
            aspectRatioStr="16:9"
            (remove)="onRemoveImage('card')"
            (openDialog)="openImageGenDialog('card')"
          ></kp-image-preview>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningTrailImagesComponent {
  protected bannerImage$: Observable<string>;
  protected cardImage$: Observable<string>;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(private store: Store) {
    this.bannerImage$ = store.select(learningTrailCreateFeature.selectLearningTrailHolderImage);
    this.cardImage$ = store.select(learningTrailCreateFeature.selectLearningTrailThumbImage);
  }

  openImageGenDialog(uploadImageType: 'banner' | 'card') {
    this.store.dispatch(LearningTrailCreateActions.openImageGenerationDialog({ uploadImageType }));
  }

  onRemoveImage(type: 'banner' | 'card') {
    const learningTrail = type === 'banner' ? { holder_image: null } : { thumb_image: null };

    this.store.dispatch(LearningTrailCreateActions.saveLearningTrail({ learningTrail, skipNavigation: true }));
  }

  previous(): void {
    const currentTab = this.tabGroup.selectedIndex;

    if (currentTab === 0) {
      this.store.dispatch(LearningTrailCreateActions.previousStep());
      return;
    }

    this.tabGroup.selectedIndex = currentTab - 1;
  }

  next(): void {
    const currentTab = this.tabGroup.selectedIndex;
    const isLastTab = this.tabGroup._allTabs.length - 1 === currentTab;

    if (isLastTab) {
      this.store.dispatch(LearningTrailCreateActions.nextStep());
      return;
    }

    this.tabGroup.selectedIndex = currentTab + 1;
  }
}
