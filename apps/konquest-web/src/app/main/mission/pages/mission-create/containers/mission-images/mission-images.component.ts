import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TranslocoPipe } from '@jsverse/transloco';
import { KpImagePreviewComponent } from '@keeps-platform-frontend-workspace/ui/kp-image-preview';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MissionFormHeaderComponent } from '../../components/mission-form-header/mission-form-header.component';
import { MissionActions, MissionSelectors } from '../../store';

@Component({
  selector: 'app-mission-images',
  templateUrl: './mission-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MissionFormHeaderComponent, MatTabGroup, MatTab, KpImagePreviewComponent, AsyncPipe, TranslocoPipe],
})
export class MissionImagesComponent {
  protected bannerImage$: Observable<string>;
  protected cardImage$: Observable<string>;
  protected subtitle$: Observable<string>;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(private store: Store) {
    this.bannerImage$ = store.select(MissionSelectors.selectBannerImage);
    this.cardImage$ = store.select(MissionSelectors.selectCardImage);
    this.subtitle$ = store.select(MissionSelectors.selectImagesHeaderSubtitle);
  }

  previous(): void {
    const currentTab = this.tabGroup.selectedIndex;

    if (currentTab === 0) {
      this.store.dispatch(MissionActions.previousStep());
      return;
    }

    this.tabGroup.selectedIndex = currentTab - 1;
  }

  next(): void {
    const currentTab = this.tabGroup.selectedIndex;
    const isLastTab = this.tabGroup._allTabs.length - 1 === currentTab;

    if (isLastTab) {
      this.store.dispatch(MissionActions.nextStep());
      return;
    }

    this.tabGroup.selectedIndex = currentTab + 1;
  }

  openImageGenDialog(uploadImageType: 'banner' | 'card') {
    this.store.dispatch(MissionActions.openImageGenerationDialog({ uploadImageType }));
  }

  onRemoveImage(type: 'banner' | 'card') {
    const mission = type === 'banner' ? { holder_image: null } : { thumb_image: null, vertical_holder_image: null };

    this.store.dispatch(
      MissionActions.saveMission({
        mission,
        skipNavigation: true,
      }),
    );
  }
}
