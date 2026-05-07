import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { missionCreateFeatureKey, missionCreateInitialState } from '../../store';

import { MissionPresentialLiveComponent } from './mission-presential-live.component';
import { LivePresentialFormComponent } from '../../components/forms/live-presential-form/live-presential-form.component';
import { getTranslocoTestingModule } from '@core/utils/transloco-testing.module';

describe('MissionPresentialLiveComponent', () => {
  let component: MissionPresentialLiveComponent;
  let fixture: ComponentFixture<MissionPresentialLiveComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(MissionPresentialLiveComponent, {
      remove: { imports: [LivePresentialFormComponent] },
      add: { schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });

    await TestBed.configureTestingModule({
      imports: [MissionPresentialLiveComponent, getTranslocoTestingModule()],
      providers: [provideMockStore({ initialState: { [missionCreateFeatureKey]: missionCreateInitialState } })],
    }).compileComponents();

    fixture = TestBed.createComponent(MissionPresentialLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('nextDisabled', () => {
    it('should return true when the form is invalid and the current tab index is 0', () => {
      component.presentialLiveForm = { invalid: true } as unknown as LivePresentialFormComponent;

      component.tabGroup.selectedIndex = 0;

      expect(component.nextDisabled).toBe(true);
    });
  });
});
