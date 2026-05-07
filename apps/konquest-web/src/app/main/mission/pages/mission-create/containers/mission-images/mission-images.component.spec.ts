import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MissionActions, missionCreateFeatureKey, missionCreateInitialState } from '../../store';
import { MissionImagesComponent } from './mission-images.component';

describe('MissionImagesComponent', () => {
  let component: MissionImagesComponent;
  let fixture: ComponentFixture<MissionImagesComponent>;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionImagesComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [missionCreateFeatureKey]: missionCreateInitialState } })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionImagesComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(TestBed.inject(Store), 'dispatch');
    fixture.detectChanges();
  });

  it('should dispatch the openImageGenerationDialog action', () => {
    const uploadImageType = 'card';

    component.openImageGenDialog(uploadImageType);

    expect(dispatchSpy).toHaveBeenCalledWith(
      MissionActions.openImageGenerationDialog({
        uploadImageType,
      }),
    );
  });

  describe('onRemoveImage', () => {
    it('should dispatch the saveMission action when remove the banner image', () => {
      component.onRemoveImage('banner');

      expect(dispatchSpy).toHaveBeenCalledWith(
        MissionActions.saveMission({
          mission: { holder_image: null },
          skipNavigation: true,
        }),
      );
    });

    it('should dispatch the saveMission action when remove the card image', () => {
      component.onRemoveImage('card');

      expect(dispatchSpy).toHaveBeenCalledWith(
        MissionActions.saveMission({
          mission: { thumb_image: null, vertical_holder_image: null },
          skipNavigation: true,
        }),
      );
    });
  });
});
