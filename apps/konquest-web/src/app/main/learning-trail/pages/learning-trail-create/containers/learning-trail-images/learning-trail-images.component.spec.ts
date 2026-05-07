import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabGroup } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LearningTrailCreateActions } from '../../store/actions';
import { LearningTrailImagesComponent } from './learning-trail-images.component';

describe('LearningTrailImagesComponent', () => {
  let component: LearningTrailImagesComponent;
  let fixture: ComponentFixture<LearningTrailImagesComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningTrailImagesComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(LearningTrailImagesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should have a tab group', () => {
    const tabGroup = fixture.debugElement.query(By.directive(MatTabGroup));
    expect(tabGroup).toBeTruthy();
  });

  it('should navigate to the previous step', () => {
    component.tabGroup.selectedIndex = 0;
    component.previous();

    expect(store.dispatch).toHaveBeenCalledWith(LearningTrailCreateActions.previousStep());

    component.tabGroup.selectedIndex = 1;
    component.previous();

    expect(component.tabGroup.selectedIndex).toBe(0);
  });

  it('should dispatch the openImageGenerationDialog action', () => {
    const uploadImageType = 'card';

    component.openImageGenDialog(uploadImageType);

    expect(store.dispatch).toHaveBeenCalledWith(
      LearningTrailCreateActions.openImageGenerationDialog({
        uploadImageType,
      }),
    );
  });

  describe('onRemoveImage', () => {
    it('should dispatch the saveLearningTrail action when remove the banner image', () => {
      component.onRemoveImage('banner');

      expect(store.dispatch).toHaveBeenCalledWith(
        LearningTrailCreateActions.saveLearningTrail({
          learningTrail: { holder_image: null },
          skipNavigation: true,
        }),
      );
    });

    it('should dispatch the saveLearningTrail action when remove the card image', () => {
      component.onRemoveImage('card');

      expect(store.dispatch).toHaveBeenCalledWith(
        LearningTrailCreateActions.saveLearningTrail({
          learningTrail: { thumb_image: null },
          skipNavigation: true,
        }),
      );
    });
  });
});
